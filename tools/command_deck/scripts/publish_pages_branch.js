#!/usr/bin/env node
/**
 * SYS_OS v4.7.1 — gh-pages Branch Publisher (LOCAL ONLY — never pushes)
 * ======================================================================
 * Builds the LOCAL `gh-pages` branch whose root is EXACTLY the validated
 * deploy/public artifact (plus `.nojekyll`, which tells GitHub Pages to serve
 * files as-is instead of running Jekyll — without it, dotfiles like
 * .deploy-manifest.json would be silently dropped from the hosted site).
 *
 * Pipeline (each stage must PASS or the run aborts with a non-zero exit):
 *   1. BUILD     — runs scripts/build_public_deploy.js (allowlist builder).
 *   2. VALIDATE  — runs scripts/validate_public_deploy.js (deterministic gate).
 *   3. STAGE     — copies deploy/public to a throwaway staging dir + .nojekyll.
 *   4. RESCAN    — independent defense-in-depth sweep of the staging dir for
 *                  forbidden names and secret/credential content.
 *   5. COMMIT    — git plumbing (temp index → write-tree → commit-tree →
 *                  update-ref refs/heads/gh-pages). The main working tree,
 *                  index, and current branch are NEVER touched. First run
 *                  creates an orphan history; later runs append to gh-pages.
 *   6. VERIFY    — `git ls-tree -r gh-pages` must equal the staging file list
 *                  exactly, or the run FAILS after the fact.
 *
 * This script contains NO `git push`. Publishing the branch to origin and
 * enabling Pages (Settings → Pages → Deploy from branch → gh-pages → / root)
 * are deliberate operator actions — see PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md.
 *
 * Usage:  node scripts/publish_pages_branch.js     (from tools/command_deck/)
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');            // tools/command_deck
const ARTIFACT = path.join(ROOT, 'deploy', 'public');
const BRANCH = 'gh-pages';

function die(msg) { console.error('PUBLISH FAILED: ' + msg); process.exit(1); }

function run(cmd, args, opts) {
    const r = spawnSync(cmd, args, Object.assign({ encoding: 'utf8' }, opts || {}));
    if (r.error) die(cmd + ' failed to start: ' + r.error.message);
    return r;
}
function git(args, opts) {
    const r = run('git', args, Object.assign({ cwd: ROOT }, opts || {}));
    if (r.status !== 0) die('git ' + args.join(' ') + ' exited ' + r.status + '\n' + (r.stderr || ''));
    return r.stdout.trim();
}

// ------------------------------------------------------------ 1. BUILD
console.log('[1/6] BUILD — build_public_deploy.js');
let step = run(process.execPath, [path.join(__dirname, 'build_public_deploy.js')], { cwd: ROOT, stdio: 'inherit', encoding: null });
if (step.status !== 0) die('build stage exited ' + step.status + ' — nothing was published.');

// --------------------------------------------------------- 2. VALIDATE
console.log('[2/6] VALIDATE — validate_public_deploy.js');
step = run(process.execPath, [path.join(__dirname, 'validate_public_deploy.js')], { cwd: ROOT, stdio: 'inherit', encoding: null });
if (step.status !== 0) die('validator refused the artifact — nothing was published.');

// ------------------------------------------------------------ 3. STAGE
console.log('[3/6] STAGE — copy validated artifact to throwaway staging dir');
if (!fs.existsSync(path.join(ARTIFACT, 'index.html'))) die('deploy/public/index.html missing after a passing build (impossible state — stop).');
const STAGE = fs.mkdtempSync(path.join(os.tmpdir(), 'sysos-pages-'));
function copyTree(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    fs.readdirSync(src, { withFileTypes: true }).forEach(function (e) {
        const s = path.join(src, e.name), d = path.join(dst, e.name);
        if (e.isDirectory()) copyTree(s, d); else fs.copyFileSync(s, d);
    });
}
copyTree(ARTIFACT, STAGE);
fs.writeFileSync(path.join(STAGE, '.nojekyll'), '');

// ----------------------------------------------------------- 4. RESCAN
// Independent sweep — deliberately duplicated from the validator so a future
// validator regression cannot silently open this gate.
console.log('[4/6] RESCAN — defense-in-depth secret/forbidden sweep of staging');
const FORBIDDEN_NAMES = [
    /config\.local/i, /\.env(\.|$)/i, /archives?\//i, /(^|\/)docs\//i,
    /AUDIT_REPORT/i, /\.(bat|ps1|py|md)$/i, /backup.*\.json$/i,
    /index_v/i, /index\.local/i, /supabase\.local/i, /package(-lock)?\.json$/i,
    /node_modules\//i, /\.git\//i
];
const FORBIDDEN_CONTENT = [
    { re: /sb_secret_[A-Za-z0-9]/, why: 'server SECRET key material' },
    { re: /service[_-]?role["']?\s*[:=]\s*["'][A-Za-z0-9]/, why: 'service_role key assignment' },
    { re: /TEST_USERS\s*:\s*\{[\s\S]{0,250}?password\s*:/, why: 'inline test credential block' },
    { re: /PASTE_TEST[12]_/, why: 'credential placeholder residue' },
    { re: /@primepathwy\.local/i, why: 'test user email' },
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
const staged = walk(STAGE, STAGE).sort();
const violations = [];
staged.forEach(function (rel) {
    if (rel === '.nojekyll') return;                       // the one publish-time addition
    FORBIDDEN_NAMES.forEach(function (re) { if (re.test(rel)) violations.push('FORBIDDEN NAME (' + re + '): ' + rel); });
    if (/\.(html|js|css|json)$/.test(rel)) {
        const txt = fs.readFileSync(path.join(STAGE, rel), 'utf8');
        FORBIDDEN_CONTENT.forEach(function (fc) { if (fc.re.test(txt)) violations.push('FORBIDDEN CONTENT (' + fc.why + '): ' + rel); });
        if (rel !== KEY_ALLOWED_IN && KEY_RE.test(txt)) violations.push('API KEY OUTSIDE config.public.js: ' + rel);
    }
});
if (violations.length) {
    violations.forEach(function (v) { console.error('  ✗ ' + v); });
    fs.rmSync(STAGE, { recursive: true, force: true });
    die(violations.length + ' rescan violation(s) — nothing was published.');
}
console.log('  rescan clean: ' + staged.length + ' files (incl. .nojekyll)');

// ----------------------------------------------------------- 5. COMMIT
console.log('[5/6] COMMIT — plumbing commit onto local ' + BRANCH + ' (working tree untouched)');
const GIT_DIR = path.resolve(ROOT, git(['rev-parse', '--git-dir']));
if (git(['rev-parse', '--abbrev-ref', 'HEAD']) === BRANCH)
    die('current checkout IS ' + BRANCH + ' — run this from the engineering branch.');
// temp index lives OUTSIDE the staging dir so `git add` can never publish it;
// -f so no global gitignore rule can silently drop an artifact file.
const tmpIndex = STAGE + '.index';
const plumbEnv = Object.assign({}, process.env, { GIT_INDEX_FILE: tmpIndex });
git(['--git-dir=' + GIT_DIR, '--work-tree=' + STAGE, 'add', '-f', '-A', '.'], { cwd: STAGE, env: plumbEnv });
const tree = git(['--git-dir=' + GIT_DIR, 'write-tree'], { env: plumbEnv });

let parentArgs = [];
const parentProbe = run('git', ['--git-dir=' + GIT_DIR, 'rev-parse', '-q', '--verify', 'refs/heads/' + BRANCH]);
if (parentProbe.status === 0) parentArgs = ['-p', parentProbe.stdout.trim()];

let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(path.join(ARTIFACT, '.deploy-manifest.json'), 'utf8')); } catch (e) { /* summary-only */ }
const msg = 'deploy(pages): SYS_OS public pilot — ' + staged.length + ' files, validator PASS' +
    (manifest.builtAt ? ' (built ' + manifest.builtAt + ')' : '');
