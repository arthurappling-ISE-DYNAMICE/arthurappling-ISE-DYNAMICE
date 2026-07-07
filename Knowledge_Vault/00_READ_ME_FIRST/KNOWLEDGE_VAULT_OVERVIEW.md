# Knowledge Vault — Overview

## Purpose
The Knowledge Vault is Prime Pathwy's owned, long-term memory system. It exists
so that engineering lessons, architecture decisions, competitor intelligence,
client playbooks, and operational playbooks survive beyond any single chat
session, model, or AI tool.

## Core Rules

1. **Documentation is part of the product.** A lesson that only lives in a
   chat transcript is a lesson that will be relearned the hard way.
2. **Preserve verified lessons.** Only promote something to the vault once it
   has actually been proven true (a real PASS, a real incident, a real
   decision made) — not a hunch or an untested idea.
3. **Do not store secrets.** Never place API keys, passwords, tokens,
   connection strings, or private credentials in any vault file. If a lesson
   requires referencing a credential, reference *where it lives*, never the
   value itself.
4. **Extract ideas, do not blindly copy competitors.** Competitor intelligence
   entries capture patterns worth adapting, not implementations to clone.
   Always note the caution/risk alongside the pattern.
5. **One mission, one deliverable.** The vault documents completed or
   in-progress missions — it is not a scratchpad for hypothetical work.

## How To Add New Notes

- Pick the folder that matches the *type* of information, not the project it
  came from (see each folder's README for what belongs there).
- Use the templates provided (Decision Log, SOP, Checklist, Client Playbook)
  where one exists — consistency makes the vault searchable later.
- Name dated entries `YYYY-MM-DD_short_description.md`.
- Link related entries by relative path where useful.

## How AI Should Classify New Information

When a future AI session encounters something new (a tool, an article, a
competitor, a research asset, a decision that was just made), classify it
before filing it:

- **KEEP** — proven, durable, files into the appropriate numbered folder.
- **PARK** — plausible future value, not needed for current mission → goes to
  `06_Future_Features_Shelf/` or `12_Research_Archive/`.
- **DISCARD** — no lasting value, do not create a file for it.
- **IMPLEMENT_LATER** — validated but intentionally deferred → note in
  `06_Future_Features_Shelf/FUTURE_FEATURES_BACKLOG.md` with a revisit
  condition.

See `AI_UPDATE_PROTOCOL.md` in this folder for the full intake checklist.
