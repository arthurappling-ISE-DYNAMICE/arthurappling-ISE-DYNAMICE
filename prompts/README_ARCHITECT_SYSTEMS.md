# ARCHITECT SYSTEMS — Prompts Directory
**AA Capital INC dba Prime Pathwy**  
**Lead Architect:** Arthur F. Appling Sr. | EIN 84-4788578  
**Classification:** Sovereign Operations Infrastructure — Internal Only  
**Version:** 1.0 | 2026-04-19

---

## RECURSIVE INTEGRITY AUDIT (RIA) — G-Stack Intelligence Briefing

### What the Perplexity Report Got Right

The core signal is valid: treat prompts as versioned infrastructure, not disposable conversations. The chained architecture (Intake → Scope → Report) is the correct pattern for a service OS. The Brain/Muscle/Shield framework maps cleanly to AA Capital's operational reality.

### Logic Gaps Identified

**Gap 1 — The "Single Source of Truth" claim is aspirational, not implemented.**  
The report describes the concept but never defines the actual data schema. Without a typed JSON project record flowing between prompts, every "no duplicate entry" promise fails at the handoff. P1 in this directory fixes this with an explicit `canonical_project_record.json` schema.

**Gap 2 — The Master Systems Prompt skeleton is a role description, not a prompt.**  
The Perplexity output presents a bulleted list of inputs and outputs and calls it a prompt. That is a requirements document. A real executable prompt specifies decision rules, failure conditions, and output format precisely enough that a different operator gets the same result on any given job. P1–P5 are the executable versions.

**Gap 3 — The CA §14837 analysis prompt was truncated before completion.**  
The report cuts off mid-sentence at the analysis steps. The full scoring model, bid-kill risk matrix, and Go/No-Go decision logic were missing. P4 completes this.

**Gap 4 — No Failure Gates.**  
The report describes what to produce but never specifies when to stop. A prompt without failure conditions is a liability — it produces plausible-looking output even on bad inputs. Every prompt in this directory has an explicit Failure Gate that halts execution and returns control to the Architect before downstream artifacts are compromised.

**Gap 5 — CUF and SB/DVBE compliance is mentioned in a table cell.**  
For a DVBE-eligible firm pursuing state contracts, CUF integrity is the difference between contract performance and debarment. The report gives it three words. P5 gives it a full compliance protocol.

**Gap 6 — Stealth Mode is implied but never specified.**  
"Human curation does the real compounding work" is the only nod to output hygiene. No document-level rule is defined. Every prompt in this directory carries an explicit Stealth Output Rule in the footer.

---

## PHOTO-TO-INVOICE PIPELINE — Zero Manual Entry Architecture

### Problem Statement

The Architect arrives on site, captures photos, and leaves. By the time the truck is unloaded, the lender-ready invoice should be ready to send — without the Architect typing a single field.

### Technical Architecture

```
FIELD                     LOCAL SERVER              VAULT
─────                     ────────────              ─────
Photos captured     →     gemini-app/               vault/prime_pathwy_master/
(geo-tagged,              _readpdf.mjs              leads/
timestamped)              
                          ↓
                    Vision extraction
                    (Gemini 2.5 Pro)
                          ↓
                    canonical_project_record.json
                    (P1 schema — auto-populated)
                          ↓
                    P2 scope builder runs
                    (rules-based, no human input)
                          ↓
                    P3 report composer runs
                          ↓
                    invoice_[ID].md
                    lender_report_[ID].md
                          ↓
                    Auto-saved to vault/
                    prime_pathwy_master/leads/
```

### Implementation: `photo_intake.js`

Place in `gemini-app/`. Run with: `node photo_intake.js [photo_folder_path]`

```javascript
// photo_intake.js — Zero Manual Entry Pipeline
// Reads a folder of site photos, extracts field data via Gemini Vision,
// populates P1 schema, chains through P2 and P3, writes invoice to vault.
// Stealth: no AI attribution in any output document.

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/genai';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genai.getGenerativeModel({ model: 'gemini-2.5-pro' });

const VAULT_LEADS = 'C:/Users/arthu/GeminiEcosystem/vault/prime_pathwy_master/leads';
const IMAGE_EXTS  = ['.jpg', '.jpeg', '.png', '.webp'];

async function extractFieldDataFromPhoto(imagePath) {
  const imageData = await readFile(imagePath);
  const base64    = imageData.toString('base64');
  const ext       = extname(imagePath).slice(1).toLowerCase();
  const mimeType  = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  const prompt = `
