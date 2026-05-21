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
- `dotenv` — Loads `.env` into `process.env
git remote -v`