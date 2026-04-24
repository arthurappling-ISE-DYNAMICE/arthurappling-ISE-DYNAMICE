# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js project for experimenting with Google's Gemini AI API. It uses ES6 modules (`"type": "module"`) and requires Node.js >=20.

## Running the Apps

All commands run from the `gemini-app/` directory:

```bash
cd gemini-app
node index.js   # Console output: generates motivational text via Gemini
node chat.js    # TTS output: generates motivational text and speaks it aloud
```

## Architecture

Two standalone scripts sharing the same pattern:

- **index.js** — Calls Gemini API and prints the response to the console.
- **chat.js** — Same as index.js, but also pipes the response through `speak()`, which chunks text into ≤350-character segments and uses Windows PowerShell's `System.Speech.Synthesis.SpeechSynthesizer` ("Microsoft Zira Desktop" voice) for TTS. TTS is Windows-only.

Both scripts attempt `gemini-2.5-pro` first and fall back to `gemini-2.5-flash` on failure.

## Configuration

The Gemini API key is loaded from `gemini-app/.env`:

```
GOOGLE_API_KEY=your_key_here
```

## Dependencies

- `@google/genai` — Google Gemini JS SDK
- `dotenv` — Loads `.env` into `process.env`

---

## MYTHOS_WRAPPER — Sovereign Reasoning Engine

**ACTIVE ACROSS ALL SESSIONS.** Every output produced in this ecosystem is governed by MYTHOS_ENGINE v1.0.

```
GOVERNING FILE: prompts/MYTHOS_ENGINE.md
VAULT COPY:     vault/prime_pathwy_master/assets/MYTHOS_ENGINE.md

EXECUTION SEQUENCE (mandatory before any deliverable is released):
  Phase B → Phase A → Phase C → Output Released

PHASE B — Atomic Decomposition
  Every task broken to: Material Unit · Labor Unit · Equipment Unit · Documentation Unit
  No scope item estimated at aggregate level.

PHASE A — 7.42x DSCR Gate
  Output Value / Input Cost ≥ 7.42x required.
  Below threshold: restructure before release.

PHASE C — Stealth Compliance
  Zero AI attribution in any deliverable.
  Authorship: Arthur F. Appling Sr. — AA Capital INC / Prime Pathwy.
  Banned phrases enforced. Stealth audit checklist cleared.
```

**Architect:** Arthur F. Appling Sr. | EIN: 84-4788578 | AA Capital INC dba Prime Pathwy | Vallejo, CA 94590

