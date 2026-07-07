# CLAUDE.md — Prime Pathwy SYS_OS Operating File

This file is the permanent operating constitution for Claude Code sessions
working in this repository. Read it before acting. It overrides default behavior.

**Rule Zero: repository evidence outranks prompt assumptions and session memory.
Verify ground truth before implementing anything.**

---

## Project Identity

- **Project:** Prime Pathwy SYS_OS
- **Founder / Operator:** Arthur Appling (AA Capital INC dba Prime Pathwy)
- **Purpose:** Private AI operating system for business automation, dashboards,
  secure client operations, and future consulting deployments.
- **Primary application:** `tools/command_deck/` (SYS_OS dashboard, versioned releases)
- **State of record:** `docs/CURRENT_STATE.md`
- **Release audit reports:** `tools/command_deck/docs/v3.0/`

**Current shipped version:** v4.7.1
**Working branch:** `clean-vault-deployment`
**Latest shipped commit:** do not pin here — verify live with `git log --oneline -1`
(a pinned hash in this file goes stale every mission; `docs/CURRENT_STATE.md` is
the state of record).

Verified state as of v4.7.1:

| Check | Status |
|---|---|
| Supabase connection | PASS |
| Authentication (test1/test2) | PASS |
| Persistence | PASS |
| RLS isolation | PASS (technically verified, v4.5.4 status path) |
| Cleanup | PASS |
| Hosting strategy (v4.6.0 builder + validator) | Shipped |
| Public pilot artifact (v4.7) | Committed, validator PASS |
| gh-pages publisher (v4.7.1) | Shipped — local branch built, NOT pushed |

Production remains **blocked** for one reason only: the site is not yet hosted
and hosted-verified. The next step is the **v4.7.1 operator gate**: push
`gh-pages`, enable GitHub Pages (branch `gh-pages` → `/` root), then run hosted
verification per `PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md`.

---

## Ground Truth Protocol

Run this before any implementation work, every session:

1. Inspect repo state first. Verify: current branch, HEAD commit, latest release,
   `git status`, and the current mission.
2. Read `docs/CURRENT_STATE.md` when present.
3. Read only the files required for the mission — no repo-wide safaris.
4. Never assume prior session memory is correct. Memory describes what *was*
   true when written, not what *is* true now.
5. If repository evidence conflicts with prompt assumptions, **evidence wins**.
6. Report the mismatch to the operator before changing anything.
7. No implementation without a verified baseline.

---

## Current Mission Discipline

- One mission at a time. Finish or checkpoint before switching.
- Do not chase unrelated tools, features, or refactors mid-mission.
- Preserve verified state. Never destabilize a banked PASS to make progress elsewhere.
- Never redo completed work unless ground truth proves it is corrupted.
- Stay aligned with the roadmap (see Known Current Roadmap). New ideas go to the
  Parking Lot, not into the current mission.

---

## Checkpoint Recovery Protocol

- If a workflow loops or fails twice the same way, **stop**.
- Do not keep repeating the same failed path with small variations.
- Preserve verified progress — do not tear down what already passed.
- Identify the last known good checkpoint (last banked PASS, last clean commit,
  last verified release).
- Restart from that checkpoint with a clean prompt.
- Never rebuild completed infrastructure unless corruption is proven by evidence.
- Use fresh sessions for different mission types when needed (see Mission
  Separation Rules).
- Bank milestones before moving on: record the PASS, update the state of record,
  then start the next thing.

**The Supabase lesson:** the v4.5.3 Supabase/RLS pass succeeded only after
preserving the verified state and restarting from clean credentials — not by
patching the failed path harder. When stuck, checkpoint and restart clean.

---

## Restart Discipline

- Starting over is allowed **only** from a known-good template or verified checkpoint.
- Do not restart from panic.
- Do not patch broken configuration blindly.
- For small config files, rebuilding from a clean template is often faster than
  hunting syntax errors.
- Before restarting, write down what is already proven and what remains unknown.
- Keep verified wins. A restart resets the broken part, not the banked progress.

