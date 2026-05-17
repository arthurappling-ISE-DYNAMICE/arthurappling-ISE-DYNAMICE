# Elite 10 Consulting Framework — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **10-client cap is a hard ceiling** — the system is designed for depth, not volume. Exceeding 10 simultaneous engagements degrades quality and violates the framework's own standard.
- **SB certification stack is partially pending** — CA Small Business certification and Federal MBE registration are in process. The Middleman Bridge (Phase 3) is constrained until certifications are issued.
- **`/Scaffold` and `/Prime` skills required** — Phase 4 activation references these skills (`~/.claude/skills/Scaffold.md` and `~/.claude/skills/Prime.md`). If these skills are not deployed, the client folder creation and audit log initialization steps require manual execution.
- **NEPQ diagnostic requires live conversation** — the diagnosis phase cannot be automated. It requires a real intake session with the client.
- **$5,000 price point is a floor, not a ceiling** — the framework references $5,000+ but does not define engagement structures above that floor. Retainer, milestone, and full installation structures exist but are not documented here.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Client takes on 11th engagement | Quality degrades across all active installs | Hard cap at 10 — decline or waitlist without exception |
| Engine installed before bottleneck identified | Wrong engine deployed; client frustrated | Phase 1 diagnosis is non-negotiable before any install begins |
| SB cert lapses | Middleman Bridge collapses; subcontract eligibility lost | Monitor CA SB and SAM.gov renewal dates with calendar alerts |
| Close attempted before Phases 1–3 | Close fails; client feels pitched rather than diagnosed | Follow phase sequence exactly — close is Phase 4, not an opener |
| Client unwilling to document accepted | System fails within 30 days without buy-in | Apply disqualification criteria during diagnosis — do not proceed if documentation resistance is present |

---

## Deprecation Risk

**Low.** The four-phase methodology is based on operational principles, not software or platform dependency. The NEPQ diagnostic script and Nate Herk framework reference points are stable. Primary decay risk: `/Scaffold` and `/Prime` skill availability.

---

## Conflicts With

**Potential overlap with `elite-10-engine/`** — the ENGINE covers bid sourcing operations that are one component of Phase 2 Speed-to-Lead. The FRAMEWORK governs the overall methodology. They are complementary. In case of apparent contradiction, the FRAMEWORK (WHY/WHEN) takes precedence over the ENGINE (WHERE/HOW).