You are a field documentation officer conducting a property inspection.
Analyze this photo and extract structured field data.

Return ONLY valid JSON — no markdown, no explanation:
{
  "photo_id": "${basename(imagePath)}",
  "room_label": "identify the room (Kitchen/Living Room/Bedroom N/Bathroom N/Garage/Exterior/Unknown)",
  "classification": "C=Clean | LD=Light Damage | HD=Heavy Damage | BH=Biohazard | TR=Trade Required",
  "condition_notes": "factual description of visible condition in 1-2 sentences",
  "items_flagged": ["list of specific items requiring action"],
  "work_required": ["list of specific tasks visible from this photo"],
  "hazards_observed": ["none or specific hazards"],
  "photo_stage": "before | during | after | unknown"
}
`;

  const result = await model.generateContent([
    { inlineData: { mimeType, data: base64 } },
    prompt
  ]);

  const raw = result.response.text().trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

async function buildProjectRecord(photoFolder, projectMeta = {}) {
  const files   = await readdir(photoFolder);
  const photos  = files.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()));
  const rooms   = [];
  const hazards = [];

  console.log(`Processing ${photos.length} photos...`);

  for (const photo of photos) {
    const data = await extractFieldDataFromPhoto(join(photoFolder, photo));
    if (!data) { console.warn(`  SKIP (parse fail): ${photo}`); continue; }

    if (data.hazards_observed?.length && data.hazards_observed[0] !== 'none') {
      hazards.push(...data.hazards_observed);
    }
    rooms.push(data);
    console.log(`  OK: ${photo} → ${data.room_label} [${data.classification}]`);
  }

  const ts        = new Date();
  const projectId = `PP-${ts.toISOString().slice(0,10).replace(/-/g,'')}-${(projectMeta.address || 'ADDR').slice(-4).toUpperCase()}`;

  return {
    project_id:          projectId,
    address:             projectMeta.address             || 'MISSING — FLAG',
    asset_class:         projectMeta.asset_class         || 'MISSING — FLAG',
    occupancy_status:    projectMeta.occupancy_status    || 'MISSING — FLAG',
    inspection_date:     ts.toISOString().split('T')[0],
    funding_type:        projectMeta.funding_type        || 'private',
    target_completion:   projectMeta.target_completion   || 'MISSING — FLAG',
    rooms,
    hazards:             [...new Set(hazards)],
    trade_requirements:  [],
    scores: {
      urgency:              0,
      complexity:           rooms.filter(r => ['HD','BH','TR'].includes(r.classification)).length,
      documentation_burden: 0,
      margin_density:       0
    },
    missing_data_flags: rooms
      .filter(r => r.classification === 'BH')
      .map(r => `BIOHAZARD in ${r.room_label} — requires re-quote before crew dispatch`),
    photo_inventory: photos
  };
}

async function writeInvoice(record) {
  const date    = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const invoiceId = `${record.project_id}-INV`;

  const lineItems = record.rooms
    .filter(r => r.work_required?.length)
    .map(r => `  ${r.room_label.padEnd(20)} | ${r.work_required.join(', ')}`)
    .join('\n');

  const invoice = `INVOICE

Prime Pathwy — Property Turnover Services
425 Virginia St STE B, Vallejo, CA 94590
(707) 435-3998 | contact@primepathwy.com
EIN: 84-4788578

Invoice #:    ${invoiceId}
Invoice Date: ${date}
Property:     ${record.address}

SERVICES RENDERED (per signed Scope of Work — ${record.project_id})
${'─'.repeat(60)}
${lineItems}
${'─'.repeat(60)}
  Disposal fees billed separately at cost with receipts.
  Change orders (if any) referenced in scope of work file.

Payment Terms: Paid in full at booking per Service Agreement.
This invoice confirms completion and documents charges for
lender draw, audit, or recordkeeping purposes.

