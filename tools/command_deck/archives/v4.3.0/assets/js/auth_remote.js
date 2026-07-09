/**
 * SYS_OS v4.0 — Remote Auth Foundation (Supabase login boundary)
 *
 * Prepares a REAL login boundary using Supabase Auth, WITHOUT replacing the
 * existing local auth/RBAC or lock/unlock. Safe no-op when the Supabase SDK or
 * config is absent (the default shipped state): isConfigured() → false, the app
 * runs LOCAL exactly as v3.9. No secrets, no hardcoded credentials.
 *
 * The Supabase JS SDK is NOT bundled (strict CSP). The operator loads it + sets
 * runtime config (window.__SYSOS_RUNTIME__.BACKEND) per pilot_backend/README.md;
 * this module then uses window.supabase if present.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() {
        const base = (SYSOS.CONFIG && SYSOS.CONFIG.BACKEND) || {};
        const rt = (window.__SYSOS_RUNTIME__ && window.__SYSOS_RUNTIME__.BACKEND) || {};
        return Object.assign({}, base, rt);
    }

    let _client = null;
    function client() {
        if (_client) return _client;
        const c = cfg();
        if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
        if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return null;
        try { _client = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY); }
        catch (e) { console.warn('[SYS_OS:auth_remote] client init failed', e); _client = null; }
        return _client;
    }

    function audit(action, meta) {
        try { if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record(
            Object.assign({ action: action, domain: 'auth_remote', target: 'supabase', source: 'auth_remote' }, meta || {})); }
        catch (e) { /* never break */ }
    }

    const authRemote = {
        /** SDK + config + enabled all present? */
        isConfigured: function () {
            const c = cfg();
            return !!(window.supabase && c.REMOTE_ENABLED && c.SUPABASE_URL && c.SUPABASE_ANON_KEY);
        },
        sdkAvailable: function () { return !!(window.supabase && typeof window.supabase.createClient === 'function'); },

        getSession: async function () {
            const cl = client(); if (!cl) return null;
            try { const { data } = await cl.auth.getSession(); return data ? data.session : null; }
            catch (e) { return null; }
        },
        getUser: async function () {
            const cl = client(); if (!cl) return null;
            try { const { data } = await cl.auth.getUser(); return data ? data.user : null; }
            catch (e) { return null; }
        },
        signIn: async function (email, password) {
            const cl = client();
            if (!cl) { return { ok: false, reason: 'not_configured' }; }
            try {
                const { data, error } = await cl.auth.signInWithPassword({ email: email, password: password });
                if (error) { audit('auth_remote.sign_in_failed', { reason: error.message }); return { ok: false, reason: error.message }; }
                audit('auth_remote.signed_in', { notes: (data.user && data.user.email) || '' });
                return { ok: true, user: data.user };
            } catch (e) { return { ok: false, reason: String(e.message || e) }; }
        },
        signOut: async function () {
            const cl = client();
            if (!cl) return { ok: false, reason: 'not_configured' };
            try { await cl.auth.signOut(); audit('auth_remote.signed_out', {}); return { ok: true }; }
            catch (e) { return { ok: false, reason: String(e.message || e) }; }
        },
        onAuthStateChange: function (fn) {
            const cl = client(); if (!cl) return { unsubscribe: function () {} };
            try { return cl.auth.onAuthStateChange(function (evt, session) { fn(evt, session); }); }
            catch (e) { return { unsubscribe: function () {} }; }
        },
        client: client,

        /** Honest status object for the UI / guard. */
        getAuthStatus: async function () {
            const c = cfg();
            if (!this.sdkAvailable()) return { status: 'SDK_MISSING', configured: false, authenticated: false, detail: 'Supabase JS SDK not loaded (see pilot_backend/README.md)' };
            if (!c.REMOTE_ENABLED || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return { status: 'CONFIG_MISSING', configured: false, authenticated: false, detail: 'Supabase URL/anon key not configured (runtime config required)' };
            const session = await this.getSession();
            return { status: session ? 'AUTHENTICATED' : 'UNAUTHENTICATED', configured: true, authenticated: !!session,
                detail: session ? ('signed in' + (session.user ? ' as ' + session.user.email : '')) : 'configured; sign-in required' };
        },

        init: function () {
            // Foundation: just record what was detected. No boot gating yet
            // (LOCAL preserved). A future release flips the login boundary on for
            // STAGING/PRODUCTION profiles.
            const c = cfg();
            audit('auth_remote.detected', { result: this.isConfigured() ? 'configured' : 'not_configured',
                metadata: { sdk: this.sdkAvailable(), enabled: !!c.REMOTE_ENABLED } });
        }
    };

    SYSOS.authRemote = authRemote;
})();
