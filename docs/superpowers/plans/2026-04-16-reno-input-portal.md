# Reno Input Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a slide-in manual data-entry drawer to the AA Betting Board that writes William Hill ticket IDs, payouts, and Win/Loss outcomes to both `ISE_Betting_Console/data/betting_log.json` and `vault/engine/betting_algorithm/betting_log.json` simultaneously.

**Architecture:** All changes go into two existing files only — `server.cjs` gains a dual-write helper and a new `/api/sync` POST endpoint; `public/index.html` gains drawer CSS, drawer HTML, and client-side JS. No new files, no new dependencies.

**Tech Stack:** Node.js built-ins (fs, http, path), vanilla JS, inline CSS, port 3132.

---

## File Map

| File | Change |
|------|--------|
| `ISE_Betting_Console/server.cjs` | Add `VAULT_FILE` const, `mirrorToVault()`, `writeBoth()`, `POST /api/sync` handler, update `PUT /api/log/:index` to use `writeBoth` |
| `ISE_Betting_Console/public/index.html` | Add drawer CSS, RENO nav button, drawer HTML, drawer JS (toggle, populate, commit, HIT/MISS, cascade) |

---

## Task 1: Server — Dual-Write Infrastructure

**Files:**
- Modify: `ISE_Betting_Console/server.cjs`

- [ ] **Step 1: Add VAULT_FILE constant after the existing constants block**

In `server.cjs`, after line 9 (`const PUBLIC = ...`), add:

```javascript
const VAULT_FILE = path.join(__dirname, '..', 'vault', 'engine', 'betting_algorithm', 'betting_log.json')
```

- [ ] **Step 2: Add mirrorToVault and writeBoth helpers after the existing writeLog function**

After the `writeLog` function (currently ends around line 46), add:

```javascript
function mirrorToVault(data) {
  try {
    fs.mkdirSync(path.dirname(VAULT_FILE), { recursive: true })
    fs.writeFileSync(VAULT_FILE, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('[VAULT MIRROR FAILED]', err.message)
  }
}

function writeBoth(data) {
  writeLog(data)
  mirrorToVault(data)
}
```

- [ ] **Step 3: Update the PUT /api/log/:index handler to use writeBoth**

Find this line in the PUT handler (around line 91):
```javascript
        writeLog(log)
```
Replace it with:
```javascript
        writeBoth(log)
```

- [ ] **Step 4: Add POST /api/sync handler before the static files block**

Find the comment `// ── Static files from public/ ──` (around line 103). Insert the following block BEFORE it:

```javascript
  // ── POST /api/sync — commit 3-tier week entry ──────────────────────────────
  if (req.url === '/api/sync' && req.method === 'POST') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const { week, date, tiers } = JSON.parse(body)
        const log = readLog()
        ;['4-Leg', '6-Leg', '8-Leg'].forEach(type => {
          const tier = tiers[type]
          if (!tier) return
          const entry = {
            date, week, unit: 100, type,
            status: 'Active',
            ticketId: tier.ticketId,
            ticketPayout: tier.payout,
            payout: 0, net_profit: 0,
            ss_avg: 0, wri_avg: 0, teams: []
          }
          const idx = log.findIndex(e => e.week === week && e.type === type)
          if (idx >= 0) {
            log[idx] = { ...log[idx], ...entry }
          } else {
            log.push(entry)
          }
        })
        writeBoth(log)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }
```

- [ ] **Step 5: Add startup verification after server.listen callback**

Find the `server.listen` call (last lines of the file). Replace the entire block with:

```javascript
server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  AA Betting Board — ISE Dynamics V5 Supreme')
  console.log(`  http://localhost:${PORT}`)
  console.log('  Sovereign Execution Engine · Prime Pathwy\n')

  // ── Vault sync verification ─────────────────────────────────────────────────
  try {
    const testData = readLog()
    mirrorToVault(testData)
    const vaultData = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'))
    if (JSON.stringify(testData) === JSON.stringify(vaultData)) {
      console.log('  [VAULT SYNC ✓] Both targets identical')
    } else {
      console.error('  [VAULT SYNC ✗] MISMATCH DETECTED')
    }
  } catch (err) {
    console.error('  [VAULT SYNC ✗]', err.message)
  }
})
```

- [ ] **Step 6: Verify server starts and vault sync passes**

Stop any running server, then:
```
cd ISE_Betting_Console
node server.cjs
```
Expected output (last line):
```
  [VAULT SYNC ✓] Both targets identical
