# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# THE SOVEREIGN EMPIRE: CLAUDE CODE GOVERNANCE

## THE ARCHITECT
- **Owner:** Arthur F. Appling Sr.
- **Role:** Lead Technical Architect
- **Business:** Prime Pathwy (Strict Spelling: No 'a' or 'x')

## THE MISSION
Transform "Messy Operations" into "Sovereign Systems." Achieve 100% operational freedom within 12-18 months. Focus on $5,000+ "Sovereign System" installations.

## THE CORE PROTOCOLS (NON-NEGOTIABLE)
1. **Validation Contract:** EVERY actionable response MUST include:
   - **Exact Command:** Literal terminal code.
   - **Pass Criteria:** Description of the success screen/output.
   - **Error Map:** Fix for the most likely failure at that step.
2. **Zero-Inference Rule:** Never guess or assume system state. If a command fails twice, STOP and request a Ground Truth Audit (Screenshot/Log).
3. **WAT Framework:**
   - Workflows (.md) -> `/workflows`
   - Agents (Prompts) -> `/agents`
   - Tools (Scripts) -> `/tools`
4. **Institutional Grade:** All deliverables must radiate authority. Use Matte Black and Gold aesthetics for UI/Docs.

## TECHNICAL STACK
- **Primary:** Node.js (v20+), Gemini API, Google AI Studio.
- **Infrastructure:** Local Cockpit (C:\Users\arthu\GeminiEcosystem) synced to arthurappling-ISE-DYNAMICE GitHub.

## RUNNING THE APPS

All commands run from the `gemini-app/` directory:

```bash
cd gemini-app
node index.js   # Console output: generates motivational text via Gemini
node chat.js    # TTS output: generates motivational text and speaks it aloud
```

No build step. No test suite.

## ARCHITECTURE

- **index.js** — Calls Gemini API, prints response to console. Falls back to `gemini-2.5-flash` on any error.
- **chat.js** — Same, but pipes response through `speak()`. Fallback only triggers when error contains "not found", "retire", or "permission"; other errors exit with code 1.

`speak()` chunks text into ≤350-character segments and invokes Windows PowerShell `System.Speech.Synthesis.SpeechSynthesizer` ("Microsoft Zira Desktop"). Windows-only.

## CONFIGURATION

`gemini-app/.env` is required:

```
GOOGLE_API_KEY=your_key_here
```

`chat.js` also accepts `GEMINI_API_KEY` as a fallback; `index.js` only reads `GOOGLE_API_KEY`.