---

## Knowledge Preservation

Every completed engineering lesson should be preserved if it has long-term
operational value. Examples include:

- Deployment lessons
- Recovery procedures
- Debugging patterns
- Architectural decisions
- Security discoveries
- Production incidents
- Successful workflows
- Failed workflows that produced useful lessons

Do not rely on conversation history as institutional memory.

Promote proven lessons into permanent documentation.

**Documentation is part of the product.**

---

## Mission Separation Rules

Use separate Claude Code sessions for different mission types:

- Deployment missions
- Documentation missions
- Research missions
- Audit missions
- Feature builds

Do not mix hosting, Graphify, NVIDIA, MCP, dashboard redesign, and backend
testing in one session. Mixed sessions cause context scramble, repeated work,
and lost verified state.

---

## Engineering Rules

- Accuracy over speed.
- Verify before modifying — read the relevant files before writing code.
- Make the smallest safe change that accomplishes the mission.
- No silent assumptions. If system state is unknown, check it or ask.
- **No fake PASS.** A test result is only a PASS if the test actually ran and passed.
- No "production-ready" claims unless the guards and checks prove it.

---

## Security Rules

- Never expose secrets in output, code, commits, or logs.
- Never commit `config.local.js` or any `*.local.js` / `*.local.html` variant.
- Never commit `.env` files.
- Never print API keys, passwords, tokens, or private credentials.
- Frontend code may use **anon/publishable browser-safe keys only**.
- Never place `service_role` or secret keys in browser code — no exceptions.
- Preserve RLS (Row Level Security). Do not weaken or bypass policies.
- Any imported/claimed verification status is **untrusted** until locally reverified.

---

## Git Rules

- Always check branch and `git status` before doing anything.
- **Do not push unless explicitly authorized.** Stop before push by default.
- Show the changed file list before committing.
- Do not commit unrelated files — stage only what the mission touched.
- Do not commit archives containing secrets or local config.
- Commit messages must be clear and release-aligned
  (e.g. `feat(sysos): ...`, `fix(sysos): ...`, `security(repo): ...`).

---

## Release Rules

- Maintain version history (`tools/command_deck/v*/` release directories).
- Create a release/audit report for each shipped version.
- Archive safely — no secrets or local config inside archives.
- Update `docs/CURRENT_STATE.md` after milestones.
- Every release must include regression proof (prior PASSes still pass).
- The Production Guard must remain honest — it reports real state, never aspirational state.

---

## Testing Standards

Every mission that touches SYS_OS requires the applicable subset of:

- Smoke tests
- Drills
- Maintenance checks
- Integrity checks
- Gate checks
- Vault validation
- Zero console errors
- Zero tracked secrets
- Zero config leaks

A mission is not complete until its checks have run and passed with visible output.

---

## Supabase Rules

- **Project ID:** `xwgmbprchzfutlmlymti`
- Supabase is connected and verified (see Project Identity table).
- RLS verification must be **machine-executed** — never accepted on human say-so.
- Test users are disposable. Rotate/delete test credentials after use.
- Do not reuse passwords that were ever pasted into chat.

---

## Hosting Rules

- Hosting is **not yet approved**. Do not deploy anywhere.
- GitHub Pages remains blocked until the v4.6 Hosting Strategy Fix is complete.
- v4.6 must solve:
  - Public/private file separation.
  - Preventing archives, docs, and business metrics from being exposed.
  - Safe config delivery (how the frontend gets its keys without leaking them).

---

## Known Current Roadmap

**Shipped state:**

- v4.5.3 — first live Supabase/RLS pass banked.
- v4.5.4 — RLS Technical Verification Status Path shipped.
- v4.6.0 — Hosting Strategy Fix: allowlist public-deploy builder + validator.
- v4.7 — public pilot artifact committed; business-content signoff accepted;
  repo confirmed PUBLIC.
- v4.7.1 — gh-pages publisher shipped (current); local `gh-pages` branch built
  from the validated artifact, NOT pushed.