```

Also confirm `vault/engine/betting_algorithm/betting_log.json` now exists with the same content as `ISE_Betting_Console/data/betting_log.json`.

- [ ] **Step 7: Commit**

```bash
cd C:/Users/arthu/GeminiEcosystem
git add ISE_Betting_Console/server.cjs
git commit -m "feat: server dual-write — /api/sync + mirrorToVault + vault startup verification"
```

---

## Task 2: Drawer CSS + HTML

**Files:**
- Modify: `ISE_Betting_Console/public/index.html`

- [ ] **Step 1: Add drawer CSS**

Inside the `<style>` block, before the closing `</style>` tag, append:

```css
/* ── RENO DRAWER ── */
.reno-btn{padding:3px 10px;font-size:8px;letter-spacing:2px;font-weight:700;
          background:transparent;border:1px solid var(--gold);color:var(--gold);
          cursor:pointer;transition:background .2s}
.reno-btn:hover{background:var(--gold-glow)}

#reno-drawer{position:fixed;top:0;right:0;height:100vh;width:360px;
             background:#0f0f0f;border-left:1px solid var(--gold-dim);
             transform:translateX(100%);transition:transform .3s ease;
             z-index:300;display:flex;flex-direction:column;overflow:hidden}
#reno-drawer.open{transform:translateX(0)}

.reno-head{display:flex;justify-content:space-between;align-items:flex-start;
           padding:14px 16px 10px;border-bottom:1px solid var(--border);
           background:#090909;flex-shrink:0}
.reno-title{font-size:9px;letter-spacing:3px;color:var(--gold);font-weight:700;
            text-transform:uppercase;margin-bottom:6px}
.reno-week-wrap{display:flex;align-items:center;gap:8px;font-size:8px;
                color:var(--dim);letter-spacing:1px}
#reno-week{background:#111;color:var(--gold);border:1px solid var(--gold-dim);
           padding:3px 6px;font-size:8px;font-family:'Courier New',monospace;
           letter-spacing:1px;cursor:pointer}
.reno-close{background:none;border:none;color:var(--dim);font-size:16px;
            cursor:pointer;padding:0 2px;line-height:1}
.reno-close:hover{color:var(--white)}

.reno-body{flex:1;overflow-y:auto;padding:12px 16px}

.reno-tier{border:1px solid var(--border);padding:12px;margin-bottom:10px;
           transition:all .3s}
