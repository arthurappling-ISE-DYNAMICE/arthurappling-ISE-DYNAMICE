# Workflow Library Index

A permanent index of repeatable, end-to-end AI-assisted workflows. Each
entry should be built from `WORKFLOW_TEMPLATE.md` and stored as its own
file once it has been run successfully at least once.

## Workflows

- **Feature build workflow** — from mission definition through
  implementation, verification, and checkpoint.
- **Security audit workflow** — scanning for secrets, weakened RLS, and
  unsafe config before/after a change.
- **Deployment workflow** — build, validate, commit, push (with
  authorization), verify live.
- **Hosting activation workflow** — curated artifact build, validation
  gate, and controlled public hosting activation.
- **Competitor intelligence workflow** — intake, analysis, pattern
  extraction, filing into `05_Competitor_Intelligence/`.
- **Knowledge Vault update workflow** — classify, file, and cross-link new
  information per `AI_UPDATE_PROTOCOL.md` and `VAULT_UPDATE_PROTOCOL.md`.
- **Client onboarding workflow** — discovery through proposed solution
  using the client delivery framework and onboarding questionnaire.
- **Recovery workflow** — detect a repeated failure loop, checkpoint,
  restart clean.
- **Release workflow** — version bump, regression proof, release/audit
  report, `CURRENT_STATE.md` update.
