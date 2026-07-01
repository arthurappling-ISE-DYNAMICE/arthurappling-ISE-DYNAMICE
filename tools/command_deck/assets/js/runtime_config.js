/**
 * SYS_OS v4.4.3 — Runtime Config / CSP / Hosting Authority
 *
 * Single source of truth for: the BACKEND config merge (CONFIG.BACKEND +
 * window.__SYSOS_RUNTIME__.BACKEND), Supabase URL/anon-key format validation,
 * CSP-Supabase-origin detection, and hosting-state detection. Replaces four
 * independent copies of this logic previously duplicated across auth_remote.js,
 * remote_backend.js, environment.js, and monitoring.js (Sonnet 5 architecture
 * review, v4.4.2).
 *
 * RULES (unchanged from the modules this replaces):
 *   - No secrets stored beyond what CONFIG/__SYSOS_RUNTIME__ already hold.
 *   - No secret VALUES are ever returned by any function here — only booleans,
 *     enums, and redacted metadata (origin, shape-valid, length-class).
 *   - No network calls. All checks are static/format-level.
 *   - Missing CONFIG or window.__SYSOS_RUNTIME__ must never throw — always
 *     resolve to the LOCAL defaults.
 *   - Placeholders (e.g. 'YOUR_PROJECT_REF') must resolve to CONFIG_REQUIRED,
 *     never to CONFIGURED/PASS.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const LOCAL_DEFAULTS = Object.freeze({
        MODE: 'local', BACKEND_MODE: 'local', REMOTE_ENABLED: false,
        SUPABASE_URL: '', SUPABASE_ANON_KEY: '', KV_TABLE: 'sysos_kv_state'
    });

    const PLACEHOLDER_MARKERS = ['YOUR_PROJECT_REF', 'YOUR_SUPABASE_ANON_PUBLIC_KEY', 'YOUR_GOOGLE_API_KEY_HERE'];

    function hasPlaceholder(s) {
        return PLACEHOLDER_MARKERS.some(function (m) { return String(s || '').indexOf(m) !== -1; });
    }

    // ---------- 1. Central backend-config merge (was duplicated 4x) ----------
    function getBackendConfig() {
        const base = (SYSOS.CONFIG && SYSOS.CONFIG.BACKEND) || {};
        const rt = (window.__SYSOS_RUNTIME__ && window.__SYSOS_RUNTIME__.BACKEND) || {};
        return Object.assign({}, LOCAL_DEFAULTS, base, rt);
    }
    function isRemoteEnabled() { return !!getBackendConfig().REMOTE_ENABLED; }

    // ---------- 2. Supabase URL / anon-key validation (non-secret, format only) ----------
    /**
     * Validates the Supabase URL shape. Never network-checked.
     * Returns { status, origin } where status is one of:
     *   CONFIG_REQUIRED (empty/placeholder) | CONFIG_INVALID (malformed/non-https/
     *   wrong host suffix) | CONFIGURED (well-formed https *.supabase.co URL).
     */
    function validateSupabaseUrl(url) {
        url = url == null ? getBackendConfig().SUPABASE_URL : url;
        if (!url || hasPlaceholder(url)) return { status: 'CONFIG_REQUIRED', origin: null };
        let parsed;
        try { parsed = new URL(url); } catch (e) { return { status: 'CONFIG_INVALID', origin: null, reason: 'not a valid URL' }; }
        if (parsed.protocol !== 'https:') return { status: 'CONFIG_INVALID', origin: parsed.origin, reason: 'must be https' };
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return { status: 'CONFIG_INVALID', origin: parsed.origin, reason: 'localhost is not a production Supabase host' };
        if (!/\.supabase\.co$/i.test(parsed.hostname)) return { status: 'CONFIG_INVALID', origin: parsed.origin, reason: 'hostname does not end with .supabase.co' };
        return { status: 'CONFIGURED', origin: parsed.origin };
    }
    /**
     * Validates the anon-key SHAPE only — never inspects or returns the value.
     * Flags an obvious service-role misconfiguration by key NAME, not content
     * (this module never receives or parses decoded JWT claims).
     * Returns { status, present, shapeValid, length } — length is a class
     * ('short'|'jwt-like'|'other'), never the raw value or its exact length in
     * a way that narrows brute-force (bucketed, not exact after 40 chars).
     */
    function validateAnonKeyShape(key) {
        const cfgKey = key == null ? getBackendConfig().SUPABASE_ANON_KEY : key;
        if (!cfgKey || hasPlaceholder(cfgKey)) return { status: 'CONFIG_REQUIRED', present: false, shapeValid: false };
        if (typeof cfgKey !== 'string') return { status: 'CONFIG_INVALID', present: true, shapeValid: false };
        // Detect an obvious service-role field name leak (never inspects decoded claims).
        if (/service[_-]?role/i.test(cfgKey)) return { status: 'BLOCK', present: true, shapeValid: false, reason: 'value appears to reference a service-role key — anon key only' };
        const looksJwt = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(cfgKey);
        const lengthClass = cfgKey.length < 20 ? 'short' : (looksJwt ? 'jwt-like' : 'other');
        if (!looksJwt) return { status: 'CONFIG_INVALID', present: true, shapeValid: false, lengthClass: lengthClass, reason: 'does not look like a JWT-shaped anon key' };
        return { status: 'CONFIGURED', present: true, shapeValid: true, lengthClass: lengthClass };
    }
    /** Combined honest configuration status (was authRemote.isConfigured()). */
    function isSupabaseConfigured() {
        const c = getBackendConfig();
        if (!c.REMOTE_ENABLED) return { status: 'LOCAL', ok: false };
        if (!(window.supabase && typeof window.supabase.createClient === 'function')) return { status: 'CONFIG_REQUIRED', ok: false, reason: 'Supabase SDK not loaded' };
        const urlV = validateSupabaseUrl(c.SUPABASE_URL);
        if (urlV.status !== 'CONFIGURED') return { status: urlV.status, ok: false, reason: urlV.reason || 'Supabase URL not configured' };
        const keyV = validateAnonKeyShape(c.SUPABASE_ANON_KEY);
        if (keyV.status !== 'CONFIGURED') return { status: keyV.status, ok: false, reason: keyV.reason || 'Supabase anon key not configured' };
        return { status: 'CONFIGURED', ok: true, origin: urlV.origin };
    }
    function getSupabaseOrigin() {
        const v = validateSupabaseUrl();
        return v.status === 'CONFIGURED' ? v.origin : null;
    }

    // ---------- 3. CSP / Supabase-origin detection (was duplicated 2x) ----------
    function getCspMeta() {
        try {
            const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            return meta ? (meta.getAttribute('content') || '') : '';
        } catch (e) { return ''; }
    }
    /**
     * Returns { state, detail, origin }. state is one of:
     *   LOCAL_ONLY (no Supabase URL configured) |
     *   CONFIG_INVALID (Supabase URL malformed) |
     *   BLOCK (Supabase URL valid but CSP does not allow its origin) |
     *   PASS (Supabase URL valid and CSP includes its exact origin).
     * No wildcard match is ever accepted as PASS.
     */
    function getCspSupabaseState() {
        const c = getBackendConfig();
        if (!c.SUPABASE_URL || hasPlaceholder(c.SUPABASE_URL)) return { state: 'LOCAL_ONLY', detail: 'no Supabase configured — CSP self/localhost only', origin: null };
        const urlV = validateSupabaseUrl(c.SUPABASE_URL);
        if (urlV.status !== 'CONFIGURED') return { state: 'CONFIG_INVALID', detail: 'Supabase URL malformed: ' + (urlV.reason || 'invalid'), origin: urlV.origin };
        const csp = getCspMeta();
        const originPresent = csp.indexOf(urlV.origin) !== -1;
        return originPresent
            ? { state: 'PASS', detail: 'CSP allows ' + urlV.origin, origin: urlV.origin }
            : { state: 'BLOCK', detail: 'add connect-src ' + urlV.origin + ' to the CSP', origin: urlV.origin };
    }

    // ---------- 4. Hosting-state detection (was two fidelity levels) ----------
    /**
     * Single hosting authority consumed by BOTH the Production Guard and the
     * Deployment Readiness panel, so they can never disagree.
     * States: LOCAL | HTTPS_PRESENT | GITHUB_PAGES_VERIFIED | BLOCK.
     */
    function getHostingState() {
        const host = location.hostname;
        const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '';
        const secure = !!window.isSecureContext;
        const suffix = (SYSOS.CONFIG && SYSOS.CONFIG.DEPLOY && SYSOS.CONFIG.DEPLOY.GITHUB_PAGES_HOST_SUFFIX) || '.github.io';
        const onPages = new RegExp(suffix.replace('.', '\\.') + '$').test(host);
        if (onPages && secure) return { state: 'GITHUB_PAGES_VERIFIED', detail: 'hosted on ' + host + ' over HTTPS' };
        if (isLocalhost) return { state: 'LOCAL', detail: 'local dev context (' + (secure ? 'secure' : 'insecure') + ')' };
        if (secure) return { state: 'HTTPS_PRESENT', detail: 'secure context, but not a verified GitHub Pages host (' + host + ')' };
        return { state: 'BLOCK', detail: 'not a secure context — vault hash would degrade' };
    }

    // ---------- 5. Aggregate summary (non-secret; safe to render/log) ----------
    function getRuntimeHealthSummary() {
        const supa = isSupabaseConfigured();
        const csp = getCspSupabaseState();
        const hosting = getHostingState();
        return {
            backendMode: getBackendConfig().REMOTE_ENABLED ? 'remote_supabase' : 'local',
            supabase: supa,
            csp: csp,
            hosting: hosting
        };
    }

    SYSOS.runtimeConfig = {
        getBackendConfig: getBackendConfig,
        isRemoteEnabled: isRemoteEnabled,
        isSupabaseConfigured: isSupabaseConfigured,
        validateSupabaseUrl: validateSupabaseUrl,
        validateAnonKeyShape: validateAnonKeyShape,
        getSupabaseOrigin: getSupabaseOrigin,
        getCspMeta: getCspMeta,
        getCspSupabaseState: getCspSupabaseState,
        getHostingState: getHostingState,
        getRuntimeHealthSummary: getRuntimeHealthSummary
    };
})();