.reno-tier.cascade-fail{opacity:.35;pointer-events:none;border-color:#3a1010}
.reno-tier-label{font-size:7px;letter-spacing:2px;color:var(--gold);
                 text-transform:uppercase;margin-bottom:10px}
.reno-field{margin-bottom:8px}
.reno-label{font-size:7px;letter-spacing:1px;color:var(--dim);display:block;margin-bottom:3px}
.reno-input{width:100%;background:#0a0a0a;border:1px solid var(--border);
            color:var(--white);padding:5px 8px;font-size:9px;
            font-family:'Courier New',monospace;letter-spacing:1px}
.reno-input:focus{outline:none;border-color:var(--gold-dim)}
.reno-input[readonly]{color:var(--dim);border-color:#1a1a1a;background:#080808}
.reno-stake{font-size:8px;color:var(--dim);letter-spacing:1px;margin-bottom:8px}
.reno-err{font-size:7px;color:var(--red);letter-spacing:1px;margin-top:2px;min-height:12px}

.reno-result{display:none;gap:6px;margin-top:8px}
.reno-result.visible{display:flex}
.reno-result-btn{flex:1;padding:5px;font-size:8px;letter-spacing:2px;font-weight:700;
                 background:transparent;border:1px solid var(--border);
                 color:var(--dim);cursor:pointer;transition:all .2s;text-transform:uppercase}
.reno-result-btn.hit-btn{border-color:var(--gold-dim);color:var(--gold)}
.reno-result-btn.hit-btn:hover,.reno-result-btn.hit-btn.active{background:rgba(201,162,39,.15);color:var(--gold)}
.reno-result-btn.miss-btn{border-color:#3a1010;color:#773030}
.reno-result-btn.miss-btn:hover,.reno-result-btn.miss-btn.active{background:rgba(231,76,60,.12);color:var(--red)}

.reno-cascade-banner{display:none;text-align:center;font-size:8px;letter-spacing:3px;
                     color:var(--red);border:1px solid #3a1010;padding:4px;
                     margin-top:6px;text-transform:uppercase}
.reno-cascade-banner.show{display:block}

.reno-footer{padding:12px 16px;border-top:1px solid var(--border);
             background:#090909;flex-shrink:0}
#reno-commit{width:100%;padding:10px;font-size:9px;letter-spacing:2px;
             font-weight:700;background:var(--gold);color:#000;border:none;
             cursor:pointer;text-transform:uppercase;transition:opacity .2s}
#reno-commit:hover{opacity:.85}
#reno-committed-badge{display:none;text-align:center;font-size:8px;letter-spacing:2px;
                      color:var(--green);padding:6px 0}
```

- [ ] **Step 2: Add RENO nav button**

Find in the HTML (around line 147):
```html
    <div class="nav-right">
      <div class="badge" id="week-badge">WEEK 1 · 2026</div>
      <div class="status-pill" id="status-pill">LOADING</div>
    </div>
```
Replace with:
```html
    <div class="nav-right">
      <div class="badge" id="week-badge">WEEK 1 · 2026</div>
      <button class="reno-btn" onclick="toggleDrawer()">⬡ RENO</button>
      <div class="status-pill" id="status-pill">LOADING</div>
    </div>
```

- [ ] **Step 3: Add drawer HTML**

After the watermark `<div class="wm">...</div>` and before the `<script>` tag, insert:

```html
<!-- ── RENO INPUT DRAWER ───────────────────────────────────────────────── -->
<div id="reno-drawer">
  <div class="reno-head">
    <div>
      <div class="reno-title">Reno Input Portal</div>
      <div class="reno-week-wrap">
        WEEK
        <select id="reno-week">
          <option value="1">1</option><option value="2">2</option>
          <option value="3">3</option><option value="4">4</option>
          <option value="5">5</option><option value="6">6</option>
          <option value="7">7</option><option value="8">8</option>
          <option value="9">9</option><option value="10">10</option>
          <option value="11">11</option><option value="12">12</option>
          <option value="13">13</option><option value="14">14</option>
          <option value="15">15</option><option value="16">16</option>
          <option value="17">17</option><option value="18">18</option>
        </select>
        <span style="color:var(--gold-dim)">· 2026</span>
      </div>
    </div>
    <button class="reno-close" onclick="toggleDrawer()">✕</button>
  </div>

  <div class="reno-body">
    <!-- 4-LEG -->
    <div class="reno-tier" id="tier-4">
      <div class="reno-tier-label">4-Leg · Foundation Lock · SS ≥ 90</div>
      <div class="reno-field">
        <label class="reno-label">William Hill Ticket ID</label>
        <input id="t4-id" class="reno-input" type="text" maxlength="40"
               placeholder="004014-0188-0612-0035">
        <div class="reno-err" id="t4-err"></div>
      </div>
      <div class="reno-field">
        <label class="reno-label">Payout $ (from physical ticket)</label>
        <input id="t4-payout" class="reno-input" type="number" min="0" step="1" placeholder="0">
      </div>
      <div class="reno-stake">Stake: $100 (locked)</div>
      <div class="reno-result" id="t4-result">
        <button class="reno-result-btn hit-btn" id="t4-hit"
                onclick="setResult('4-Leg','Hit')">HIT</button>
        <button class="reno-result-btn miss-btn" id="t4-miss"
                onclick="setResult('4-Leg','Miss')">MISS</button>
      </div>
    </div>

    <!-- 6-LEG -->
    <div class="reno-tier" id="tier-6">
      <div class="reno-tier-label">6-Leg · Extension Tier · SS ≥ 88</div>
      <div class="reno-field">
        <label class="reno-label">William Hill Ticket ID</label>
        <input id="t6-id" class="reno-input" type="text" maxlength="40"
               placeholder="004014-0188-0612-0035">
        <div class="reno-err" id="t6-err"></div>
      </div>
      <div class="reno-field">
        <label class="reno-label">Payout $ (from physical ticket)</label>
        <input id="t6-payout" class="reno-input" type="number" min="0" step="1" placeholder="0">
      </div>
      <div class="reno-stake">Stake: $100 (locked)</div>
      <div class="reno-result" id="t6-result">
        <button class="reno-result-btn hit-btn" id="t6-hit"
                onclick="setResult('6-Leg','Hit')">HIT</button>
        <button class="reno-result-btn miss-btn" id="t6-miss"
                onclick="setResult('6-Leg','Miss')">MISS</button>
      </div>
      <div class="reno-cascade-banner" id="cascade-6">LADDER COLLAPSED</div>
    </div>

    <!-- 8-LEG -->
    <div class="reno-tier" id="tier-8">
      <div class="reno-tier-label">8-Leg · Risk Tier · SS ≥ 85</div>
      <div class="reno-field">
        <label class="reno-label">William Hill Ticket ID</label>
        <input id="t8-id" class="reno-input" type="text" maxlength="40"
               placeholder="004014-0188-0612-0035">
        <div class="reno-err" id="t8-err"></div>
      </div>
      <div class="reno-field">
        <label class="reno-label">Payout $ (from physical ticket)</label>
        <input id="t8-payout" class="reno-input" type="number" min="0" step="1" placeholder="0">
      </div>
      <div class="reno-stake">Stake: $100 (locked)</div>
      <div class="reno-result" id="t8-result">
        <button class="reno-result-btn hit-btn" id="t8-hit"
                onclick="setResult('8-Leg','Hit')">HIT</button>
        <button class="reno-result-btn miss-btn" id="t8-miss"
                onclick="setResult('8-Leg','Miss')">MISS</button>
      </div>
      <div class="reno-cascade-banner" id="cascade-8">LADDER COLLAPSED</div>
    </div>
  </div>

  <div class="reno-footer">
    <button id="reno-commit" onclick="renoCommit()">⬡ RENO COMMITMENT — EXECUTE</button>
    <div id="reno-committed-badge">✓ COMMITTED — TICKETS ACTIVE</div>
  </div>
</div>
```

- [ ] **Step 4: Verify HTML structure renders (no JS yet)**

Start server, open `http://localhost:3132`, click `⬡ RENO` in the nav — nothing should happen yet (JS not added) but page should not error. Check browser console for HTML parse errors.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/arthu/GeminiEcosystem
git add ISE_Betting_Console/public/index.html
git commit -m "feat: reno drawer CSS + HTML skeleton — nav button + 3-tier input blocks"
```

---

## Task 3: Drawer Core JavaScript

**Files:**
- Modify: `ISE_Betting_Console/public/index.html` (script section)

- [ ] **Step 1: Add drawer state variables and toggle function**

In the `<script>` block, after the `let log = [];` line, add:

```javascript
// ── RENO DRAWER STATE ─────────────────────────────────────────────────────────
let drawerOpen = false;

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  const drawer = document.getElementById('reno-drawer');
  if (drawerOpen) {
    drawer.classList.add('open');
    // Default to the week of the last log entry, or 1
    const lastWeek = log.length ? log[log.length - 1].week : 1;
    const sel = document.getElementById('reno-week');
    sel.value = lastWeek;
    populateDrawer(lastWeek);
  } else {
    drawer.classList.remove('open');
  }
}
```

- [ ] **Step 2: Add week selector change handler**

Immediately after the `toggleDrawer` function:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reno-week').addEventListener('change', e => {
    populateDrawer(parseInt(e.target.value));
  });
});
```

- [ ] **Step 3: Add populateDrawer function**

```javascript
function populateDrawer(week) {
  const types = ['4-Leg', '6-Leg', '8-Leg'];
  const prefix = { '4-Leg': 't4', '6-Leg': 't6', '8-Leg': 't8' };
  const tierEl = { '4-Leg': 'tier-4', '6-Leg': 'tier-6', '8-Leg': 'tier-8' };

  const entries = {};
  types.forEach(t => {
    entries[t] = log.find(e => e.week === week && e.type === t) || null;
  });

  const committed = entries['4-Leg'] && entries['4-Leg'].status !== undefined;

  types.forEach(type => {
    const p   = prefix[type];
    const ent = entries[type];

    // Populate fields
    document.getElementById(`${p}-id`).value     = ent?.ticketId    || '';
    document.getElementById(`${p}-payout`).value = ent?.ticketPayout || '';

    // Lock fields once committed
    document.getElementById(`${p}-id`).readOnly     = !!committed;
    document.getElementById(`${p}-payout`).readOnly = !!committed;

    // Clear error messages
    document.getElementById(`${p}-err`).textContent = '';

    // Show result buttons only after commitment
    const resultDiv = document.getElementById(`${p}-result`);
    if (committed) {
      resultDiv.classList.add('visible');
    } else {
      resultDiv.classList.remove('visible');
    }

    // Highlight active result
    const hitBtn  = document.getElementById(`${p}-hit`);
    const missBtn = document.getElementById(`${p}-miss`);
    hitBtn.classList.toggle('active',  ent?.status === 'Hit');
    missBtn.classList.toggle('active', ent?.status === 'Miss');
  });

  // Commitment button vs badge
  document.getElementById('reno-commit').style.display         = committed ? 'none'  : 'block';
  document.getElementById('reno-committed-badge').style.display = committed ? 'block' : 'none';

  // Cascade state
  const fourLegMiss = entries['4-Leg'] && entries['4-Leg'].status === 'Miss';
  if (fourLegMiss) {
    applyCascadeVisual();
  } else {
    clearCascadeVisual();
  }
}
```

- [ ] **Step 4: Verify drawer populates from existing log data**

Start server. Open board. Click `⬡ RENO`. The week selector should show the last logged week, and if that week has entries in `betting_log.json`, the Ticket ID and Payout fields should pre-fill (if `ticketId`/`ticketPayout` fields exist on those entries). HIT/MISS buttons visible if status is Active/Hit/Miss.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/arthu/GeminiEcosystem
git add ISE_Betting_Console/public/index.html
git commit -m "feat: reno drawer toggle + populateDrawer — loads existing week data"
```

---

## Task 4: RENO COMMITMENT + HIT/MISS + Cascade

**Files:**
- Modify: `ISE_Betting_Console/public/index.html` (script section)

- [ ] **Step 1: Add renoCommit function**

After `populateDrawer`, add:

```javascript
async function renoCommit() {
  const week = parseInt(document.getElementById('reno-week').value);
  const today = new Date().toISOString().slice(0, 10);

  const fields = {
    '4-Leg': { id: 't4-id', payout: 't4-payout', err: 't4-err' },
    '6-Leg': { id: 't6-id', payout: 't6-payout', err: 't6-err' },
    '8-Leg': { id: 't8-id', payout: 't8-payout', err: 't8-err' },
  };

  // Validate — all ticket IDs required
  let valid = true;
  Object.entries(fields).forEach(([type, f]) => {
    const val = document.getElementById(f.id).value.trim();
    if (!val) {
      document.getElementById(f.err).textContent = 'Ticket ID required for Audit Integrity.';
      valid = false;
    } else {
      document.getElementById(f.err).textContent = '';
    }
  });
  if (!valid) return;

  const tiers = {};
  Object.entries(fields).forEach(([type, f]) => {
    tiers[type] = {
      ticketId: document.getElementById(f.id).value.trim(),
      payout:   parseFloat(document.getElementById(f.payout).value) || 0,
    };
  });

  try {
    const r = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week, date: today, tiers }),
    });
    if (!r.ok) throw new Error('sync failed');
    await fetchLog();
    populateDrawer(week);
  } catch (err) {
    console.error('[RENO COMMIT FAILED]', err.message);
  }
}
```

- [ ] **Step 2: Add setResult function**

```javascript
async function setResult(type, result) {
  const week = parseInt(document.getElementById('reno-week').value);
  const idx  = log.findIndex(e => e.week === week && e.type === type);
  if (idx < 0) return;

  const ticketPayout = log[idx].ticketPayout || 0;
  const updates = result === 'Hit'
    ? { status: 'Hit',  payout: ticketPayout, net_profit: ticketPayout - 100 }
    : { status: 'Miss', payout: 0,            net_profit: -100 };

  try {
    const r = await fetch(`/api/log/${idx}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!r.ok) throw new Error('put failed');

    // Cascade: 4-Leg Miss forces 6-Leg and 8-Leg to Miss
    if (type === '4-Leg' && result === 'Miss') {
      await cascadeMiss(week);
    }

    await fetchLog();
    populateDrawer(week);
  } catch (err) {
    console.error('[SET RESULT FAILED]', err.message);
  }
}
```

- [ ] **Step 3: Add cascade functions**

```javascript
async function cascadeMiss(week) {
  for (const type of ['6-Leg', '8-Leg']) {
    const idx = log.findIndex(e => e.week === week && e.type === type);
    if (idx < 0) continue;
    await fetch(`/api/log/${idx}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Miss', payout: 0, net_profit: -100 }),
    });
  }
  applyCascadeVisual();
}

