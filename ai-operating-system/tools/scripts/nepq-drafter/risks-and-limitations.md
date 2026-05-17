# NEPQ Drafter — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **Template is hardcoded for Solano property turnover** — the `connection` and `problem` fields reference Solano County real estate context. Any non-real-estate use requires manual template customization before run. Default output sent to a hauling or logistics prospect will misfire.
- **No output file write** — `nepq_drafter.js` currently uses `console.log()` only. The template object is not written to a file, email draft, or CRM. Output must be manually copied for use.
- **No lead data injection** — the script does not accept command-line arguments or read from `top_leads.md` or `leads_vallejo.json`. Integration with Browser Scout Protocol requires manual data transfer between outputs.
- **Uses CommonJS `require('fs')`** — the GeminiEcosystem is configured as an ES6 module project (`"type": "module"` in package.json). Running this file from the project root with `node nepq_drafter.js` may throw `require is not defined in ES module scope`. Run from `tools/` subdirectory where package.json scope may differ, or convert to `import { readFileSync } from 'fs'`.
- **4-stage NEPQ is fixed** — the framework is not configurable. Adding stages (e.g., a follow-up stage) would violate the protocol structure; any extensions should be separate scripts.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| `require is not defined` error | ES module scope conflict | Run from `tools/` directory; or convert source.js to ES module syntax (`import` instead of `require`) |
| Default template sent to wrong vertical | Prospect disqualified by mismatched context | Always customize `connection` + `problem` before any live outreach use |
| No lead data in scope | Template runs with placeholder values | Manually insert prospect data into template fields before run |
| Output not saved | Draft lost if terminal closed | Pipe output to file: `node nepq_drafter.js > draft.txt` |

---

## Deprecation Risk

**Low.** NEPQ framework is stable doctrine. The implementation is minimal — easy to extend without breaking the core 4-stage structure. Risk is in the CommonJS/ESM conflict; this should be resolved before any production integration with Browser Scout.

---

## Conflicts With

**Potential conflict with ES module scope** — see Failure Modes above. No logical conflicts with other agents or workflows. When fully integrated with Browser Scout Protocol, ensure output format is compatible with scout.js lead data structure (JSON key names must align).