- Supabase connected; authentication proven; persistence proven;
  RLS isolation technically verified.
- Production still blocked by hosting activation — nothing else.

**Next mission:**

- v4.7.1 operator gate: push `gh-pages`, enable GitHub Pages, hosted verification.

**Future parked missions** (do not start without explicit authorization):

- Graphify / token-saving evaluation
- Claude Code Skills
- Security hooks
- Release automation
- MCP connectors
- NVIDIA evaluation
- Orbit / executive dashboard
- Client onboarding system
- Command library integration

---

## Project Philosophy

Prime Pathwy SYS_OS exists to create **durable business systems**.

Every feature must improve at least one of:

- Reliability
- Repeatability
- Security
- Operator clarity
- Client value
- Maintainability
- Verified automation

Reject or park features that exist only because they are fashionable.

AI models are replaceable engines. Prime Pathwy SYS_OS is the owned platform.
**Do not make the current AI model the product.**

---

## Client Trust Standard

Prime Pathwy is not a smash-and-grab AI service. The system must be built to
earn client trust.

Client-facing work must prioritize:

- Clear diagnosis
- Honest scope
- Secure data handling
- Repeatable workflows
- Training and handoff
- Supportability
- Measurable business improvement

Do not ship client-facing claims that the platform cannot prove.

---

## Future AI Change Management

AI tools change constantly. Do not rewrite the platform for every new model.

Evaluate any new tool by asking, in order:

1. Does it strengthen SYS_OS?
2. Does it reduce risk or cost?
3. Does it improve client value?
4. Does it fit the current roadmap?
5. Can it be parked safely for later?

Tools like Graphify, NVIDIA, MCP, Claude Skills, Hooks, Agents, and Routines
stay parked unless they support the active mission.

No new integration may interrupt Supabase, hosting, security, or deployment
milestones.

**Never rebuild Prime Pathwy around a model. Build Prime Pathwy so models can
be replaced.** AI models are engines. Prime Pathwy SYS_OS is the owned platform.

---

## Claude Code Feature Usage

**In use / keep for the future:**

- `CLAUDE.md` (this file)
- Memory (persistent session memory)
- Hooks, Skills, MCP — planned, not active
- Routines and agent teams — later

**Do NOT implement yet** (parked until explicitly authorized):

- Hooks
- Skills
- MCP servers
- Scheduled tasks
- Sub-agents
- Remote control workflows
- Slack/GitHub automations beyond current repo work

---

## Operator Learning Rules

- Arthur is the operator/architect, not a passive user. He is learning deeply —
  explain what each step does in plain English, not just what to type.
- Arthur learns best through step-by-step execution.
- Give exact files, paths, commands, buttons, and pass criteria.
- Every actionable response needs: Exact Command + Pass Criteria + Error Map.
- Avoid vague phrases like "go to desktop" without explaining exactly what that
  means on his machine.
- When asking Arthur to click something, name the screen, the sidebar, the
  button, and the expected result.
- Do not overwhelm with five paths when one safe path exists.
- Prefer one mission, one deliverable.
- If Arthur is tired or frustrated, recommend stopping at a clean checkpoint
  rather than pushing through.
- If a session becomes tangled, propose a clean checkpoint restart instead of
  pushing through confusion.

---

## Future Capability Parking Lot

Parked until their mission arrives:

- Claude Code skills
- Release automation
- Security hooks
- Morning health report routine
- MCP connectors
- Client deployment templates
- Dashboard command library
- Agent teams

---

## Appendix: Legacy gemini-app

The repo also contains the original `gemini-app/` experiment (Node.js >= 20, ES modules):

```bash
cd gemini-app
node index.js   # Prints Gemini-generated motivational text to console
node chat.js    # Same, plus Windows TTS via PowerShell SpeechSynthesizer
```

Both scripts try `gemini-2.5-pro` and fall back to `gemini-2.5-flash`. The API key
loads from `gemini-app/.env` (`GOOGLE_API_KEY=...`) — never commit it.
Dependencies: `@google/genai`, `dotenv`.