function applyCascadeVisual() {
  document.getElementById('tier-6').classList.add('cascade-fail');
  document.getElementById('tier-8').classList.add('cascade-fail');
  document.getElementById('cascade-6').classList.add('show');
  document.getElementById('cascade-8').classList.add('show');
}

function clearCascadeVisual() {
  document.getElementById('tier-6').classList.remove('cascade-fail');
  document.getElementById('tier-8').classList.remove('cascade-fail');
  document.getElementById('cascade-6').classList.remove('show');
  document.getElementById('cascade-8').classList.remove('show');
}
```

- [ ] **Step 4: Manual end-to-end verification**

Start server: `node server.cjs`  
Open `http://localhost:3132`

**Test A — Commitment:**
1. Click `⬡ RENO` → drawer opens
2. Select Week 3
3. Leave all Ticket ID fields blank → click `⬡ RENO COMMITMENT — EXECUTE`
4. Expected: Three inline errors: `"Ticket ID required for Audit Integrity."`
5. Fill in all three Ticket IDs (any string) + payout amounts → click commit
6. Expected: Drawer switches to `✓ COMMITTED — TICKETS ACTIVE` + HIT/MISS buttons appear
7. Check `ISE_Betting_Console/data/betting_log.json` — 3 new entries for week 3 with `status: "Active"`
8. Check `vault/engine/betting_algorithm/betting_log.json` — identical content

