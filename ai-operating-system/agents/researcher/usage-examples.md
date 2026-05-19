# Sovereign Intelligence Research Agent — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — AI Tool Evaluation

**Scenario:** A new AI coding assistant is being promoted. Evaluate before adopting.

**Invocation:**
```
[With source.md loaded as context]

Evaluate [tool name] against the Zero-Hype filter. Confirm:
1. What does it actually do — specific output, not capability claim?
2. Which active systems in GeminiEcosystem could it improve and by how much?
3. What is the integration cost in hours?
4. Does the output/cost ratio meet the 7.42x DSCR gate?
Report in table format. Concrete and Steel only.
```

**Expected Output:** A table with rows for each evaluation criterion. A clear PASS / RESTRUCTURE / DISQUALIFY determination. No marketing language.

---

## Example 2 — Weekly AI Engineering Brief

**Scenario:** Weekly scan of AI developments relevant to active operations.

**Invocation:**
```
[With source.md loaded as context]

Run a Sovereign Intelligence brief for the week of [DATE].
Scope: AI engineering updates relevant to Node.js, Python automation, government contracting, and NFL analytics.
Filter: Zero-Hype. Concrete and Steel only.
Format: Numbered list. Each item: Tool/Update · Concrete Capability · DSCR Relevance · Action or Disqualify.
```

**Expected Output:** A numbered list of 3–7 items. Each item contains a concrete capability description, not a marketing summary. Each ends with a recommended action or explicit disqualification.

---

## Example 3 — Pre-Meeting Intelligence Brief

**Scenario:** Preparing for an SBDC meeting, lender call, or capital pitch.

**Invocation:**
```
[With source.md loaded as context]

Generate a pre-meeting intelligence brief for [MEETING TYPE] on [DATE].
Confirm current state of: DSCR 7.42x anchor, active revenue systems, AI capabilities deployed.
Flag any capability claims that require additional evidence before the meeting.
Output: Executive summary (5 bullets max) + any gaps requiring Ground Truth Audit.
```

**Expected Output:** 5-bullet executive summary with verified facts only. Any unverified claim is flagged as requiring Ground Truth Audit before use in the meeting.

---

## Anti-Patterns

- **DO NOT** use this agent to evaluate tools you have already decided to adopt — confirmation bias invalidates the filter
- **DO NOT** present agent output as market research without verifying claims against primary sources
- **DO NOT** run intelligence briefs without loading `source.md` — the filter will not apply
- **DO NOT** pass stale hardcoded constants — outdated SBDC dates or DSCR values produce incorrect prioritization
