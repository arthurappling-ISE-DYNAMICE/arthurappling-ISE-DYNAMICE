// ISE_Betting_Console/server.cjs
// Serves React dashboard + handles betting_log.json read/write
// Port 3132 — AA Betting Board — ISE Dynamics V5 Supreme

const http = require('http')
const fs   = require('fs')
const path = require('path')

const PORT       = 3132
const LOG_FILE   = path.join(__dirname, 'data', 'betting_log.json')
const VAULT_FILE = path.join(__dirname, '..', 'vault', 'engine', 'betting_algorithm', 'betting_log.json')
const PUBLIC     = path.join(__dirname, 'public')

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
}

// Seed data file if missing
if (!fs.existsSync(LOG_FILE)) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })
  fs.writeFileSync(LOG_FILE, JSON.stringify([
    {
      date: new Date().toISOString().slice(0,10),
      week: 1, unit: 100, type: '4-Leg', status: 'Ready',
      ss_avg: 92, wri_avg: 8, payout: 0, net_profit: 0,
      teams: Array.from({length:8}, (_,i) => ({
        slot: i+1,
        tier: i < 4 ? 'Foundation' : i < 6 ? 'Extension' : 'Risk',
        name: 'TBD', ss: 0, wri: 0, outcome: null, momentum: ''
      }))
    }
  ], null, 2))
}

function readLog() {
  try { return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) }
  catch { return [] }
}

function writeLog(data) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2))
}

function mirrorToVault(data) {
  try {
    fs.mkdirSync(path.dirname(VAULT_FILE), { recursive: true })
    fs.writeFileSync(VAULT_FILE, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('[VAULT MIRROR FAILED]', err.message)
  }
}

function writeBoth(data) {
  writeLog(data)
  mirrorToVault(data)
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // ── GET /api/log ────────────────────────────────────────────────────────────
  if (req.url === '/api/log' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(readLog()))
    return
  }

  // ── POST /api/log — append new week entry ───────────────────────────────────
  if (req.url === '/api/log' && req.method === 'POST') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const entry = JSON.parse(body)
        const log = readLog()
        log.push(entry)
        writeLog(log)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, index: log.length - 1 }))
      } catch {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  // ── PUT /api/log/:index — update entry (outcome, payout) ───────────────────
  const putMatch = req.url.match(/^\/api\/log\/(\d+)$/)
  if (putMatch && req.method === 'PUT') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const idx = parseInt(putMatch[1], 10)
        const updates = JSON.parse(body)
        const log = readLog()
        if (!log[idx]) { res.writeHead(404); res.end('Not found'); return }
        log[idx] = { ...log[idx], ...updates }
        writeBoth(log)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  // ── POST /api/sync — commit 3-tier week entry ──────────────────────────────
  if (req.url === '/api/sync' && req.method === 'POST') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const { week, date, tiers, preseason, ghost } = JSON.parse(body)
        const log = readLog()
        ;['4-Leg', '6-Leg', '8-Leg'].forEach(type => {
          const tier = tiers[type]
          if (!tier) return
          const entry = {
            date, week, unit: 100, type,
            status: 'Active',
            preseason: preseason || false,
            ghost_factors: ghost?.[type] || null,
            ticketId: tier.ticketId,
            ticketPayout: tier.payout,
            payout: 0, net_profit: 0,
            ss_avg: 0, wri_avg: 0,
            teams: Array.isArray(tier.teams) ? tier.teams : []
          }
          const idx = log.findIndex(e => e.week === week && e.type === type)
          if (idx >= 0) {
            log[idx] = { ...log[idx], ...entry }
          } else {
            log.push(entry)
          }
        })
        writeBoth(log)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  // ── Static files from public/ ───────────────────────────────────────────────
  let filePath = path.join(PUBLIC, req.url === '/' ? 'index.html' : req.url)
  if (!fs.existsSync(filePath)) filePath = path.join(PUBLIC, 'index.html')

  try {
    const ext  = path.extname(filePath)
    const mime = MIME[ext] || 'text/plain'
    res.writeHead(200, { 'Content-Type': mime })
    res.end(fs.readFileSync(filePath))
  } catch {
    res.writeHead(404); res.end('Not found')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  AA Betting Board — ISE Dynamics V5 Supreme')
  console.log(`  http://localhost:${PORT}`)
  console.log('  Sovereign Execution Engine · Prime Pathwy\n')

  // ── Vault sync verification ─────────────────────────────────────────────────
  try {
    const testData = readLog()
    mirrorToVault(testData)
    const vaultData = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'))
    if (JSON.stringify(testData) === JSON.stringify(vaultData)) {
      console.log('  [VAULT SYNC ✓] Both targets identical')
    } else {
      console.error('  [VAULT SYNC ✗] MISMATCH DETECTED')
    }
  } catch (err) {
    console.error('  [VAULT SYNC ✗]', err.message)
  }
})