const commit = git(['--git-dir=' + GIT_DIR, 'commit-tree', tree].concat(parentArgs, ['-m', msg]));
git(['--git-dir=' + GIT_DIR, 'update-ref', 'refs/heads/' + BRANCH, commit]);

// ----------------------------------------------------------- 6. VERIFY
console.log('[6/6] VERIFY — branch tree must equal staging exactly');
// --full-tree: ls-tree run from a subdirectory otherwise filters to that
// subdirectory's path prefix and would report every root file as missing.
const inBranch = git(['ls-tree', '-r', '--full-tree', BRANCH, '--name-only']).split('\n').filter(Boolean).sort();
const expected = staged;
const missing = expected.filter(function (f) { return inBranch.indexOf(f) === -1; });
const extra = inBranch.filter(function (f) { return expected.indexOf(f) === -1; });
fs.rmSync(STAGE, { recursive: true, force: true });
fs.rmSync(tmpIndex, { force: true });
if (missing.length || extra.length) {
    missing.forEach(function (f) { console.error('  ✗ MISSING FROM BRANCH: ' + f); });
    extra.forEach(function (f) { console.error('  ✗ UNEXPECTED IN BRANCH: ' + f); });
    die('branch tree does not match the validated staging set — do NOT push ' + BRANCH + '.');
}

console.log('');
console.log('PUBLISH OK — local branch "' + BRANCH + '" now points at ' + commit.slice(0, 10));
console.log('  files: ' + inBranch.length + ' (validated artifact + .nojekyll) · parent: ' + (parentArgs.length ? parentArgs[1].slice(0, 10) : 'none (orphan root)'));
console.log('  NOT PUSHED. Nothing left this machine.');
console.log('  NEXT (operator-gated):');
console.log('    1. git push origin ' + BRANCH);
console.log('    2. GitHub → Settings → Pages → Deploy from a branch → ' + BRANCH + ' → / (root) → Save');
console.log('    3. Run hosted verification per PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md');
