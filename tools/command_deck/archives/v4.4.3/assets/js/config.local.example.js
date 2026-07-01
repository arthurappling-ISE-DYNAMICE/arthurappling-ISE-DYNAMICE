/**
 * SYS_OS — config.local.example.js  (TEMPLATE — placeholders only, safe to commit)
 * ============================================================================
 * This file shows operators how to enable the Supabase remote backend WITHOUT
 * committing real credentials.
 *
 *   1. Copy this file to:   assets/js/config.local.js   (that real file is
 *      git-ignored — see tools/command_deck/.gitignore — and must NEVER be
 *      committed with real values).
 *   2. Replace the placeholders below with YOUR project's values.
 *   3. Add the script tag to index.html, immediately AFTER config.js:
 *          <script src="assets/js/config.local.js"></script>
 *      (Do NOT add it in the shipped repo — only in your private deploy copy,
 *      so the default app stays 404-free and offline.)
 *   4. Add ONLY your project origin to the CSP connect-src in index.html:
 *          connect-src 'self' https://YOUR_PROJECT_REF.supabase.co
 *   5. Load the Supabase JS SDK (self-hosted under assets/js/ or via a CSP-
 *      allowed origin) so window.supabase exists.
 *
 * ⚠ SECURITY — READ BEFORE USE
 *   - NEVER commit a real config.local.js (it may contain your anon key + URL).
 *   - Use the ANON (public) key ONLY. NEVER the service-role key in the browser.
 *   - The anon key is only safe WITH Row-Level Security (RLS) enabled.
 *   - VERIFY RLS isolation (User A cannot read User B) BEFORE any client sync —
 *     run the "RLS Isolation Checklist" in Station 15 // ENVIRONMENT.
 *   - Always export a v3.8 BACKUP before any push/pull sync.
 */
window.__SYSOS_RUNTIME__ = {
    BACKEND: {
        // ---- placeholders only — replace in your private config.local.js ----
        SUPABASE_URL:      'https://YOUR_PROJECT_REF.supabase.co',  // your project URL
        SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',        // ANON key ONLY — never service-role
        BACKEND_MODE:      'local',          // 'local' (default) | 'remote_supabase'
        MODE:              'local',           // alias consumed by config merge
        REMOTE_ENABLED:    false              // opt-in; keep false until RLS verified
    },
    // Optional: pin the environment profile for a hosted rehearsal.
    ENVIRONMENT_PROFILE: 'STAGING'           // 'LOCAL' | 'DEV' | 'STAGING' | 'PRODUCTION'
};
