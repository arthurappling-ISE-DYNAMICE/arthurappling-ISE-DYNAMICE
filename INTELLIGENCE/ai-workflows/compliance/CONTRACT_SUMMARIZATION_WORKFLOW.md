# AI WORKFLOW: COMMERCIAL CONTRACT SUMMARIZATION & RISK EXTRACTION
**AA Capital INC dba Prime Pathwy — Sovereign Intelligence Vault**
**Classification:** AI Operational System | Last Updated: 2026-05-18

---

## 1. OBJECTIVE
To analyze commercial property management agreements, master service agreements (MSAs), and vendor contracts to extract financial obligations, termination clauses, and hidden liabilities before signature.

## 2. SYSTEM ARCHITECTURE

| Component | Specification |
|---|---|
| Primary Model | Claude 3.5 Sonnet (or equivalent reasoning model) |
| Input Format | PDF or Word Document (Draft Contract) |
| Output Format | Markdown Risk Report |
| Execution Frequency | Ad-hoc, prior to contract execution |
| Human Validation | Required; AI does not replace legal counsel |

## 3. INPUTS REQUIRED
- Draft contract document.
- Context note: "We are the Vendor providing [Service] to the Client."

## 4. SYSTEM PROMPT (THE "AGENT")

```text
You are a commercial contract risk analyst. I am providing a draft Master Service Agreement (MSA) or vendor contract. We are the VENDOR providing services to the CLIENT.

Analyze the contract and extract the following critical business terms. Do not provide legal advice; provide business risk analysis.

Format your output exactly as follows:

1. FINANCIAL TERMS
- Payment Terms: (e.g., Net 30, Net 60)
- Late Payment Penalties: (Are we allowed to charge interest on late payments?)
- Invoice Submission Requirements: (Specific portals or formats required?)

2. TERM & TERMINATION
- Contract Duration:
- Termination for Convenience: (Can the client cancel at any time? How many days' notice is required?)
- Termination for Cause: (What constitutes a breach?)
- Auto-Renewal: (Does the contract automatically renew? What is the cancellation window?)

3. LIABILITY & INDEMNIFICATION
- Indemnification: (Are we indemnifying the client for their own negligence? Flag as HIGH RISK if yes.)
- Limitation of Liability: (Is our liability capped at the contract value, or is it unlimited?)

4. INSURANCE REQUIREMENTS
- List all specific insurance coverages and minimum limits required by the contract.
- Flag any requirements that exceed standard commercial limits ($1M/$2M GL).

5. HIDDEN TRAPS & RED FLAGS
- Identify any "Right to Set-Off" clauses (where the client can withhold payment for disputed amounts).
- Identify any non-solicitation clauses preventing us from hiring client employees or working with client competitors.
- Identify any mandatory arbitration clauses or unfavorable venue jurisdictions.

6. NEGOTIATION RECOMMENDATIONS
- Provide 3-4 specific business points we should push back on or clarify before signing.
```

## 5. OUTPUT VALIDATION LOGIC
- Verify the **Payment Terms** against Prime Pathwy's standard cash flow requirements (e.g., reject Net 90 terms without a price premium).
- Verify the **Insurance Requirements** against Prime Pathwy's current active policies to ensure compliance without needing immediate policy upgrades.

## 6. OPERATIONAL USAGE NOTES
- Use this workflow for all commercial contracts exceeding $10,000 in annual value.
- If the AI flags an "unlimited liability" or "indemnification for client negligence" clause, the contract must be reviewed by legal counsel before execution.
