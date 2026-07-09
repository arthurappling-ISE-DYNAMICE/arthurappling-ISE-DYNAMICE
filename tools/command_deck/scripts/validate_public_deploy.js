#!/usr/bin/env node
/**
 * SYS_OS v4.6 — Public Deploy Validator
 * ======================================
 * Deterministic gate over deploy/public/. PASSES only when the artifact
 * contains EXACTLY allowlisted files and ZERO forbidden names or content.
 * Run after every build and immediately before any deploy-time commit:
 *
 *     node scripts/validate_public_deploy.js      (from tools/command_deck/)
 *
 * Exit 0 = PASS (safe set). Exit 1 = FAIL with the full violation list.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'deploy', 'public');

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

// ---- allowlist: a file is legal only if it matches one of these ------------
const ALLOW = [
    /^index\.html$/,
    /^\.deploy-manifest\.json$/,
    /^assets\/css\/(sys_os|tailwind\.build)\.css$/,
    /^assets\/fonts\/fonts\.css$/,
    /^assets\/fonts\/[A-Za-z0-9_-]+\.woff2$/,
    new RegExp('^assets/js/(' + JS_RUNTIME.join('|').replace(/\./g, '\\.') + ')$'),
    /^assets\/js\/supabase\.js$/,
    /^assets\/js\/config\.public\.js$/,
    /^assets\/favicon\/favicon\.ico$/,
    /^assets\/favicon\/favicon-(16x16|32x32|48x48|64x64)\.png$/,
    /^assets\/favicon\/apple-touch-icon\.png$/,
    /^assets\/favicon\/android-chrome-(192x192|512x512)\.png$/,
    /^assets\/favicon\/site\.webmanifest$/
];

// ---- forbidden NAME patterns (belt over the allowlist braces) --------------
const FORBIDDEN_NAMES = [
    /config\.local\.js/i, /\.env(\.|$)/i, /archives?\//i, /(^|\/)docs\//i,
    /AUDIT_REPORT/i, /\.bat$/i, /\.ps1$/i, /backup.*\.json$/i,
    /\.md$/i, /index_v/i, /index\.local/i, /test_nemotron/i,
    /pilot_backend/i, /supabase\.local/i, /\.py$/i, /package(-lock)?\.json$/i
];

// ---- forbidden CONTENT (text files). The anon key (long JWT / publishable) --
// is permitted ONLY inside assets/js/config.public.js. Server secrets and test
// credentials are forbidden EVERYWHERE.
const FORBIDDEN_CONTENT = [
    { re: /sb_secret_[A-Za-z0-9]/, why: 'server SECRET key material' },
    { re: /service[_-]?role["']?\s*[:=]\s*["'][A-Za-z0-9]/, why: 'service_role key assignment' },
    // an INLINE credential object (the config.local.js shape) — code that merely
    // READS window.__SYSOS_RUNTIME__.TEST_USERS (environment.js) is legitimate.
    { re: /TEST_USERS\s*:\s*\{[\s\S]{0,250}?password\s*:/, why: 'inline test credential block' },
    { re: /PASTE_TEST[12]_/, why: 'credential placeholder residue' },
    { re: /@primepathwy\.local/i, why: 'test user email' },
    // ANY inline password assignment (catches every credential block, past or
    // future, without embedding password material in this repo-tracked file).
    { re: /password['"]?\s*:\s*['"][^'"]{4,}['"]/i, why: 'inline password assignment' }
];
const KEY_RE = /(sb_publishable_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{10,})/;
const KEY_ALLOWED_IN = 'assets/js/config.public.js';

function walk(dir, base) {
    let out = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
        const p = path.join(dir, e.name);
        const rel = path.relative(base, p).replace(/\\/g, '/');
        if (e.isDirectory()) out = out.concat(walk(p, base)); else out.push(rel);
    });
    return out;
}

if (!fs.existsSync(OUT)) { console.error('FAIL: deploy/public/ does not exist — run the build first.'); process.exit(1); }
const files = walk(OUT, OUT).sort();
const violations = [];

files.forEach(function (rel) {
    if (!ALLOW.some(function (re) { return re.test(rel); }))
        violations.push('NOT ON ALLOWLIST: ' + rel);
    FORBIDDEN_NAMES.forEach(function (re) {
        if (re.test(rel)) violations.push('FORBIDDEN NAME (' + re + '): ' + rel);
    });
    if (/\.(html|js|css|json)$/.test(rel)) {
        const txt = fs.readFileSync(path.join(OUT, rel), 'utf8');
        FORBIDDEN_CONTENT.forEach(function (fc) {
            if (fc.re.test(txt)) violations.push('FORBIDDEN CONTENT (' + fc.why + '): ' + rel);
        });
        if (rel !== KEY_ALLOWED_IN && KEY_RE.test(txt))
            violations.push('API KEY OUTSIDE config.public.js: ' + rel);
    }
});

// required core present?
['index.html', 'assets/js/config.js', 'assets/js/main.js', 'assets/js/runtime_config.js',
 'assets/css/sys_os.css', 'assets/fonts/fonts.css'].forEach(function (req) {
    if (files.indexOf(req) === -1) violations.push('REQUIRED FILE MISSING: ' + req);
});

if (violations.length) {
    console.error('VALIDATION FAIL — ' + violations.length + ' violation(s):');
    violations.forEach(function (v) { console.error('  ✗ ' + v); });
    process.exit(1);
}
console.log('VALIDATION PASS — ' + files.length + ' files, all on allowlist, zero forbidden names/content.');
console.log('  (anon key permitted only in config.public.js — browser-safe by design with verified RLS)');
process.exit(0);
