/**
 * SYS_OS v3.9 — Environment Profiles + Production Config Guard
 *
 * A HONEST deployment-discipline safety layer. SYS_OS understands which
 * environment it runs in (DEV/LOCAL/STAGING/PRODUCTION) and BLOCKS unsafe
 * production behavior before any real hosting/auth/backend exists. This is NOT
 * production security — it prevents footguns and states the truth: SYS_OS is
 * local-first only until backend auth, durable persistence, hosting, HTTPS,
 * backups, and monitoring are implemented.
 *
 * Additive: default profile is LOCAL, where behavior is identical to v3.8.
 * Guards only activate in PRODUCTION (and warn in STAGING).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };
    const PROFILE_KEY = 'sysos.environment.profile';

    const PROFILES = Object.freeze({
        DEV: Object.freeze({ name: 'DEV', label: 'DEVELOPMENT', purpose: 'Engineering / testing.',
            risk: 'LOW', indicator: 'text-sky-400', blocked: [], guard: 'INACTIVE',
            allowed: ['demo', 'reset', 'backup', 'restore'], warnings: [] }),
        LOCAL: Object.freeze({ name: 'LOCAL', label: 'LOCAL SOVEREIGN', purpose: 'Single trusted operator, local-first (default).',
            risk: 'LOW', indicator: 'text-emerald-400', blocked: [], guard: 'INACTIVE',
            allowed: ['demo', 'reset', 'backup', 'restore'], warnings: [] }),
        STAGING: Object.freeze({ name: 'STAGING', label: 'STAGING', purpose: 'Pre-production rehearsal.',
            risk: 'MEDIUM', indicator: 'text-amber-400', blocked: [], guard: 'ADVISORY',
            allowed: ['demo', 'reset', 'backup', 'restore'],
            warnings: ['Not production-secure — local-first only.', 'Backend auth, server persistence, hosting, monitoring not present.'] }),
        PRODUCTION: Object.freeze({ name: 'PRODUCTION', label: 'PRODUCTION', purpose: 'Live client use (gated).',
            risk: 'CRITICAL', indicator: 'text-red-400', blocked: ['demo', 'reset', 'unlocked_boot'], guard: 'ACTIVE',
            allowed: ['backup'],
            warnings: ['SYS_OS is NOT production-secure.', 'Backend authentication missing.', 'Server persistence missing.',
                'Hosting not configured.', 'Monitoring missing.'] })
    });

    function detect() {
        try {
            const u = new URLSearchParams(location.search).get('profile');
            if (u && PROFILES[u.toUpperCase()]) return u.toUpperCase();
        } catch (e) { /* no URL */ }
        const stored = SYSOS.storage.get(PROFILE_KEY);
        if (stored && PROFILES[stored]) return stored;
        if (SYSOS.CONFIG && SYSOS.CONFIG.PROFILE && PROFILES[SYSOS.CONFIG.PROFILE]) return SYSOS.CONFIG.PROFILE;
        return 'LOCAL';
    }

    let _current = 'LOCAL';

    function auditEv(action, meta) {
        try {
            if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record(
                Object.assign({ action: action, domain: 'environment', target: _current, source: 'environment' }, meta || {}));
        } catch (e) { /* never break */ }
    }

    function rules(name) { return PROFILES[name || _current] || PROFILES.LOCAL; }

    // ---------- v4.3/v4.4.3 deployment-rehearsal helpers ----------
    // v4.4.3: backend-config merge, CSP-origin state, and hosting state now live
    // in one place — runtime_config.js. This module reads through it rather than
    // duplicating the logic (Sonnet 5 architecture review, v4.4.2).
    const DEPLOY_RLS_KEY = (SYSOS.CONFIG && SYSOS.CONFIG.DEPLOY && SYSOS.CONFIG.DEPLOY.RLS_STATUS_KEY) || 'sysos.deploy.rls.v1';

    /** Honest RLS status model (v4.4.3) — replaces the loose true/false self-attestation. */
    const RLS_STATUSES = Object.freeze({
        NOT_TESTED: 'NOT_TESTED',
        CHECKLIST_STARTED: 'CHECKLIST_STARTED',
        OPERATOR_ATTESTED: 'OPERATOR_ATTESTED',
        TECHNICAL_VERIFICATION_REQUIRED: 'TECHNICAL_VERIFICATION_REQUIRED',
        TECHNICALLY_VERIFIED: 'TECHNICALLY_VERIFIED',
        FAILED: 'FAILED',
        CONFIG_REQUIRED: 'CONFIG_REQUIRED'
    });

    function supabaseConfigured() { return !!SYSOS.runtimeConfig.isSupabaseConfigured().ok; }
    function cspSupabaseState() { return SYSOS.runtimeConfig.getCspSupabaseState(); }
    function hostingState() { return SYSOS.runtimeConfig.getHostingState(); }

    function readRLS() {
        try { const raw = SYSOS.storage.get(DEPLOY_RLS_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
        return { status: RLS_STATUSES.NOT_TESTED, recordedAt: null, by: null };
    }
    /** Current Supabase project ref (subdomain of the configured origin), or null. */
    function currentProjectRef() {
        const origin = SYSOS.runtimeConfig.getSupabaseOrigin();
        return origin ? origin.replace('https://', '').split('.')[0] : null;
    }
    /**
     * v4.5.4: integrity gate for a stored TECHNICALLY_VERIFIED record. Returns
     * null when the record is trustworthy, else a human-readable reason. A
     * record only counts if it was produced by the live two-user machine test,
     * confirmed its own cleanup, belongs to the CURRENTLY configured project,
     * and is not stale. Anything else derives down to
     * TECHNICAL_VERIFICATION_REQUIRED — the record itself is never mutated.
     */
    function validateTechRecord(rec) {
        if (rec.method !== 'live_two_user_machine_test') return 'record not produced by the live machine test';
        if (rec.cleanupConfirmed !== true) return 'cleanup not confirmed in record';
        const ref = currentProjectRef();
        if (!rec.projectRef || !ref || rec.projectRef !== ref) return 'Supabase project changed since verification — rerun required';
        const maxDays = (SYSOS.CONFIG.DEPLOY && SYSOS.CONFIG.DEPLOY.RLS_VERIFICATION_MAX_AGE_DAYS) || 30;
        const ts = Date.parse(rec.verifiedAt || '');
        if (!ts || (Date.now() - ts) > maxDays * 86400000) return 'verification stale (>' + maxDays + ' days) — rerun required';
        return null;
    }
    /** Effective RLS status: without live Supabase, always CONFIG_REQUIRED — no stored claim can override this. */
    function effectiveRLS() {
        if (!supabaseConfigured()) return { status: RLS_STATUSES.CONFIG_REQUIRED, recordedAt: null, by: null };
        const rec = readRLS();
        if (rec.status === RLS_STATUSES.TECHNICALLY_VERIFIED) {
            const why = validateTechRecord(rec);
            if (why) return { status: RLS_STATUSES.TECHNICAL_VERIFICATION_REQUIRED,
                recordedAt: rec.verifiedAt || rec.recordedAt || null, by: rec.by || null, reason: why };
        }
        return rec;
    }

    // ---------- production guard ----------
    async function runProductionGuard() {
        const S = SYSOS;
        const chain = await S.vault.verifyChain();
        const integ = S.relations.integrity();
        const secure = !!window.isSecureContext;
        const demoOn = S.demo && S.demo.active;
        // v4.0: backend-aware auth + persistence (honest — BLOCK until configured + authenticated).
        let authStatus = { configured: false, authenticated: false };
        try { if (S.authRemote && S.authRemote.getAuthStatus) authStatus = await S.authRemote.getAuthStatus(); } catch (e) { /* tolerant */ }
        const remoteReady = !!(S.remoteBackend && authStatus.configured && authStatus.authenticated);
        // v4.2: monitoring readiness (honest — PASS only when the LOCAL sink is active).
        const mon = (S.monitoring && S.monitoring.getStatus) ? S.monitoring.getStatus() : null;
        const monActive = !!(mon && mon.active);
        const monCapture = !!(mon && mon.captureInstalled);
        const monGuard = !!(mon && mon.guardHookInstalled);
        // v4.3/v4.4.3: live-deployment inputs (RLS status model + CSP/Supabase origin + hosting).
        const supaConfigured = supabaseConfigured();
        const rls = effectiveRLS();
        const csp = cspSupabaseState();
        const hosting = hostingState();
        const checks = [
            { name: 'Authentication', status: authStatus.authenticated ? 'PASS' : (authStatus.configured ? 'WARN' : 'BLOCK'),
                detail: authStatus.authenticated ? 'remote auth session active' : (authStatus.configured ? 'remote auth configured — sign-in required' : 'no backend authentication — ADMINISTRATOR is the no-password default') },
            { name: 'Server persistence', status: remoteReady ? 'PASS' : 'BLOCK',
                detail: remoteReady ? 'remote backend configured + authenticated' : 'localStorage only — no durable server store' },
            { name: 'Hosting / HTTPS', status: hosting.state === 'GITHUB_PAGES_VERIFIED' ? 'PASS' : (hosting.state === 'BLOCK' ? 'BLOCK' : (secure ? 'WARN' : 'BLOCK')),
                detail: hosting.state === 'GITHUB_PAGES_VERIFIED' ? hosting.detail : (hosting.detail + (secure ? ' (GitHub Pages CONFIG_REQUIRED)' : '')) },
            { name: 'Monitoring', status: monActive ? 'PASS' : 'BLOCK', detail: monActive ? 'runtime monitoring active (LOCAL sink — no external alerting)' : 'monitoring layer inactive' },
            { name: 'Runtime error capture', status: monCapture ? 'PASS' : 'BLOCK', detail: monCapture ? 'window error + unhandledrejection hooked' : 'no runtime error capture' },
            { name: 'Guard failure capture', status: monGuard ? 'PASS' : 'BLOCK', detail: monGuard ? 'guard/vault/integrity failures routed to monitoring' : 'no guard failure capture' },
            { name: 'CSP Supabase origin', status: csp.state === 'PASS' ? 'PASS' : (csp.state === 'BLOCK' || csp.state === 'CONFIG_INVALID' ? 'BLOCK' : 'WARN'), detail: csp.detail },
            // v4.4.3: RLS hardening — TECHNICALLY_VERIFIED is the only PASS. Operator
            // attestation alone is WARN (visible, not silently accepted as proof).
            { name: 'RLS isolation verified',
                status: rls.status === RLS_STATUSES.TECHNICALLY_VERIFIED ? 'PASS'
                    : (rls.status === RLS_STATUSES.OPERATOR_ATTESTED ? 'WARN' : 'BLOCK'),
                detail: rls.status === RLS_STATUSES.TECHNICALLY_VERIFIED ? ('technically verified ' + (rls.verifiedAt || rls.recordedAt || '') + ' (live two-user machine test)')
                    : rls.status === RLS_STATUSES.OPERATOR_ATTESTED ? 'Operator attested; technical RLS verification still required.'
                    : rls.status === RLS_STATUSES.TECHNICAL_VERIFICATION_REQUIRED ? (rls.reason || 'imported/downgraded status — local technical re-verification required')
                    : rls.status === RLS_STATUSES.CHECKLIST_STARTED ? 'checklist started — complete all 12 steps and attest'
                    : rls.status === RLS_STATUSES.FAILED ? 'RLS isolation check FAILED — do not deploy until resolved'
                    : (supaConfigured ? 'checklist required — run RLS Isolation Checklist' : 'CONFIG_REQUIRED — no live Supabase credentials') },
            { name: 'Rollback path', status: ((SYSOS.CONFIG.DEPLOY && SYSOS.CONFIG.DEPLOY.ROLLBACK_DOCUMENTED) ? 'PASS' : 'BLOCK'), detail: 'app + GitHub Pages host rollback documented (v4.3)' },
            { name: 'Backup readiness', status: (S.backup ? 'PASS' : 'BLOCK'), detail: S.backup ? 'export/restore present (v3.8)' : 'backup module missing' },
            { name: 'Audit chain', status: (S.audit ? 'PASS' : 'BLOCK'), detail: 'append-only central audit present' },
            { name: 'Vault chain', status: (chain.valid ? 'PASS' : 'BLOCK'), detail: chain.valid ? chain.length + ' entries verified' : 'vault chain INVALID' },
            { name: 'Integrity', status: (integ.valid ? 'PASS' : 'BLOCK'), detail: integ.checked + ' links / ' + integ.broken.length + ' broken' },
            { name: 'Demo mode OFF', status: (demoOn ? 'BLOCK' : 'PASS'), detail: demoOn ? 'demo sandbox is ACTIVE' : 'live mode' },
            { name: 'Reset protection', status: 'PASS', detail: 'guarded reset (admin + token + snapshot) present' },
            { name: 'Localhost config', status: 'WARN', detail: 'CSP/telemetry hardcode localhost origins' }
        ];
        const blocks = checks.filter(function (c) { return c.status === 'BLOCK'; });
        const warns = checks.filter(function (c) { return c.status === 'WARN'; });
        const productionReady = blocks.length === 0;
        const result = {
            profile: _current,
            riskLevel: rules().risk,
            productionReady: productionReady,
            status: productionReady ? 'PRODUCTION_GUARD_PASSED' : 'PRODUCTION_BLOCKED',
            checks: checks,
            blockedActions: rules('PRODUCTION').blocked.slice(),
            blockingChecks: blocks.map(function (c) { return c.name; }),
            warnings: rules().warnings.concat(warns.map(function (c) { return c.name + ': ' + c.detail; })),
            summary: blocks.length + ' blocking / ' + warns.length + ' warnings'
        };
        // v4.2: route guard/vault/integrity failures into the monitoring sink (guarded).
        try {
            if (S.monitoring) {
                if (!chain.valid) S.monitoring.captureVaultFailure('vault chain invalid', { brokenAt: chain.brokenAt });
                if (!integ.valid) S.monitoring.captureIntegrityFailure(integ.broken.length + ' broken links', { broken: integ.broken.length });
                if (blocks.length && _current === 'PRODUCTION') S.monitoring.captureGuardFailure(result.summary, { blocking: result.blockingChecks });
            }
        } catch (e) { /* monitoring must never break the guard */ }
        auditEv('environment.guard_checked', { result: result.status, reason: result.summary,
            metadata: { profile: _current, blocking: result.blockingChecks, warnings: warns.length } });
        if (!productionReady && _current === 'PRODUCTION') {
            auditEv('environment.production_blocked', { result: 'PRODUCTION_BLOCKED', reason: result.summary,
                metadata: { blocking: result.blockingChecks } });
        }
        if (warns.length || rules().warnings.length) {
            auditEv('environment.warning_issued', { result: 'WARN', reason: result.summary, metadata: { warnings: result.warnings.length } });
        }
        return result;
    }

    // ---------- public API ----------
    const environment = {
        PROFILES: PROFILES,
        getCurrentProfile: function () { return _current; },
        getProfileRules: function (name) { return rules(name); },
        isProduction: function () { return _current === 'PRODUCTION'; },
        isStaging: function () { return _current === 'STAGING'; },
        isLocal: function () { return _current === 'LOCAL'; },
        isDev: function () { return _current === 'DEV'; },
        runProductionGuard: runProductionGuard,
        getBlockedActions: function () { return rules().blocked.slice(); },
        getWarnings: function () { return rules().warnings.slice(); },

        // ---------- v4.3/v4.4.3 live-deployment rehearsal (hardened RLS model) ----------
        RLS_STATUSES: RLS_STATUSES,
        /** Effective persisted operator RLS-isolation status (forced CONFIG_REQUIRED without live Supabase). */
        getRLSStatus: function () { return effectiveRLS(); },
        /**
         * Record the checklist as STARTED (opened, not yet completed). Rejected
         * without live Supabase — starting a checklist for a backend that does
         * not exist is meaningless.
         */
        recordRLSChecklistStarted: function () {
            if (!supabaseConfigured()) return { ok: false, reason: 'config_required' };
            const rec = { status: RLS_STATUSES.CHECKLIST_STARTED, recordedAt: new Date().toISOString(),
                by: (SYSOS.auth && SYSOS.auth.current && SYSOS.auth.current.name) || 'OPERATOR' };
            try { SYSOS.storage.set(DEPLOY_RLS_KEY, JSON.stringify(rec)); } catch (e) {}
            auditEv('deploy.rls_checklist_started', { result: rec.status, metadata: { by: rec.by } });
            document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { rls: rec.status } }));
            return { ok: true, status: rec.status };
        },
        /**
         * Record the OPERATOR's attestation that they completed the 12-step
         * checklist. v4.4.3 hardening: this is explicitly NOT a technical PASS —
         * it sets OPERATOR_ATTESTED, which the Production Guard reports as WARN
         * ("Operator attested; technical RLS verification still required."), never
         * PASS. Rejected without live Supabase — you cannot attest to isolation
         * that was never technically possible to break in the first place.
         */
        recordRLSResult: function (attested) {
            if (attested && !supabaseConfigured()) {
                auditEv('deploy.rls_record_rejected', { reason: 'config_required', metadata: { attempted: 'attested' } });
                return { ok: false, reason: 'config_required' };
            }
            const status = attested ? RLS_STATUSES.OPERATOR_ATTESTED : RLS_STATUSES.NOT_TESTED;
            const rec = { status: status, recordedAt: new Date().toISOString(),
                by: (SYSOS.auth && SYSOS.auth.current && SYSOS.auth.current.name) || 'OPERATOR' };
            try { SYSOS.storage.set(DEPLOY_RLS_KEY, JSON.stringify(rec)); } catch (e) {}
            auditEv('deploy.rls_' + (attested ? 'operator_attested' : 'reset'), { result: rec.status, metadata: { by: rec.by } });
            document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { rls: rec.status } }));
            return { ok: true, status: rec.status };
        },
        /**
         * v4.5.2: sanitize an IMPORTED RLS status value (backup restore /
         * remote pull). A TECHNICALLY_VERIFIED status is machine-local proof —
         * it must never survive transport from another store, so it is
         * downgraded to TECHNICAL_VERIFICATION_REQUIRED with an audit event.
         * All other statuses (and unparseable values) pass through unchanged;
         * business data is never touched by this function.
         */
        sanitizeRLSImport: function (raw) {
            try {
                const rec = JSON.parse(raw);
                if (rec && rec.status === RLS_STATUSES.TECHNICALLY_VERIFIED) {
                    rec.status = RLS_STATUSES.TECHNICAL_VERIFICATION_REQUIRED;
                    rec.note = 'imported status requires local re-verification';
                    auditEv('deploy.rls_import_downgraded', { result: rec.status,
                        reason: 'TECHNICALLY_VERIFIED cannot be imported — local re-verification required' });
                    return JSON.stringify(rec);
                }
            } catch (e) { /* not JSON — pass through untouched */ }
            return raw;
        },
        /**
         * v4.5.4 — THE real machine-executed two-user RLS isolation test.
         * This is the ONLY code path that can record TECHNICALLY_VERIFIED, and
         * it does so exclusively after a full live pass with confirmed cleanup.
         * Isolation VIOLATIONS store FAILED; setup/auth/network errors store
         * nothing (transient faults must not overwrite prior state).
         * Credentials come only from the local git-ignored runtime config
         * (window.__SYSOS_RUNTIME__.TEST_USERS) and are never logged or stored.
         * Ends with both sessions signed out.
         */
        runTechnicalRLSVerification: async function () {
            const S = SYSOS;
            const steps = [];
            const KEY_A = 'sysos.test.rls.user_a', KEY_B = 'sysos.test.rls.user_b';
            const VAL_A = 'RLS-TECH-VERIFY-A', VAL_B = 'RLS-TECH-VERIFY-B';
            function fail(stage, reason) {
                auditEv('deploy.rls_technical_failed', { reason: stage + ': ' + reason, metadata: { steps: steps.length } });
                return { ok: false, stage: stage, reason: reason, steps: steps.slice() };
            }
            function storeFailed(detail) {
                const rec = { status: RLS_STATUSES.FAILED, recordedAt: new Date().toISOString(),
                    method: 'live_two_user_machine_test', detail: detail,
                    by: (S.auth && S.auth.current && S.auth.current.name) || 'OPERATOR' };
                try { S.storage.set(DEPLOY_RLS_KEY, JSON.stringify(rec)); } catch (e) {}
                document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { rls: rec.status } }));
            }
            const supa = S.runtimeConfig.isSupabaseConfigured();
            if (!supa.ok) return fail('preconditions', 'CONFIG_REQUIRED — ' + (supa.reason || supa.status));
            const T = (window.__SYSOS_RUNTIME__ || {}).TEST_USERS;
            if (!T || !T.A || !T.B || !T.A.email || !T.A.password || !T.B.email || !T.B.password)
                return fail('preconditions', 'CONFIG_REQUIRED — TEST_USERS (A/B email+password) not present in local runtime config');
            auditEv('deploy.rls_technical_started', {});
            try {
                // --- session A: own write/read ---
                let si = await S.authRemote.signIn(T.A.email, T.A.password);
                if (!si.ok) return fail('signInA', si.reason || 'sign-in failed');
                const uidA = String((await S.authRemote.getUser()).id);
                let w = await S.remoteBackend.setItem(KEY_A, VAL_A);
                if (!w.ok) return fail('writeA', w.reason || 'write failed');
                if ((await S.remoteBackend.getItem(KEY_A)) !== VAL_A) return fail('readA', 'A cannot read its own row');
                steps.push('A wrote + read own row');
                await S.authRemote.signOut();
                // --- session B: cross-read must fail, own write/read must work ---
                si = await S.authRemote.signIn(T.B.email, T.B.password);
                if (!si.ok) return fail('signInB', si.reason || 'sign-in failed');
                const uidB = String((await S.authRemote.getUser()).id);
                if (uidA === uidB) return fail('identity', 'test users resolve to the SAME account — isolation untestable');
                if ((await S.remoteBackend.getItem(KEY_A)) !== null) {
                    storeFailed('user B could read user A data');
                    return fail('ISOLATION', 'VIOLATION — user B can read user A data. Do not deploy.');
                }
                steps.push('B cannot read A (proof 1)');
                w = await S.remoteBackend.setItem(KEY_B, VAL_B);
                if (!w.ok) return fail('writeB', w.reason || 'write failed');
                if ((await S.remoteBackend.getItem(KEY_B)) !== VAL_B) return fail('readB', 'B cannot read its own row');
                steps.push('B wrote + read own row');
                await S.authRemote.signOut();
                // --- back to A: cross-read must fail, own row must persist ---
                si = await S.authRemote.signIn(T.A.email, T.A.password);
                if (!si.ok) return fail('reSignInA', si.reason || 'sign-in failed');
                if ((await S.remoteBackend.getItem(KEY_B)) !== null) {
                    storeFailed('user A could read user B data');
                    return fail('ISOLATION', 'VIOLATION — user A can read user B data. Do not deploy.');
                }
                steps.push('A cannot read B (proof 2)');
                if ((await S.remoteBackend.getItem(KEY_A)) !== VAL_A) return fail('persistA', 'A row did not persist across sessions');
                steps.push('A row persisted across sessions');
                // --- cleanup (each user removes only its own row) ---
                await S.remoteBackend.removeItem(KEY_A);
                const aLeft = (await S.remoteBackend.listKeys()).filter(function (k) { return k === KEY_A || k === KEY_B; }).length;
                await S.authRemote.signOut();
                si = await S.authRemote.signIn(T.B.email, T.B.password);
                if (!si.ok) return fail('cleanupSignInB', si.reason || 'sign-in failed');
                await S.remoteBackend.removeItem(KEY_B);
                const bLeft = (await S.remoteBackend.listKeys()).filter(function (k) { return k === KEY_A || k === KEY_B; }).length;
                await S.authRemote.signOut();
                if (aLeft !== 0 || bLeft !== 0) return fail('cleanup', 'test rows not fully removed (A-side ' + aLeft + ', B-side ' + bLeft + ')');
                steps.push('cleanup confirmed (0 test rows remain for both users)');
                // --- record (only reachable after a complete pass) ---
                const verifiedAt = new Date().toISOString();
                const evidence = { steps: steps.slice(), verifiedAt: verifiedAt,
                    userA: uidA.slice(0, 6) + '…', userB: uidB.slice(0, 6) + '…', testKeys: [KEY_A, KEY_B] };
                let evidenceHash = null;
                try { evidenceHash = (await S.utils.hash(JSON.stringify(evidence))).hex; } catch (e) {}
                const rec = { status: RLS_STATUSES.TECHNICALLY_VERIFIED, verifiedAt: verifiedAt,
                    method: 'live_two_user_machine_test', projectRef: currentProjectRef(),
                    backendMode: 'remote_supabase', testKeys: evidence.testKeys, result: 'pass',
                    userA: evidence.userA, userB: evidence.userB, cleanupConfirmed: true,
                    evidenceHash: evidenceHash,
                    by: (S.auth && S.auth.current && S.auth.current.name) || 'OPERATOR' };
                try { S.storage.set(DEPLOY_RLS_KEY, JSON.stringify(rec)); } catch (e) {}
                auditEv('deploy.rls_technically_verified', { result: 'pass',
                    metadata: { userA: rec.userA, userB: rec.userB, evidenceHash: evidenceHash, steps: steps.length } });
                document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { rls: rec.status } }));
                return { ok: true, status: rec.status, steps: steps.slice(), evidenceHash: evidenceHash, verifiedAt: verifiedAt };
            } catch (e) {
                return fail('unexpected', String(e.message || e));
            }
        },
        /** Back-compat alias (v4.4.3 placeholder name) — now delegates to the real runner. */
        verifyRLSIsolationTechnical: function () { return environment.runTechnicalRLSVerification(); },
        /** The 12-step RLS isolation checklist (guided; CONFIG_REQUIRED to verify). */
        rlsChecklist: function () {
            return ['1. Create a Supabase project.', '2. Apply pilot_backend/supabase_schema.sql (enables RLS).',
                '3. Create test_user_a.', '4. Create test_user_b.', '5. Sign in as A.',
                '6. Push one test SYS_OS state key (Station 16).', '7. Sign out.', '8. Sign in as B.',
                '9. Confirm B CANNOT see A\'s row.', '10. Sign back in as A.',
                '11. Confirm A CAN see A\'s row.', '12. Record the result here (audit logged as operator attestation, not technical proof).'];
        },
        /**
         * Operator-facing deployment readiness snapshot (Phase 8 panel). Honest.
         * v4.4.3: hosting/CSP/RLS all read through the shared runtime_config /
         * hardened-RLS authority, so this can never disagree with the Production
         * Guard (Sonnet 5 architecture review finding — was two fidelity levels).
         */
        deploymentReadiness: async function () {
            const S = SYSOS;
            const DEPLOY = (S.CONFIG && S.CONFIG.DEPLOY) || {};
            const hosting = hostingState();
            const hostingStatus = hosting.state === 'GITHUB_PAGES_VERIFIED' ? 'VERIFIED'
                : hosting.state === 'LOCAL' ? 'LOCAL' : 'CONFIG_REQUIRED';
            const httpsStatus = (hosting.state === 'GITHUB_PAGES_VERIFIED' || hosting.state === 'HTTPS_PRESENT') ? 'verified'
                : hosting.state === 'LOCAL' ? 'required (local dev)' : 'required';
            const supaConfigured = supabaseConfigured();
            let auth = { authenticated: false };
            try { if (S.authRemote && S.authRemote.getAuthStatus) auth = await S.authRemote.getAuthStatus(); } catch (e) {}
            const rls = effectiveRLS();
            const rlsLabel = {
                NOT_TESTED: 'not tested', CHECKLIST_STARTED: 'checklist started',
                OPERATOR_ATTESTED: 'operator attested (technical verification required)',
                TECHNICAL_VERIFICATION_REQUIRED: 'technical verification required',
                TECHNICALLY_VERIFIED: 'technically verified', FAILED: 'FAILED',
                CONFIG_REQUIRED: 'not tested (config required)'
            }[rls.status] || 'not tested';
            const mon = (S.monitoring && S.monitoring.getStatus) ? S.monitoring.getStatus() : null;
            const monActive = !!(mon && mon.active);
            const cspS = cspSupabaseState();
            const cspState = cspS.state === 'PASS' ? 'verified'
                : cspS.state === 'BLOCK' ? 'needs Supabase origin'
                : cspS.state === 'CONFIG_INVALID' ? 'invalid Supabase URL' : 'local only';
            const rollback = DEPLOY.ROLLBACK_DOCUMENTED ? 'documented' : 'not documented';
            const liveReady = supaConfigured && auth.authenticated && rls.status === RLS_STATUSES.TECHNICALLY_VERIFIED
                && hostingStatus === 'VERIFIED' && httpsStatus === 'verified';
            const rehearsalReady = monActive && !!S.backup && !!DEPLOY.ROLLBACK_DOCUMENTED;
            const productionStatus = liveReady ? 'READY' : (rehearsalReady ? 'REHEARSAL_READY' : 'BLOCKED');
            return {
                hostingTarget: DEPLOY.HOSTING_TARGET || 'GitHub Pages',
                hostingStatus: hostingStatus, httpsStatus: httpsStatus,
                supabaseConfig: supaConfigured ? 'configured' : 'missing',
                authStatus: auth.authenticated ? 'authenticated' : 'unauthenticated',
                rlsIsolation: rlsLabel, monitoring: monActive ? 'active' : 'failed',
                cspStatus: cspState, rollbackStatus: rollback,
                productionStatus: productionStatus, liveChecksPending: !liveReady
            };
        },

        /** Is this action blocked by the active profile? (consulted by demo/reset.) */
        blocks: function (action) { return rules().blocked.indexOf(action) !== -1; },

        /** Switch profile (ADMIN / system.configure). Persisted. */
        setProfile: function (name) {
            name = String(name || '').toUpperCase();
            if (!PROFILES[name]) return { ok: false, reason: 'unknown_profile' };
            if (SYSOS.auth && !SYSOS.auth.can('system.configure')) {
                auditEv('environment.override_rejected', { reason: 'permission_denied', metadata: { attempted: name } });
                return { ok: false, reason: 'permission_denied' };
            }
            _current = name;
            try { SYSOS.storage.set(PROFILE_KEY, name); } catch (e) {}
            auditEv('environment.profile_detected', { result: name, reason: 'operator set', metadata: { profile: name, risk: rules().risk } });
            document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { profile: name } }));
            return { ok: true, profile: name, risk: rules().risk };
        },

        init: function () {
            _current = detect();
            auditEv('environment.profile_detected', { result: _current, reason: 'boot detection', metadata: { profile: _current, risk: rules().risk } });
            SYSOS.router.register({ id: 'environment', label: '15 // ENVIRONMENT', render: function (p) { ui.mount(p); } });
            document.addEventListener('sysos:demo', function () { if (_panel) ui.refresh(); });
            // v4.2: refresh ONLY the monitoring sub-panel on monitoring events.
            // (renderStatusInto reads status without running the guard — no capture→refresh loop.)
            document.addEventListener('sysos:monitoring', function () {
                if (!_panel) return;
                const m = _panel.querySelector('#env-monitoring');
                if (m && SYSOS.monitoring && SYSOS.monitoring.renderStatusInto) SYSOS.monitoring.renderStatusInto(m);
            });
            document.addEventListener('click', function (e) {
                const b = e.target.closest('[data-env-action]');
                if (!b || !_panel || !_panel.contains(b)) return;
                if (b.dataset.envAction === 'set-profile') {
                    const sel = _panel.querySelector('#env-profile-select');
                    const res = environment.setProfile(sel.value);
                    SYSOS.utils.notify(res.ok ? 'PROFILE SET' : 'PROFILE CHANGE DENIED', [res.ok ? (res.profile + ' (risk ' + res.risk + ')') : (res.reason || 'error')]);
                    ui.refresh();
                } else if (b.dataset.envAction === 'rls-checklist') {
                    environment.recordRLSChecklistStarted();
                    SYSOS.utils.notify('RLS ISOLATION CHECKLIST', environment.rlsChecklist());
                    ui.refresh();
                } else if (b.dataset.envAction === 'rls-verified') {
                    // v4.4.3: this records an OPERATOR ATTESTATION, not a technical PASS.
                    const res = environment.recordRLSResult(true);
                    SYSOS.utils.notify(res.ok ? 'RLS OPERATOR ATTESTATION RECORDED' : 'RLS ATTESTATION REJECTED',
                        [res.ok ? 'Marked OPERATOR_ATTESTED — the Production Guard will still show WARN, not PASS, until a technical verification exists.'
                            : (res.reason === 'config_required' ? 'Cannot attest without a live Supabase backend (CONFIG_REQUIRED)' : (res.reason || 'error'))]);
                    ui.refresh();
                } else if (b.dataset.envAction === 'rls-technical') {
                    // v4.5.4: runs the REAL live two-user machine test. Records
                    // TECHNICALLY_VERIFIED only on a full pass with confirmed cleanup.
                    SYSOS.utils.notify('TECHNICAL RLS VERIFICATION', ['Running live two-user isolation test…']);
                    environment.runTechnicalRLSVerification().then(function (res) {
                        SYSOS.utils.notify(res.ok ? 'RLS TECHNICALLY VERIFIED' : 'TECHNICAL RLS VERIFICATION NOT PASSED',
                            res.ok ? ['All ' + res.steps.length + ' proof steps passed · cleanup confirmed',
                                      'evidence ' + String(res.evidenceHash || '').slice(0, 12) + '…']
                                   : ['stage: ' + res.stage, res.reason]);
                        ui.refresh();
                    });
                } else if (b.dataset.envAction === 'rls-reset') {
                    environment.recordRLSResult(false);
                    SYSOS.utils.notify('RLS RESET', ['RLS isolation status reset to NOT_TESTED']);
                    ui.refresh();
                } else if (b.dataset.envAction === 'deploy-health') {
                    if (SYSOS.monitoring && SYSOS.monitoring.deploymentHealthCheck) {
                        environment.deploymentReadiness().then(function (dep) {
                            const ev = SYSOS.monitoring.deploymentHealthCheck({ productionGuardStatus: dep.productionStatus });
                            SYSOS.utils.notify('DEPLOYMENT HEALTH CHECK', [
                                'origin ' + (ev && ev.metadata.origin), 'secure ' + (ev && ev.metadata.secureContext),
                                'profile ' + (ev && ev.metadata.profile), 'status ' + dep.productionStatus]);
                        });
                    }
                }
            });
        }
    };

    // ---------- Station UI (15 // ENVIRONMENT) ----------
    let _panel = null;
    const ui = {
        mount: function (panel) { _panel = panel; panel.textContent = ''; panel.appendChild(ui.shell()); ui.refresh(); },
        shell: function () {
            const root = el('div', 'space-y-6 max-w-4xl');
            const head = el('div', 'border-b border-gold-500/10 pb-3');
            head.appendChild(el('h2', 'text-xs font-cyber font-semibold tracking-widest text-gold-400', 'Environment / Production Guard'));
            head.appendChild(el('p', 'text-[11px] font-mono text-slate-500 mt-0.5', 'Deployment-discipline safety layer · honest production readiness · local-first only'));
            root.appendChild(head);
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-current';
            // profile selector
            const sel = el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 flex items-center gap-2');
            sel.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest', 'Profile'));
            const select = el('select', 'bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-gold-500/40');
            select.id = 'env-profile-select';
            ['DEV', 'LOCAL', 'STAGING', 'PRODUCTION'].forEach(function (p) { const o = el('option', null, p); o.value = p; select.appendChild(o); });
            const setBtn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'SET PROFILE');
            setBtn.type = 'button'; setBtn.dataset.envAction = 'set-profile';
            sel.appendChild(select); sel.appendChild(setBtn);
            root.appendChild(sel);
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-guard';
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-deployment';
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-monitoring';
            const note = el('div', 'text-[10px] font-mono text-amber-400/90 border border-amber-500/20 rounded p-3 bg-amber-950/10');
            note.textContent = 'SYS_OS is not production-ready until backend authentication, durable persistence, hosting, HTTPS, backups, and monitoring are implemented. This guard prevents unsafe production behavior; it is not production security.';
            root.appendChild(note);
            return root;
        },
        refresh: async function () {
            if (!_panel) return;
            const r = environment.getProfileRules();
            const sel = _panel.querySelector('#env-profile-select'); if (sel) sel.value = environment.getCurrentProfile();
            const cur = _panel.querySelector('#env-current');
            if (cur) {
                cur.textContent = '';
                cur.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Current Environment'));
                const row = el('div', 'flex items-center gap-3 flex-wrap text-[11px] font-mono');
                row.appendChild(el('span', 'text-lg font-bold ' + r.indicator, r.name + ' · ' + r.label));
                row.appendChild(el('span', 'text-slate-500', 'risk ' + r.risk + ' · guard ' + r.guard));
                cur.appendChild(row);
                cur.appendChild(el('div', 'text-[11px] font-mono text-slate-400 mt-1', r.purpose));
                if (r.blocked.length) cur.appendChild(el('div', 'text-[11px] font-mono text-red-400 mt-1', 'Blocked in this profile: ' + r.blocked.join(', ')));
            }
            const g = _panel.querySelector('#env-guard');
            if (g) {
                g.textContent = '';
                g.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Production Guard'));
                const res = await environment.runProductionGuard();
                const statusTone = res.productionReady ? 'text-emerald-400' : 'text-red-400';
                g.appendChild(el('div', 'font-bold font-mono text-xs ' + statusTone, res.status + ' · ' + res.summary));
                const tbl = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-1 mt-2');
                res.checks.forEach(function (c) {
                    const tone = c.status === 'PASS' ? 'text-emerald-400' : (c.status === 'WARN' ? 'text-amber-400' : 'text-red-400');
                    const rowEl = el('div', 'flex items-start justify-between gap-2 text-[11px] font-mono border-b border-white/[0.04] py-0.5');
                    rowEl.appendChild(el('span', 'text-slate-400', c.name));
                    rowEl.appendChild(el('span', tone + ' shrink-0', c.status));
                    g.appendChild(rowEl);
                });
                if (res.warnings.length) {
                    g.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2 mb-1', 'Warnings'));
                    res.warnings.forEach(function (w) { g.appendChild(el('div', 'text-amber-400 text-[11px] font-mono', '  ! ' + w)); });
                }
            }
            // v4.3 deployment readiness panel.
            const d = _panel.querySelector('#env-deployment');
            if (d) {
                d.textContent = '';
                d.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Deployment Readiness (GitHub Pages)'));
                const dep = await environment.deploymentReadiness();
                const tone = function (s) {
                    s = String(s).toLowerCase();
                    if (/(verified|active|authenticated|documented|ready)/.test(s) && !/rehearsal|required|not |missing|unauth|failed|blocked/.test(s)) return 'text-emerald-400';
                    if (/(local only|local|required|unknown|checklist|not tested|rehearsal)/.test(s)) return 'text-amber-400';
                    if (/(missing|failed|unauth|blocked|not documented)/.test(s)) return 'text-red-400';
                    return 'text-slate-300';
                };
                const rows = [
                    ['Hosting target', dep.hostingTarget], ['Hosting status', dep.hostingStatus],
                    ['HTTPS', dep.httpsStatus], ['Supabase config', dep.supabaseConfig],
                    ['Auth', dep.authStatus], ['RLS isolation', dep.rlsIsolation],
                    ['Monitoring', dep.monitoring], ['CSP', dep.cspStatus],
                    ['Rollback', dep.rollbackStatus]
                ];
                rows.forEach(function (r) {
                    const rowEl = el('div', 'flex items-start justify-between gap-2 text-[11px] font-mono border-b border-white/[0.04] py-0.5');
                    rowEl.appendChild(el('span', 'text-slate-400', r[0]));
                    rowEl.appendChild(el('span', tone(r[1]) + ' shrink-0', String(r[1])));
                    d.appendChild(rowEl);
                });
                const psTone = dep.productionStatus === 'READY' ? 'text-emerald-400' : (dep.productionStatus === 'REHEARSAL_READY' ? 'text-amber-400' : 'text-red-400');
                d.appendChild(el('div', 'font-bold font-mono text-xs mt-2 ' + psTone,
                    'PRODUCTION STATUS: ' + dep.productionStatus + (dep.liveChecksPending ? ' — live checks pending (NOT production-ready)' : '')));
                // action buttons
                const bar = el('div', 'flex flex-wrap gap-2 mt-3');
                const mk = function (label, action) {
                    const btn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-[10px] px-3 py-1.5 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', label);
                    btn.type = 'button'; btn.dataset.envAction = action; return btn;
                };
                bar.appendChild(mk('Run RLS Isolation Checklist', 'rls-checklist'));
                bar.appendChild(mk('Record RLS Operator Attestation', 'rls-verified'));
                bar.appendChild(mk('Run Technical RLS Verification', 'rls-technical'));
                bar.appendChild(mk('Reset RLS', 'rls-reset'));
                bar.appendChild(mk('Run Deployment Health Check', 'deploy-health'));
                d.appendChild(bar);
                d.appendChild(el('div', 'text-[10px] font-mono text-amber-400/90 mt-2',
                    'Rehearsal layer. READY is never claimed without live Supabase + verified RLS + HTTPS hosting. See docs/v3.0/LIVE_DEPLOYMENT_REHEARSAL_v4.3.md.'));
            }
            // v4.2 monitoring status surface (rendered by the monitoring module).
            const m = _panel.querySelector('#env-monitoring');
            if (m && SYSOS.monitoring && SYSOS.monitoring.renderStatusInto) SYSOS.monitoring.renderStatusInto(m);
        }
    };

    SYSOS.environment = environment;
})();
