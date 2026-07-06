#!/usr/bin/env node
/**
 * SYS_OS v4.6 — Public Deploy Builder
 * ====================================
 * Builds the CURATED public hosting artifact at deploy/public/ using a strict
 * ALLOWLIST. Nothing is copied by wildcard-over-directory: archives, docs,
 * audit reports, helper scripts, local configs, snapshots, and backups are
 * structurally impossible to include because they are never named.
 *
 * Config delivery (F2, Option A two-stage): if assets/js/config.local.js exists
 * locally, ONLY its SUPABASE_URL + SUPABASE_ANON_KEY (+ safe flags) are
 * extracted into deploy/public/assets/js/config.public.js. TEST_USERS and any
 * other fields are NEVER carried over. The build REFUSES to run if the key is
 * a server secret (sb_secret_ / service_role). Without a local config, a
 * LOCAL-only artifact is built (no remote, still boots).
 *
 * The artifact is gitignored during preparation. Committing it is a deliberate
 * operator act at deploy time — see PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md.
 *
 * Usage:  node scripts/build_public_deploy.js     (from tools/command_deck/)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');           // tools/command_deck
const OUT = path.join(ROOT, 'deploy', 'public');

// ---------------------------------------------------------------- allowlists
// The 38 runtime modules (deploy-order-independent copy list). Excluded on
// purpose: config.local.example.js (template), tailwind.config.js (build-time),
// config.local.js (secret-bearing, ignored), supabase.local.js (copied under
// its deploy name below), test/helper files.
const JS_RUNTIME = [
    'audit.js', 'auth.js', 'auth_remote.js', 'auth_ui.js', 'backup.js',
    'bootcheck.js', 'canvas.js', 'client.js', 'commercial.js', 'commercial_ui.js',
    'compliance.js', 'config.js', 'demo.js', 'environment.js', 'exec.js',
    'executive.js', 'executive_ui.js', 'healthcache.js', 'liveops.js', 'main.js',
    'maintenance.js', 'money.js', 'monitoring.js', 'ocr.js', 'opsqueue.js',
    'registry.js', 'remote_backend.js', 'router.js', 'routing.js',
    'runtime_config.js', 'smoketest.js', 'sqlite_backend.js', 'storage.js',
    'store.js', 'telemetry.js', 'terminal.js', 'utils.js', 'vault.js'
];
const CSS = ['sys_os.css', 'tailwind.build.css'];

function die(msg) { console.error('BUILD FAILED: ' + msg); process.exit(1); }
function copy(src, dst) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
}

// ------------------------------------------------------------- fresh output
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// ------------------------------------------------- extract local config (F2)
let pub = null;   // { url, key, origin } — only browser-safe values
const localCfgPath = path.join(ROOT, 'assets', 'js', 'config.local.js');
if (fs.existsSync(localCfgPath)) {
    const sandbox = { window: {} };
    try {
        // evaluate in-process with a window stub; the file only assigns to window.*
        (new Function('window', fs.readFileSync(localCfgPath, 'utf8')))(sandbox.window);
    } catch (e) { die('config.local.js failed to evaluate: ' + e.message); }
    const b = ((sandbox.window.__SYSOS_RUNTIME__ || {}).BACKEND) || {};
    const url = String(b.SUPABASE_URL || ''), key = String(b.SUPABASE_ANON_KEY || '');
    if (/sb_secret_/i.test(key) || /service[_-]?role/i.test(key))
        die('REFUSED — the configured key looks like a SERVER SECRET. Never deploy sb_secret_/service_role keys.');
    if (url && key && !/YOUR_PROJECT_REF|YOUR_SUPABASE/.test(url + key)) {
        let origin = null;
        try { origin = new URL(url).origin; } catch (e) { die('SUPABASE_URL in config.local.js is not a valid URL'); }
        if (!/\.supabase\.co$/i.test(new URL(url).hostname)) die('SUPABASE_URL host is not *.supabase.co');
        pub = { url: url, key: key, origin: origin };
    }
}

// --------------------------------------------------------------- copy assets
JS_RUNTIME.forEach(function (f) {
    const src = path.join(ROOT, 'assets', 'js', f);
    if (!fs.existsSync(src)) die('missing runtime module: ' + f);
    copy(src, path.join(OUT, 'assets', 'js', f));
});
CSS.forEach(function (f) { copy(path.join(ROOT, 'assets', 'css', f), path.join(OUT, 'assets', 'css', f)); });
fs.readdirSync(path.join(ROOT, 'assets', 'fonts')).forEach(function (f) {
    if (/\.(woff2|css)$/.test(f)) copy(path.join(ROOT, 'assets', 'fonts', f), path.join(OUT, 'assets', 'fonts', f));
});

// Supabase SDK (public library) — only meaningful for a remote-enabled build.
const sdkSrc = path.join(ROOT, 'assets', 'js', 'supabase.local.js');
let sdkIncluded = false;
if (pub) {
    if (!fs.existsSync(sdkSrc)) die('remote config present but assets/js/supabase.local.js (vendored SDK) is missing');
    copy(sdkSrc, path.join(OUT, 'assets', 'js', 'supabase.js'));
    sdkIncluded = true;
}

// ------------------------------------------------- generate config.public.js
if (pub) {
    const cfg = '/**\n' +
        ' * SYS_OS — PUBLIC runtime config (GENERATED by scripts/build_public_deploy.js)\n' +
        ' * Contains ONLY browser-safe values: the project URL and the anon/publishable\n' +
        ' * key, which are public BY DESIGN when Row-Level Security is enforced —\n' +
        ' * RLS isolation for this project is machine-verified (see v4.5.4 record).\n' +
        ' * NEVER edit by hand to add secrets. NEVER add service_role/sb_secret_ keys.\n' +
        ' */\n' +
        'window.__SYSOS_RUNTIME__ = {\n' +
        '    BACKEND: {\n' +
        "        MODE: 'remote_supabase',\n" +
        "        BACKEND_MODE: 'remote_supabase',\n" +
        '        REMOTE_ENABLED: true,\n' +
        "        SUPABASE_URL: '" + pub.url.replace(/\/$/, '') + "',\n" +
        "        SUPABASE_ANON_KEY: '" + pub.key + "'\n" +
        '    }\n' +
        '};\n';
    fs.writeFileSync(path.join(OUT, 'assets', 'js', 'config.public.js'), cfg);
}

