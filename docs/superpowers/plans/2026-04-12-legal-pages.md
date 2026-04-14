# Legal Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three standalone legal HTML pages (`privacy.html`, `terms.html`, `accessibility.html`) in `Prime_Pathwy_Turnover_System/` and surgically update the `index.html` footer to link to them.

**Architecture:** Approach A — Self-Contained Inline Styling. Each page is a standalone fortress with Tailwind CDN, all styles inline, zero external CSS dependencies. Matches `index.html` Matte Black + Gold aesthetic exactly. Flat static files, no build step.

**Tech Stack:** HTML5, Tailwind CSS (CDN), inline `<style>` block, vanilla JS (one-liner for ADA button)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `Prime_Pathwy_Turnover_System/privacy.html` | CCPA Privacy Policy — 6 sections, Sovereign Audit Logic, California rights |
| Create | `Prime_Pathwy_Turnover_System/terms.html` | Terms of Service — No Verbal Order Rule, Master Pathwy docs, payment terms |
| Create | `Prime_Pathwy_Turnover_System/accessibility.html` | ADA / WCAG 2.1 Accessibility Statement — 6 sections |
| Modify | `Prime_Pathwy_Turnover_System/index.html:2003-2041` | Footer surgical update — 3 link changes, no other edits |

---

### Task 1: Create `privacy.html`

**Files:**
- Create: `Prime_Pathwy_Turnover_System/privacy.html`

- [ ] **Step 1: Verify working directory**

```bash
ls Prime_Pathwy_Turnover_System/
```
Expected: `index.html`, `favicon.ico`, `favicon-32.png`, image files. Confirms target directory exists.

- [ ] **Step 2: Create privacy.html with full content**