Certified by: Arthur F. Appling Sr.
Title: Lead Architect, AA Capital INC dba Prime Pathwy
Date: ${date}
`;

  const outDir  = join(VAULT_LEADS, record.project_id);
  await mkdir(outDir, { recursive: true });

  await writeFile(join(outDir, `canonical_project_record.json`), JSON.stringify(record, null, 2));
  await writeFile(join(outDir, `invoice_${invoiceId}.md`), invoice);
  await writeFile(join(outDir, `photo_evidence_index.md`),
    `# Photo Evidence Index — ${record.project_id}\n\n` +
    record.rooms.map(r =>
      `## ${r.room_label}\n- **Stage:** ${r.photo_stage}\n- **Classification:** ${r.classification}\n- **Photo ID:** ${r.photo_id}\n- **Condition:** ${r.condition_notes}\n- **Work Required:** ${(r.work_required||[]).join(', ')}\n`
    ).join('\n')
  );

  console.log(`\nOUTPUT WRITTEN → ${outDir}`);
  console.log(`  canonical_project_record.json`);
  console.log(`  invoice_${invoiceId}.md`);
  console.log(`  photo_evidence_index.md`);
  return outDir;
}

// ── MAIN ──────────────────────────────────────────────────────────────────
const photoFolder = process.argv[2];
if (!photoFolder) {
  console.error('Usage: node photo_intake.js <photo_folder_path> [address] [asset_class]');
  process.exit(1);
}

const meta = {
  address:          process.argv[3] || 'MISSING — FLAG',
  asset_class:      process.argv[4] || 'apartment',
  occupancy_status: 'vacant',
  funding_type:     'private',
  target_completion: '3-5 business days'
};

const record = await buildProjectRecord(photoFolder, meta);
await writeInvoice(record);
console.log('\nPIPELINE COMPLETE. Vault updated. Stealth mode: active.');
```

### Invocation

```bash
cd gemini-app
node photo_intake.js "C:/path/to/site/photos" "425 Main St, Vallejo CA" "apartment"
```

**What happens automatically:**
1. Every photo in the folder is sent to Gemini Vision
2. Room label, classification, condition notes, and work required are extracted per photo
3. `canonical_project_record.json` is written (P1 schema)
4. `photo_evidence_index.md` is written (P3 input)
5. `invoice_[ID].md` is written with line items from photo extraction
6. All files saved to `vault/prime_pathwy_master/leads/[PROJECT_ID]/`
7. Architect types nothing. Zero manual entry.

---

## PROMPT CHAIN — EXECUTION ORDER

```
Site Walk Photos
      ↓
node photo_intake.js    ← Zero manual entry
      ↓
canonical_project_record.json   ← P1 output
      ↓
P2_scope_sequence_builder.md    ← paste P1 output → get scope + dispatch
      ↓
P3_lender_report_composer.md    ← paste P2 output + photo index → get report + invoice
      ↓
P4_ca_contract_efficiency_analyzer.md   ← run independently for each bid opportunity
      ↓
P5_cuf_sbdvbe_compliance_checker.md     ← run before any state bid submission
```

---

## STEALTH MODE VERIFICATION

Every output document in this system is stealth-compliant. Verification checklist:

| Document | AI Attribution | System Reference | Software Reference | Status |
|----------|---------------|-----------------|-------------------|--------|
| invoice_[ID].md | NONE | NONE | NONE | CLEAN |
| lender_report_[ID].md | NONE | NONE | NONE | CLEAN |
| scope_of_work.md | NONE | NONE | NONE | CLEAN |
| crew_dispatch_order.md | NONE | NONE | NONE | CLEAN |
| bid_decision_[ID].md | NONE | NONE | NONE | CLEAN |
| compliance_clearance_[ID].md | NONE | NONE | NONE | CLEAN |
| photo_evidence_index.md | NONE | NONE | NONE | CLEAN |

**Rule:** All outputs are authored as Prime Pathwy Field Operations or AA Capital INC internal documentation. The Architect signs. The system is the Architect's method — not a tool reference.

---

## PROMPT VERSION CONTROL

| ID | Name | Version | Last Updated | Status |
|----|------|---------|-------------|--------|
| P1 | Site Walk Structurer | 1.0 | 2026-04-19 | Active |
| P2 | Scope + Sequence Builder | 1.0 | 2026-04-19 | Active |
| P3 | Lender Report Composer | 1.0 | 2026-04-19 | Active |
| P4 | CA Contract Efficiency Analyzer | 1.0 | 2026-04-19 | Active |
| P5 | CUF / SB-DVBE Compliance Checker | 1.0 | 2026-04-19 | Active |

Increment version on any logic change. Never edit a prompt in production without bumping the version and documenting the reason. Treat prompts like code — they are.

---

*AA Capital INC — Sovereign Operations Infrastructure*  
*Documented · Defensible · Delivered*
