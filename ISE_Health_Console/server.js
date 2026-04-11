// ISE_Health_Console/server.js — JARVIS_ENGINE_V3 / TRI-VITALS V4
import http from 'http'
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const PORT       = 3131
const DATA_FILE  = path.join(__dirname, 'health_data.json')
const DIST_DIR   = __dirname

// ── Temporary dual-write paths ─────────────────────────────────────────────
const TEMP_DIR   = 'C:/Users/arthu/GeminiEcosystem/temporary'
const TEMP_JSON  = path.join(TEMP_DIR, 'health_data.json')
const TEMP_CSV   = path.join(TEMP_DIR, 'data.csv')

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
}

// ── Ensure temporary directory + seed files ────────────────────────────────
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}
if (!fs.existsSync(TEMP_CSV)) {
  fs.writeFileSync(TEMP_CSV, 'date,time,vital,value1,value2,notes\n')
}

// ── Initialise or migrate primary data file ────────────────────────────────
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    glucose:       [],
    bloodPressure: [],
    weightLog:     [],
    weight_goal:   185,
    glucose_target: 175,
    last_lab_a1c:  8.6,
    projected_a1c: 8.23,
    lastUpdated:   null
  }, null, 2))
} else {
  try {
    const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    let patched = false

    if (typeof d.weight === 'number' && !Array.isArray(d.weightLog)) {
      d.weightLog = [{ id: Date.now(), date: new Date().toISOString().slice(0,10), time: '00:00', value: d.weight, notes: 'Migrated' }]
      delete d.weight
      patched = true
    }
    if (!Array.isArray(d.weightLog))     { d.weightLog     = [];   patched = true }
    if (!Array.isArray(d.bloodPressure)) { d.bloodPressure = [];   patched = true }
    if (d.weight_goal    == null)        { d.weight_goal   = 185;  patched = true }
    if (d.glucose_target == null)        { d.glucose_target = 175; patched = true }

    if (patched) fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2))
  } catch { /* leave file as-is on parse error */ }
}

// ── CSV append helper ──────────────────────────────────────────────────────
function appendCSVRows(data) {
  // Read existing CSV to avoid duplicates — use lastUpdated as sentinel
  const existing = fs.existsSync(TEMP_CSV) ? fs.readFileSync(TEMP_CSV, 'utf8') : 'date,time,vital,value1,value2,notes\n'
  const lines = new Set(existing.split('\n').slice(1).filter(Boolean))

  const rows = []

  for (const g of (data.glucose || [])) {
    const row = `${g.date},${g.time},glucose,${g.value},,${(g.notes || '').replace(/,/g, ';')}`
    if (!lines.has(row)) rows.push(row)
  }
  for (const bp of (data.bloodPressure || [])) {
    const row = `${bp.date},${bp.time},bloodpressure,${bp.sys},${bp.dia},${(bp.notes || '').replace(/,/g, ';')}`
    if (!lines.has(row)) rows.push(row)
  }
  for (const w of (data.weightLog || [])) {
    const row = `${w.date},${w.time},weight,${w.value},,${(w.notes || '').replace(/,/g, ';')}`
    if (!lines.has(row)) rows.push(row)
  }

  if (rows.length > 0) {
    fs.appendFileSync(TEMP_CSV, rows.join('\n') + '\n')
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // GET /api/data
  if (req.url === '/api/data' && req.method === 'GET') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(fs.readFileSync(DATA_FILE, 'utf8'))
    } catch { res.writeHead(500); res.end('{}') }
    return
  }

  // POST /api/data
  if (req.url === '/api/data' && req.method === 'POST') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        parsed.lastUpdated = new Date().toISOString()
        if (!Array.isArray(parsed.weightLog))     parsed.weightLog     = []
        if (!Array.isArray(parsed.bloodPressure)) parsed.bloodPressure = []
        if (parsed.weight_goal    == null)        parsed.weight_goal   = 185
        if (parsed.glucose_target == null)        parsed.glucose_target = 175
        delete parsed.weight

        // Primary write
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2))

        // Dual-write → temporary/
        try {
          fs.writeFileSync(TEMP_JSON, JSON.stringify(parsed, null, 2))
          appendCSVRows(parsed)
        } catch (e) {
          console.error('[TEMP WRITE ERROR]', e.message)
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch { res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' })) }
    })
    return
  }

  // Static file serving
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)
  if (!fs.existsSync(filePath)) filePath = path.join(DIST_DIR, 'index.html')

  try {
    const mime = MIME[path.extname(filePath)] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': mime })
    res.end(fs.readFileSync(filePath))
  } catch { res.writeHead(404); res.end('Not found') }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ISE Health Console — JARVIS_ENGINE_V3 / TRI-VITALS V4`)
  console.log(`  http://localhost:${PORT}`)
  console.log(`  Glucose Target: 175 mg/dL · Weight Target: 207.0 lbs · Weight Goal: 185 lbs`)
  console.log(`  Dual-write: ${TEMP_JSON}`)
  console.log(`              ${TEMP_CSV}`)
  console.log('  Press Ctrl+C to stop.\n')
})