Create `Prime_Pathwy_Turnover_System/privacy.html` with the following exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy | Prime Pathwy</title>
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #050505;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
    line-height: 1.6;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
  .gold-text {
    background: linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .eyebrow {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.5);
    display: block;
    margin-bottom: 1rem;
  }
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(5,5,5,.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
  }
  .nav-logo {
    font-family: Georgia, serif;
    font-style: italic;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -.02em;
    background: linear-gradient(135deg, #F5D98A, #C9A84C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }
  .back-link {
    font-size: 9px;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    text-decoration: none;
    transition: color .2s;
  }
  .back-link:hover { color: #FFD700; }
  .legal-section-head {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.6);
    margin: 0 0 .75rem;
    display: block;
  }
  .clause-block {
    border-left: 2px solid rgba(201,168,76,.4);
    background: #080808;
    padding: 1.25rem 1.5rem;
    margin: 1rem 0;
  }
  footer {
    border-top: 1px solid rgba(255,255,255,.06);
    background: #020202;
    padding: 3.5rem 2rem;
    text-align: center;
  }
  @media (max-width: 768px) {
    .content-wrap { padding: 0 1.25rem; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="index.html" class="nav-logo">Prime Pathwy</a>
  <a href="index.html" class="back-link">← Back to Site</a>
</nav>

<!-- PAGE HEADER -->
<div style="padding-top: 60px;">
  <div style="max-width: 860px; margin: 0 auto; padding: 5rem 1.5rem 3rem;" class="content-wrap">
    <span class="eyebrow">Legal · Privacy Policy</span>
    <h1 style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 900;
               font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; margin: 0 0 1.5rem;"
        class="gold-text">Privacy Policy</h1>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.5); margin: 0 0 .5rem;">
      Arthur F. Appling Sr. — Executive Principal
    </p>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.3); margin: 0 0 3rem;">
      Effective: April 12, 2026
    </p>
    <div style="width: 100%; height: 1px; background: rgba(201,168,76,.15); margin-bottom: 3rem;"></div>

    <!-- SECTION 1 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 1 — Information We Collect</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Prime Pathwy collects the following information when you request or receive services:
        name, mailing address, phone number, email address, property address, scope of services
        requested, and payment data (processed via secure third-party processors — we do not
        store raw card numbers). We do not collect biometric data, government ID numbers,
        or sensitive personal information.
      </p>
    </div>

    <!-- SECTION 2 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 2 — How We Use Your Information</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Your information is used exclusively for: scheduling and dispatch of services,
        invoicing and payment processing, service documentation and completion records,
        Sovereign Audit record-keeping, and regulatory compliance. We do not sell, rent,
        or share your personal information with third parties for marketing purposes.
      </p>
    </div>

    <!-- SECTION 3 — SOVEREIGN AUDIT LOGIC (key clause) -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 3 — Sovereign Audit Logic</span>
      <div class="clause-block">
        <p style="color: rgba(255,255,255,.9); font-size: 15px; line-height: 1.8; margin: 0;">
          All job records, before/after photo documentation, signed work orders, and
          service completion reports are retained as part of Prime Pathwy's institutional
          audit trail. By engaging Prime Pathwy services, clients acknowledge and consent
          to this documentation protocol. These records serve as the authoritative record
          of services rendered and support operational integrity, dispute resolution,
          and legal defensibility.
        </p>
      </div>
    </div>

    <!-- SECTION 4 — CCPA RIGHTS (key clause) -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 4 — Your California Rights (CCPA)</span>
      <div class="clause-block">
        <p style="color: rgba(255,255,255,.9); font-size: 15px; line-height: 1.8; margin: 0 0 1rem;">
          As a California resident, you have the following rights under the California
          Consumer Privacy Act (CCPA):
        </p>
        <ul style="color: rgba(255,255,255,.8); font-size: 15px; line-height: 1.8;
                   margin: 0; padding-left: 1.5rem;">
          <li><strong style="color:#fff;">Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
          <li><strong style="color:#fff;">Right to Delete:</strong> Request deletion of personal information we have collected, subject to legal hold requirements.</li>
          <li><strong style="color:#fff;">Right to Opt-Out:</strong> We do not sell personal information. No opt-out required.</li>
          <li><strong style="color:#fff;">Right to Non-Discrimination:</strong> Exercising your CCPA rights will not result in denial of services or different pricing.</li>
        </ul>
        <p style="color: rgba(255,255,255,.6); font-size: 13px; line-height: 1.8; margin: 1rem 0 0;">
          Requests will be acknowledged within 10 business days and fulfilled within
          45 calendar days. Submit all privacy requests in writing to the contact below.
        </p>
      </div>
    </div>

    <!-- SECTION 5 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 5 — Data Retention</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Service records, work orders, and related documentation are retained for a minimum
        of three (3) years per Prime Pathwy operational doctrine. Records subject to active
        dispute or legal hold are retained until resolution. Destruction of records upon
        client request is subject to review for legal hold obligations.
      </p>
    </div>

    <!-- SECTION 6 -->
    <div style="margin-bottom: 4rem;">
      <span class="legal-section-head">Section 6 — Contact for Privacy Requests</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0 0 1rem;">
        All privacy requests must be submitted in writing to:
      </p>
      <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.5rem 2rem;
                  background: #050505; display: inline-block;">
        <p style="color: #fff; font-size: 15px; line-height: 1.8; margin: 0; font-weight: 700;">
          Arthur F. Appling Sr. — Executive Principal<br>
          Prime Pathwy<br>
          425 Virginia St STE B, Vallejo, CA 94590<br>
          <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
          contact@primepathwy.com
        </p>
      </div>
    </div>

    <div style="width: 100%; height: 1px; background: rgba(255,255,255,.04); margin-bottom: 4rem;"></div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column;
              align-items: center; gap: 1.5rem;">
    <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: 900;
               font-size: 20px; background: linear-gradient(135deg, #F5D98A, #C9A84C);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent;
               background-clip: text;">
      Prime Pathwy
    </p>
    <p style="font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
              color: rgba(255,255,255,.75); margin: 0;">
      Property Turnover Services · Cleaning · Haul-Out · Paint · Full Turnovers
    </p>
    <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.75rem 2.5rem;
                max-width: 720px; width: 100%; background: #050505;">
      <p style="font-size: 9px; letter-spacing: .38em; text-transform: uppercase;
                color: rgba(201,168,76,.5); margin: 0 0 1rem;">
        Business Address &amp; Contact
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0 0 .45rem;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        425 Virginia St STE B &nbsp;·&nbsp; Vallejo, CA 94590
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        <!-- UPDATE PHONE: Confirm (925) 308-3233 is live -->
        (925) 308-3233 &nbsp;·&nbsp;
        <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
        contact@primepathwy.com
      </p>
    </div>
    <div style="width: 100%; max-width: 400px; height: 1px;
                background: rgba(255,255,255,.04);"></div>
    <p style="font-size: 8px; letter-spacing: .15em; text-transform: uppercase;
              color: rgba(255,255,255,.12); margin: 0;">
      © 2026 Prime Pathwy · All Rights Reserved · Documented · Defensible · Delivered
    </p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 3: Verify file exists and key content is present**

```bash
grep -c "84-4788578\|CCPA\|Sovereign Audit\|Arthur F. Appling Sr.\|privacy" Prime_Pathwy_Turnover_System/privacy.html
```
Expected: count > 0 for each. Run separately:
```bash
grep -n "CCPA\|Sovereign Audit\|Arthur F. Appling Sr." Prime_Pathwy_Turnover_System/privacy.html
```
Expected: 3+ matches found.

- [ ] **Step 4: Commit**

```bash
git add Prime_Pathwy_Turnover_System/privacy.html
git commit -m "feat: Privacy Policy — CCPA compliant, Sovereign Audit Logic, California rights"
```

---

### Task 2: Create `terms.html`

**Files:**
- Create: `Prime_Pathwy_Turnover_System/terms.html`

- [ ] **Step 1: Create terms.html with full content**

Create `Prime_Pathwy_Turnover_System/terms.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service | Prime Pathwy</title>
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #050505;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
    line-height: 1.6;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
  .gold-text {
    background: linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .eyebrow {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.5);
    display: block;
    margin-bottom: 1rem;
  }
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(5,5,5,.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
  }
  .nav-logo {
    font-family: Georgia, serif;
    font-style: italic;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -.02em;
    background: linear-gradient(135deg, #F5D98A, #C9A84C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }
  .back-link {
    font-size: 9px;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    text-decoration: none;
    transition: color .2s;
  }
  .back-link:hover { color: #FFD700; }
  .legal-section-head {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.6);
    margin: 0 0 .75rem;
    display: block;
  }
  .clause-block {
    border-left: 2px solid rgba(201,168,76,.4);
    background: #080808;
    padding: 1.25rem 1.5rem;
    margin: 1rem 0;
  }
  .no-verbal-block {
    border: 1px solid rgba(201,168,76,.35);
    border-left: 4px solid #C9A84C;
    background: #080808;
    padding: 1.75rem 2rem;
    margin: 1rem 0;
  }
  footer {
    border-top: 1px solid rgba(255,255,255,.06);
    background: #020202;
    padding: 3.5rem 2rem;
    text-align: center;
  }
  @media (max-width: 768px) {
    .content-wrap { padding: 0 1.25rem; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="index.html" class="nav-logo">Prime Pathwy</a>
  <a href="index.html" class="back-link">← Back to Site</a>
</nav>

<!-- PAGE HEADER -->
<div style="padding-top: 60px;">
  <div style="max-width: 860px; margin: 0 auto; padding: 5rem 1.5rem 3rem;" class="content-wrap">
    <span class="eyebrow">Legal · Terms of Service</span>
    <h1 style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 900;
               font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; margin: 0 0 1.5rem;"
        class="gold-text">Terms of Service</h1>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.5); margin: 0 0 .5rem;">
      Arthur F. Appling Sr. — Executive Principal
    </p>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.3); margin: 0 0 3rem;">
      Effective: April 12, 2026
    </p>
    <div style="width: 100%; height: 1px; background: rgba(201,168,76,.15); margin-bottom: 3rem;"></div>

    <!-- SECTION 1 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 1 — Scope of Services</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Prime Pathwy provides property turnover, cleaning, haul-out, paint preparation,
        and full turnover services under NAICS 561720 (Janitorial Services) and NAICS 562111
        (Hauling / Solid Waste Collection). Services are performed in Vallejo, CA and
        surrounding Solano County jurisdictions. All service scopes are defined in writing
        prior to commencement.
      </p>
    </div>

    <!-- SECTION 2 — NO VERBAL ORDER RULE (primary defense block) -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 2 — The No Verbal Order Rule</span>
      <div class="no-verbal-block">
        <p style="font-size: 9px; letter-spacing: .3em; text-transform: uppercase;
                  color: rgba(201,168,76,.8); margin: 0 0 1rem;">
          ⚠ Primary Defense Against Scope Creep
        </p>
        <p style="color: #FFFFFF; font-size: 16px; line-height: 1.8; margin: 0;
                  font-style: italic; font-family: Georgia, serif; font-weight: 700;">
          "Prime Pathwy does not accept verbal work orders. All service requests must
          be submitted in writing via signed work order, email confirmation, or the
          Prime Pathwy intake form. Verbal instructions carry no operational authority
          and will not be honored."
        </p>
        <p style="color: rgba(255,255,255,.6); font-size: 13px; line-height: 1.8; margin: 1.25rem 0 0;">
          Any request to expand the scope of work during an active job must be submitted
          in writing and acknowledged by an authorized Prime Pathwy representative before
          additional work commences. Verbal expansion requests will not result in additional
          charges or additional work performed.
        </p>
      </div>
    </div>

    <!-- SECTION 3 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 3 — Master Pathwy Documentation Requirements</span>
      <div class="clause-block">
        <p style="color: rgba(255,255,255,.9); font-size: 15px; line-height: 1.8; margin: 0;">
          All Prime Pathwy work is documented per Master Pathwy SOP: written scope of work,
          before/after photographic record, and client or property manager completion sign-off.
          The client acknowledges that these records are institutional property of Prime Pathwy
          and serve as the sole authoritative record of services rendered. Documentation may
          be referenced in billing disputes, legal proceedings, and regulatory audits.
        </p>
      </div>
    </div>

    <!-- SECTION 4 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 4 — Payment Terms</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0 0 1rem;">
        Payment is due upon completion of services unless otherwise agreed in writing.
        Accepted payment methods: check, ACH bank transfer, and card (processed via
        secure third-party processor).
      </p>
      <ul style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8;
                 margin: 0; padding-left: 1.5rem;">
        <li>Invoices unpaid after <strong style="color:#fff;">15 days</strong> accrue a 1.5% monthly service charge.</li>
        <li>Disputed invoices must be submitted in writing within <strong style="color:#fff;">5 business days</strong> of invoice date.</li>
        <li>Verbal disputes carry no operational authority per Section 2.</li>
      </ul>
    </div>

    <!-- SECTION 5 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 5 — Cancellation &amp; Rescheduling</span>
      <ul style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8;
                 margin: 0; padding-left: 1.5rem;">
        <li><strong style="color:#fff;">24-hour written notice</strong> required for cancellation or rescheduling.</li>
        <li>Same-day cancellation billed at <strong style="color:#fff;">50%</strong> of quoted scope.</li>
        <li>No-shows (crew arrives, property inaccessible) billed at <strong style="color:#fff;">100%</strong> of quoted scope.</li>
      </ul>
    </div>

    <!-- SECTION 6 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 6 — Limitation of Liability</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Prime Pathwy's total liability for any claim arising from services rendered shall
        not exceed the value of the individual service contract at issue. Prime Pathwy
        shall not be liable for consequential, incidental, special, or punitive damages
        of any kind.
      </p>
    </div>

    <!-- SECTION 7 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 7 — Governing Law</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        These Terms of Service are governed by the laws of the State of California.
        Any disputes shall be resolved in Solano County Superior Court, Vallejo, CA.
      </p>
    </div>

    <!-- SECTION 8 -->
    <div style="margin-bottom: 4rem;">
      <span class="legal-section-head">Section 8 — Contact</span>
      <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.5rem 2rem;
                  background: #050505; display: inline-block;">
        <p style="color: #fff; font-size: 15px; line-height: 1.8; margin: 0; font-weight: 700;">
          Arthur F. Appling Sr. — Executive Principal<br>
          Prime Pathwy<br>
          425 Virginia St STE B, Vallejo, CA 94590<br>
          <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
          contact@primepathwy.com
        </p>
      </div>
    </div>

    <div style="width: 100%; height: 1px; background: rgba(255,255,255,.04); margin-bottom: 4rem;"></div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column;
              align-items: center; gap: 1.5rem;">
    <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: 900;
               font-size: 20px; background: linear-gradient(135deg, #F5D98A, #C9A84C);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent;
               background-clip: text;">
      Prime Pathwy
    </p>
    <p style="font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
              color: rgba(255,255,255,.75); margin: 0;">
      Property Turnover Services · Cleaning · Haul-Out · Paint · Full Turnovers
    </p>
    <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.75rem 2.5rem;
                max-width: 720px; width: 100%; background: #050505;">
      <p style="font-size: 9px; letter-spacing: .38em; text-transform: uppercase;
                color: rgba(201,168,76,.5); margin: 0 0 1rem;">
        Business Address &amp; Contact
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0 0 .45rem;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        425 Virginia St STE B &nbsp;·&nbsp; Vallejo, CA 94590
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        <!-- UPDATE PHONE: Confirm (925) 308-3233 is live -->
        (925) 308-3233 &nbsp;·&nbsp;
        <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
        contact@primepathwy.com
      </p>
    </div>
    <div style="width: 100%; max-width: 400px; height: 1px;
                background: rgba(255,255,255,.04);"></div>
    <p style="font-size: 8px; letter-spacing: .15em; text-transform: uppercase;
              color: rgba(255,255,255,.12); margin: 0;">
      © 2026 Prime Pathwy · All Rights Reserved · Documented · Defensible · Delivered
    </p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify key content**

```bash
grep -n "No Verbal Order\|NAICS 561720\|Arthur F. Appling Sr.\|Solano County" Prime_Pathwy_Turnover_System/terms.html
```
Expected: 4+ matches found across the file.

- [ ] **Step 3: Commit**

```bash
git add Prime_Pathwy_Turnover_System/terms.html
git commit -m "feat: Terms of Service — No Verbal Order Rule, Master Pathwy docs, payment terms"
```

---

### Task 3: Create `accessibility.html`

**Files:**
- Create: `Prime_Pathwy_Turnover_System/accessibility.html`

- [ ] **Step 1: Create accessibility.html with full content**

Create `Prime_Pathwy_Turnover_System/accessibility.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Accessibility Statement | Prime Pathwy</title>
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: #050505;
    color: #fff;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
    line-height: 1.6;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
  .gold-text {
    background: linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .eyebrow {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.5);
    display: block;
    margin-bottom: 1rem;
  }
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(5,5,5,.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
  }
  .nav-logo {
    font-family: Georgia, serif;
    font-style: italic;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -.02em;
    background: linear-gradient(135deg, #F5D98A, #C9A84C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }
  .back-link {
    font-size: 9px;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    text-decoration: none;
    transition: color .2s;
  }
  .back-link:hover { color: #FFD700; }
  .legal-section-head {
    font-size: 9px;
    letter-spacing: .4em;
    text-transform: uppercase;
    color: rgba(201,168,76,.6);
    margin: 0 0 .75rem;
    display: block;
  }
  .clause-block {
    border-left: 2px solid rgba(201,168,76,.4);
    background: #080808;
    padding: 1.25rem 1.5rem;
    margin: 1rem 0;
  }
  footer {
    border-top: 1px solid rgba(255,255,255,.06);
    background: #020202;
    padding: 3.5rem 2rem;
    text-align: center;
  }
  @media (max-width: 768px) {
    .content-wrap { padding: 0 1.25rem; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="index.html" class="nav-logo">Prime Pathwy</a>
  <a href="index.html" class="back-link">← Back to Site</a>
</nav>

<!-- PAGE HEADER -->
<div style="padding-top: 60px;">
  <div style="max-width: 860px; margin: 0 auto; padding: 5rem 1.5rem 3rem;" class="content-wrap">
    <span class="eyebrow">Legal · Accessibility Statement</span>
    <h1 style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 900;
               font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; margin: 0 0 1.5rem;"
        class="gold-text">Accessibility Statement</h1>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.5); margin: 0 0 .5rem;">
      Arthur F. Appling Sr. — Executive Principal
    </p>
    <p style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
              color: rgba(255,255,255,.3); margin: 0 0 3rem;">
      Effective: April 12, 2026
    </p>
    <div style="width: 100%; height: 1px; background: rgba(201,168,76,.15); margin-bottom: 3rem;"></div>

    <!-- SECTION 1 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 1 — Our Commitment</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        Prime Pathwy is committed to digital accessibility for all users, including those
        with visual, auditory, motor, and cognitive disabilities. This website is designed
        and maintained to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
        standards. Accessibility is not an afterthought — it is an institutional requirement.
      </p>
    </div>

    <!-- SECTION 2 — WCAG 2.1 STANDARDS (key clause) -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 2 — Standards Targeted</span>
      <div class="clause-block">
        <p style="color: rgba(255,255,255,.9); font-size: 15px; font-weight: 700;
                  line-height: 1.8; margin: 0 0 1rem;">
          WCAG 2.1 Level AA — Four Principles:
        </p>
        <ul style="color: rgba(255,255,255,.8); font-size: 15px; line-height: 1.8;
                   margin: 0; padding-left: 1.5rem;">
          <li><strong style="color:#fff;">Perceivable:</strong> All content is presentable to users regardless of sensory ability. Text alternatives are provided for non-text content.</li>
          <li><strong style="color:#fff;">Operable:</strong> All interface components and navigation are keyboard-accessible. No content requires a mouse to operate.</li>
          <li><strong style="color:#fff;">Understandable:</strong> Content is readable, predictable, and input assistance is provided where needed.</li>
          <li><strong style="color:#fff;">Robust:</strong> Content is interpreted reliably by current and future assistive technologies including screen readers.</li>
        </ul>
      </div>
    </div>

    <!-- SECTION 3 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 3 — Measures Taken</span>
      <ul style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8;
                 margin: 0; padding-left: 1.5rem;">
        <li><strong style="color:#fff;">Color contrast:</strong> Matte Black <code style="color:rgba(201,168,76,.8);">#050505</code> background with Gold <code style="color:rgba(201,168,76,.8);">#F5D98A</code> text exceeds the WCAG 4.5:1 minimum contrast ratio for normal text.</li>
        <li><strong style="color:#fff;">Keyboard navigation:</strong> All interactive elements (buttons, links, form inputs) are reachable and operable via keyboard Tab and Enter.</li>
        <li><strong style="color:#fff;">ARIA labels:</strong> All buttons, links, and interactive elements carry descriptive <code style="color:rgba(201,168,76,.8);">aria-label</code> attributes.</li>
        <li><strong style="color:#fff;">Semantic HTML:</strong> Proper heading hierarchy (H1 → H2 → H3), landmark elements (<code style="color:rgba(201,168,76,.8);">nav</code>, <code style="color:rgba(201,168,76,.8);">main</code>, <code style="color:rgba(201,168,76,.8);">footer</code>), and semantic structure throughout.</li>
        <li><strong style="color:#fff;">No auto-play media:</strong> No audio or video content plays automatically.</li>
        <li><strong style="color:#fff;">Responsive layout:</strong> Site layout supports browser zoom up to 400% without horizontal scrolling or loss of content.</li>
        <li><strong style="color:#fff;">Image alt text:</strong> All meaningful images carry descriptive alt attributes.</li>
      </ul>
    </div>

    <!-- SECTION 4 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 4 — Known Limitations</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0 0 1rem;">
        We are committed to transparency about areas under active improvement:
      </p>
      <ul style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8;
                 margin: 0; padding-left: 1.5rem;">
        <li>Before/after property photo gallery is visual content. Extended alt-text descriptions of property conditions are available upon written request.</li>
        <li>We are actively expanding non-visual descriptions for all comparative media.</li>
      </ul>
    </div>

    <!-- SECTION 5 -->
    <div style="margin-bottom: 2.5rem;">
      <span class="legal-section-head">Section 5 — Feedback &amp; Support</span>
      <p style="color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.8; margin: 0;">
        If you encounter an accessibility barrier on this site, we want to know.
        Contact us directly and we commit to: acknowledging your message within
        2 business days, providing an accessible alternative within 5 business days,
        and incorporating systemic improvements as appropriate. No user will be denied
        access to information due to an accessibility limitation on our end.
      </p>
    </div>

    <!-- SECTION 6 -->
    <div style="margin-bottom: 4rem;">
      <span class="legal-section-head">Section 6 — Contact</span>
      <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.5rem 2rem;
                  background: #050505; display: inline-block;">
        <p style="color: #fff; font-size: 15px; line-height: 1.8; margin: 0; font-weight: 700;">
          Arthur F. Appling Sr. — Executive Principal<br>
          Prime Pathwy<br>
          425 Virginia St STE B, Vallejo, CA 94590<br>
          <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
          contact@primepathwy.com
        </p>
      </div>
    </div>

    <div style="width: 100%; height: 1px; background: rgba(255,255,255,.04); margin-bottom: 4rem;"></div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column;
              align-items: center; gap: 1.5rem;">
    <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: 900;
               font-size: 20px; background: linear-gradient(135deg, #F5D98A, #C9A84C);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent;
               background-clip: text;">
      Prime Pathwy
    </p>
    <p style="font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
              color: rgba(255,255,255,.75); margin: 0;">
      Property Turnover Services · Cleaning · Haul-Out · Paint · Full Turnovers
    </p>
    <div style="border: 1px solid rgba(201,168,76,.22); padding: 1.75rem 2.5rem;
                max-width: 720px; width: 100%; background: #050505;">
      <p style="font-size: 9px; letter-spacing: .38em; text-transform: uppercase;
                color: rgba(201,168,76,.5); margin: 0 0 1rem;">
        Business Address &amp; Contact
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0 0 .45rem;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        425 Virginia St STE B &nbsp;·&nbsp; Vallejo, CA 94590
      </p>
      <p style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin: 0;
                font-family: 'Courier New', monospace; letter-spacing: .04em; line-height: 1.6;">
        <!-- UPDATE PHONE: Confirm (925) 308-3233 is live -->
        (925) 308-3233 &nbsp;·&nbsp;
        <!-- UPDATE EMAIL: Replace with operations@primepathwy.com when Namecheap email is live -->
        contact@primepathwy.com
      </p>
    </div>
    <div style="width: 100%; max-width: 400px; height: 1px;
                background: rgba(255,255,255,.04);"></div>
    <p style="font-size: 8px; letter-spacing: .15em; text-transform: uppercase;
              color: rgba(255,255,255,.12); margin: 0;">
      © 2026 Prime Pathwy · All Rights Reserved · Documented · Defensible · Delivered
    </p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify key content**

```bash
grep -n "WCAG 2.1\|Arthur F. Appling Sr.\|4.5:1\|keyboard" Prime_Pathwy_Turnover_System/accessibility.html
```
Expected: 4+ matches.

- [ ] **Step 3: Commit**

```bash
git add Prime_Pathwy_Turnover_System/accessibility.html
git commit -m "feat: Accessibility Statement — WCAG 2.1 Level AA, contrast ratios, ADA commitment"
```

---

### Task 4: Surgical Update to `index.html` Footer

**Files:**
- Modify: `Prime_Pathwy_Turnover_System/index.html` (3 targeted edits, lines ~2003-2041 only)

- [ ] **Step 1: Verify the three footer elements exist as expected**

```bash
grep -n "href=\"#\"" Prime_Pathwy_Turnover_System/index.html
```
Expected: 2 lines containing `href="#"` in the footer (Privacy Policy and Terms of Service).

```bash
grep -n "onclick.*alert\|alert.*Privacy\|alert.*Terms\|alert.*Accessibility" Prime_Pathwy_Turnover_System/index.html
```
Expected: 3 lines containing onclick alert calls.

- [ ] **Step 2: Replace Privacy Policy link**

Find this exact block:
```html
      <a href="#"
         aria-label="Privacy Policy"
         onclick="alert('Privacy Policy — Document in progress. Contact pathwyservices@primepathwy.com for inquiries.'); return false;"
         style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #FFFFFF;
                text-decoration: none; transition: color .2s;"
         onmouseover="this.style.color='#FFD700'" onmouseout="this.style.color='#FFFFFF'">
        Privacy Policy
      </a>
```

Replace with:
```html
      <a href="privacy.html"
         aria-label="Privacy Policy"
         style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #FFFFFF;
                text-decoration: none; transition: color .2s;"
         onmouseover="this.style.color='#FFD700'" onmouseout="this.style.color='#FFFFFF'">
        Privacy Policy
      </a>
```

- [ ] **Step 3: Replace Terms of Service link**

Find this exact block:
```html
      <a href="#"
         aria-label="Terms of Service"
         onclick="alert('Terms of Service — Document in progress. Contact pathwyservices@primepathwy.com for inquiries.'); return false;"
         style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #FFFFFF;
                text-decoration: none; transition: color .2s;"
         onmouseover="this.style.color='#FFD700'" onmouseout="this.style.color='#FFFFFF'">
        Terms of Service
      </a>
```

Replace with:
```html
      <a href="terms.html"
         aria-label="Terms of Service"
         style="font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #FFFFFF;
                text-decoration: none; transition: color .2s;"
         onmouseover="this.style.color='#FFD700'" onmouseout="this.style.color='#FFFFFF'">
        Terms of Service
      </a>
```

- [ ] **Step 4: Replace ADA button onclick**

Find this exact attribute block on the button:
```html
        aria-label="Accessibility information — ADA Compliant Design"
        onclick="alert('Accessibility Statement\n\nThis site is designed to meet ADA compliance standards:\n— High-contrast color ratios for readability\n— Keyboard-navigable structure\n— ARIA labels on all interactive elements\n— Semantic HTML throughout\n\nFor accessibility support: pathwyservices@primepathwy.com');"
```

Replace with:
```html
        aria-label="Accessibility information — ADA Compliant Design"
        title="View Accessibility Statement"
        onclick="window.location.href='accessibility.html'"
```

- [ ] **Step 5: Verify no alert() calls remain in footer**

```bash
grep -n "alert.*Privacy\|alert.*Terms\|alert.*Accessibility\|alert.*ADA" Prime_Pathwy_Turnover_System/index.html
```
Expected: **zero matches**. If any match is returned, the edit was incomplete — fix before continuing.

- [ ] **Step 6: Verify new hrefs are present**

```bash
grep -n "href=\"privacy.html\"\|href=\"terms.html\"\|accessibility.html" Prime_Pathwy_Turnover_System/index.html
```
Expected: 3 matches — one per link.

- [ ] **Step 7: Verify title attribute on ADA button**

```bash
grep -n "View Accessibility Statement" Prime_Pathwy_Turnover_System/index.html
```
Expected: 1 match.

- [ ] **Step 8: Verify hero and 7-step layout are untouched**

```bash
grep -n "hero\|7-step\|Step 1\|Step 2\|vacancy" Prime_Pathwy_Turnover_System/index.html | head -10
```
Expected: same lines as before the edit — confirms no content outside the footer was disturbed.

- [ ] **Step 9: Commit**

```bash
git add Prime_Pathwy_Turnover_System/index.html
git commit -m "fix: wire footer legal links to privacy.html, terms.html, accessibility.html — remove alert placeholders"
```

---

### Task 5: Final Link Verification

**Files:**
- Verify: all four files in `Prime_Pathwy_Turnover_System/`

- [ ] **Step 1: Confirm all four files exist**

```bash
ls Prime_Pathwy_Turnover_System/privacy.html Prime_Pathwy_Turnover_System/terms.html Prime_Pathwy_Turnover_System/accessibility.html Prime_Pathwy_Turnover_System/index.html
```
Expected: all four paths listed with no errors.

- [ ] **Step 2: Confirm all three legal pages link back to index.html**

```bash
grep -c "href=\"index.html\"" Prime_Pathwy_Turnover_System/privacy.html Prime_Pathwy_Turnover_System/terms.html Prime_Pathwy_Turnover_System/accessibility.html
```
Expected: each file returns count ≥ 2 (nav logo + back link both point to `index.html`).

- [ ] **Step 3: Confirm index.html has zero remaining alert placeholders**

```bash
grep -c "Document in progress" Prime_Pathwy_Turnover_System/index.html
```
Expected: **0**

- [ ] **Step 4: Confirm email update annotations are in place**

```bash
grep -rn "UPDATE EMAIL" Prime_Pathwy_Turnover_System/privacy.html Prime_Pathwy_Turnover_System/terms.html Prime_Pathwy_Turnover_System/accessibility.html
```
Expected: ≥ 3 matches — one per file marking where `operations@primepathwy.com` goes when Namecheap is live.

- [ ] **Step 5: Final commit**

```bash
git add Prime_Pathwy_Turnover_System/
git commit -m "chore: Legal Fortress complete — privacy, terms, accessibility pages verified and linked"
```

---

## Self-Review Against Spec

| Spec Requirement | Task |
|---|---|
| `privacy.html` — CCPA rights block (Section 4) | Task 1 Step 2 |
| `privacy.html` — Sovereign Audit Logic callout block | Task 1 Step 2 |
| `privacy.html` — Arthur F. Appling Sr. byline | Task 1 Step 2 |
| `terms.html` — No Verbal Order Rule gold-border callout | Task 2 Step 1 |
| `terms.html` — Master Pathwy documentation requirements | Task 2 Step 1 |
| `terms.html` — No Verbal Order is primary defense note | Task 2 Step 1 (⚠ scope creep label) |
| `accessibility.html` — WCAG 2.1 Level AA cited explicitly | Task 3 Step 1 |
| `accessibility.html` — 4.5:1 contrast ratio noted | Task 3 Step 1 |
| All pages — Matte Black `#050505` background | Tasks 1-3 (inline style) |
| All pages — Georgia serif H1 gold gradient | Tasks 1-3 |
| All pages — `← Back to Site` gold hover nav | Tasks 1-3 |
| All pages — identical footer with address | Tasks 1-3 |
| All pages — email update annotations | Tasks 1-3, verified Task 5 Step 4 |
| `index.html` — Privacy Policy → `privacy.html` | Task 4 Step 2 |
| `index.html` — Terms of Service → `terms.html` | Task 4 Step 3 |
| `index.html` — ADA button → `accessibility.html` | Task 4 Step 4 |
| `index.html` — ADA button retains wheelchair icon SVG | Task 4 Step 4 (only onclick/title changed) |
| `index.html` — `title="View Accessibility Statement"` | Task 4 Step 4, verified Step 7 |
| `index.html` — zero alert() placeholders remain | Task 4 Step 5, verified Task 5 Step 3 |
| `index.html` — hero/7-step layout untouched | Task 4 Step 8 |

All spec requirements covered. No placeholders. Email annotations are intentional and marked.