// ------------------------------------------------------- transform index.html
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (pub) {
    // wire the public config + SDK immediately after config.js (before runtime_config.js)
    const anchor = '    <script src="assets/js/runtime_config.js"></script>';
    if (html.indexOf(anchor) === -1) die('index.html anchor (runtime_config script tag) not found');
    html = html.replace(anchor,
        '    <script src="assets/js/config.public.js"></script>\n' +
        '    <script src="assets/js/supabase.js"></script>\n' + anchor);
    // scope the CSP connect-src to include exactly this project origin
    const cspAnchor = "connect-src 'self' http://localhost:3132 http://localhost:4173";
    if (html.indexOf(cspAnchor) === -1) die('index.html CSP connect-src anchor not found');
    html = html.replace(cspAnchor, cspAnchor + ' ' + pub.origin);
}
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// ------------------------------------------------------------------ manifest
function walk(dir, base) {
    let out = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
        const p = path.join(dir, e.name);
        const rel = path.relative(base, p).replace(/\\/g, '/');
        if (e.isDirectory()) out = out.concat(walk(p, base)); else out.push(rel);
    });
    return out;
}
const files = walk(OUT, OUT).sort();
const manifest = {
    builtAt: new Date().toISOString(),
    mode: pub ? 'REMOTE (public config included)' : 'LOCAL-ONLY (no runtime config found)',
    originMasked: pub ? pub.origin.replace(/^https:\/\/([a-z0-9-]{4})[a-z0-9-]*(\.supabase\.co)$/i, 'https://$1***$2') : null,
    sdkIncluded: sdkIncluded,
    fileCount: files.length,
    files: files.filter(function (f) { return f !== '.deploy-manifest.json'; })
};
fs.writeFileSync(path.join(OUT, '.deploy-manifest.json'), JSON.stringify(manifest, null, 2));

console.log('BUILD OK — ' + manifest.mode);
console.log('  files: ' + manifest.fileCount + ' · sdk: ' + sdkIncluded + (manifest.originMasked ? ' · origin: ' + manifest.originMasked : ''));
console.log('  output: deploy/public/');
console.log('  NEXT: node scripts/validate_public_deploy.js');
