# 17_Risk_and_Compliance

## Purpose
Track known risks to Prime Pathwy and the rules for trusting (or not
trusting) AI-generated output on legal, financial, and security matters.

## What Belongs Here
- The risk register and its entries.
- Rules for verifying AI output before it's relied upon or shown to a
  client.

## What Does Not Belong Here
- Actual legal or financial advice — this folder documents *process* for
  handling risk, it is not itself legal/financial counsel.
- Specific client incident data (→ a lesson entry in `04_Lessons_Learned/`
  if it produced a reusable lesson, without client-identifying detail).

## How Future AI Sessions Should Update It
- Add a risk register entry whenever a new risk category or specific risk
  is identified — don't wait for the risk to materialize.
- Review and update `Status`/`Review date` fields as risks are mitigated or
  re-assessed.
- Apply `AI_OUTPUT_VERIFICATION_RULES.md` to every AI-generated
  claim before it's treated as fact, especially anything client-facing.

## Warning
**Never store secrets.** No credentials, keys, or private data — risk
entries describe the risk and the controls, not sensitive detail.