**Test B — HIT:**
1. Re-open drawer, select Week 3
2. Click `HIT` on 4-Leg
3. Expected: HIT button highlights gold; Empire Curve spikes by the payout amount entered
4. Check both JSON files — 4-Leg entry for week 3 has `status: "Hit"` and `payout: <amount>`

**Test C — Cascade Fail:**
1. Open drawer, select Week 3, click `MISS` on 4-Leg
2. Expected: 6-Leg and 8-Leg tier blocks darken + red `LADDER COLLAPSED` banners appear
3. Check both JSON files — 6-Leg and 8-Leg entries for week 3 have `status: "Miss"`

- [ ] **Step 5: Commit**

```bash
cd C:/Users/arthu/GeminiEcosystem
git add ISE_Betting_Console/public/index.html
git commit -m "feat: reno commitment + HIT/MISS toggles + cascade fail — dual-write complete"
```

---

## Task 5: Final Integration Verification + Memory

**Files:**
- Read: `ISE_Betting_Console/data/betting_log.json`
- Read: `vault/engine/betting_algorithm/betting_log.json`

- [ ] **Step 1: Confirm both JSON files are identical**

```bash
cd C:/Users/arthu/GeminiEcosystem
node -e "
const fs = require('fs');
const a = fs.readFileSync('ISE_Betting_Console/data/betting_log.json','utf8');
const b = fs.readFileSync('vault/engine/betting_algorithm/betting_log.json','utf8');
console.log(a === b ? '[VAULT SYNC ✓] Files identical' : '[VAULT SYNC ✗] MISMATCH');
console.log('Console entries:', JSON.parse(a).length);
console.log('Vault entries:  ', JSON.parse(b).length);
"
```

Expected output:
```
[VAULT SYNC ✓] Files identical
Console entries: N
Vault entries:   N
```

- [ ] **Step 2: Final commit with version tag message**

```bash
cd C:/Users/arthu/GeminiEcosystem
git add ISE_Betting_Console/server.cjs ISE_Betting_Console/public/index.html
git commit -m "feat: RENO INPUT PORTAL v1.0 — slide-in drawer, dual-write, cascade fail, HIT/MISS"
```

---

## Implementation Notes

- The `ticketPayout` field is added to each log entry alongside the existing `payout` field. `ticketPayout` is what was on the physical ticket. `payout` starts at 0 and gets set to `ticketPayout` when HIT is recorded.
- The `net_profit` field on a Hit entry = `ticketPayout - 100`. On Miss = `-100`.
- Empire Curve already sums `payout` across all entries — no special curve logic needed. The curve naturally spikes on Hit because `payout` goes from 0 to the ticket amount.
- Port 3132 is unchanged throughout.
- The drawer does not interfere with the 30-second poll. `fetchLog()` continues to run regardless of drawer state.
