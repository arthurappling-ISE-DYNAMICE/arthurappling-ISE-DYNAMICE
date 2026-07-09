# SYS_OS — Day One Operator Guide

**For the operator who has never seen SYS_OS.** Read this once, top to bottom.
By the end you will have launched the platform, understood what is real vs demo,
and completed a full client → proposal → contract → report cycle — unassisted.
Full detail for every station is in **SYS_OS_OPERATOR_MANUAL_v3.6.md**.

Everything here is **verified** behavior from the v3.6 audit. Where a thing is a
demo or does not exist, this guide says so plainly.

---

## 1. What SYS_OS is (in one paragraph)
SYS_OS is your **command deck** — a single browser screen that runs your business
records: clients, projects, proposals, contracts, a document vault, and live
monitoring, all with a tamper-evident audit trail. It is real software with real
persistence — **but it runs entirely in this one browser**, with no cloud, no
sync, and (today) no password.

## 2. Three things to internalize before you click
1. **Your data lives in this browser only.** The browser profile is the database.
   Don't switch browsers/machines expecting your data to follow.
2. **You are ADMINISTRATOR by default — no password.** Full control, no login wall.
3. **A few panels are demos.** CEO Console, COO Console, and the Shield "Optimize"
   button show *scripted* output. They are not live tools. (See §7.)

## 3. Launch it (one time)
SYS_OS is a static app served from `tools/command_deck/`.
- **Preferred (gives strong crypto):** serve over `localhost`, e.g. start the
  `command-deck` server and open **http://localhost:4173** in your browser.
- **Why localhost matters:** on `localhost`/HTTPS the Vault uses strong SHA-256
  hashing. Opened any other way, the Vault falls back to a weak hash and will show
  a **WARNING** — so always use localhost.

**You'll know it worked when:** the left sidebar shows the stations and the
top-right badge reads **SYS_OS v3.5.0**.

## 4. Your first 10 minutes (orientation tour)
1. **Architect Core (01)** — your home HUD. Click **INITIALIZE INTEGRITY AUDIT**;
   the toast should report links checked / **0 broken**. (The four big metric
   cards are fixed reference figures, not live math.)
2. **System Health (12)** — click **REFRESH**. Expect mostly **GREEN**. A YELLOW
   *telemetry* band just means an external service is offline — not your problem.
   The **Vault Chain** band should be GREEN (not YELLOW).
3. **Access Control (13)** — confirm you are **ADMINISTRATOR**. Try **LOCK**
   (you drop to READ_ONLY) then **UNLOCK** (you're back). This is how you secure
   the console when you step away.
4. **Executive Dashboard (09)** — note the **TOGGLE DEMO/LIVE** switch. Stay in
   **LIVE** for real work.

## 5. Do one real thing end-to-end (the money path)
This creates real, saved records. Stay in **LIVE** mode.
1. Go to **Client Center (08)** → **+ CLIENT** → enter a name, segment, status →
   save. A new client appears (a `CLT-…` record).
2. **Select** that client's row → its workspace loads.
3. **+ PROPOSAL** → link it to the client, set an amount → save (`PRO-…`).
4. **+ CONTRACT** → link client (and the proposal), set a value → save (`CON-…`).
5. **GEN_REPORT** → read the client's text report.
6. **Prove it's saved:** reload the page. Your client is still there. (Verified:
   records survive reload.)
7. **Check the trail:** open **Activity Timeline (11)** — your creates are listed.

You just ran the core of SYS_OS. Everything you did was persisted and audited.

## 6. Add a document to the Vault (optional)
- **Knowledge Vault (04)** → **+ INGEST_SPEC_DOCUMENT**. A row appears, the chain
  entry count goes up, and **Index State** stays **HEALTHY**.
- **Important:** the Vault stores the document's **path + cryptographic hash**, not
  the file's bytes. **Keep your original file** — the Vault proves integrity, it is
  not your file storage.

## 7. Real vs Demo (don't be fooled)
| Use it as a real tool | Treat as demo / display only |
|---|---|
| Client Center, Registry (Projects), Vault ingest, Live Ops (telemetry/queue/compliance), Dashboard, Operator Workspace, Timeline, System Health, Access | CEO Console buttons · COO Console buttons · Shield "OPTIMIZE" · OCR upload (no provider → nothing extracted) · Architect top metric cards (static) |

## 8. Safe demoing
Showing the platform to someone? On **Executive Dashboard (09)** click **TOGGLE
DEMO/LIVE** → you're in **DEMO**: create/change anything freely; **nothing saves**.
Toggle back to **LIVE** (or just reload) to return to your real data.

## 9. If something looks wrong
| Symptom | What it means | What to do |
|---|---|---|
| Vault Index State = **WARNING** | not on a secure origin (weak hash) | relaunch via **localhost**/HTTPS |
| Can't create anything (writes blocked) | you're in **READ_ONLY** (locked or logged out) | **UNLOCK**, or **LOG IN** as ADMINISTRATOR, or reload |
| A node shows offline | the external service is down (true negative) | re-**PROBE** after it's back |
| OCR upload "does nothing" | no OCR provider installed | expected today — it only parks |
| System Health shows **RED** | a named subsystem failed | open that subsystem; if Vault is DEGRADED see the Manual's Recovery section |
| Worried you broke data | n/a — reload boots LIVE with your saved data | reload the page |

## 10. What you cannot do yet (so you don't go looking)
- No cloud, no multi-device sync (data is local to this browser).
- No multi-user accounts, no password login (ADMINISTRATOR is default).
- No production OCR text extraction.
- No server-side backup (export is a console step — see the Manual).
Destructive actions like wiping the Vault are **console-only** and require a typed
confirmation — you can't do it by clicking.

## 11. Daily rhythm (suggested)
1. **System Health (12)** → REFRESH → confirm green.
2. **Operator Workspace (10)** → scan today's tasks, renewals, expirations.
3. **Client Center (08)** → act (new clients/proposals/contracts, reports).
4. **Activity Timeline (11)** → confirm your work is recorded.
5. Stepping away? **Access (13)** → **LOCK**.

---

**You're ready.** For anything deeper — every button, every workflow, recovery
steps, and RBAC detail — open **SYS_OS_OPERATOR_MANUAL_v3.6.md**.
