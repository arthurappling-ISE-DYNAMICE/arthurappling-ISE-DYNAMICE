// app.js — Strategic Analytics Dashboard V2
// Port 3132 | AA Capital INC dba Prime Pathwy
// MYTHOS_ENGINE v1.0 ACTIVE

import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname   = dirname(fileURLToPath(import.meta.url))
const PORT        = 3132
const HISTORY     = join(__dirname, 'bet_history.json')
const CANONICAL   = join(__dirname, 'Canonical_Bet_History.json')
const MYTHOS      = 'C:/Users/arthu/GeminiEcosystem/prompts/MYTHOS_ENGINE.md'
const PUBLIC      = join(__dirname, 'public')

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
}

function readJSON(file, fallback) {
  try { return JSON.parse(readFileSync(file, 'utf8')) }
  catch { return fallback }
}

function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}

if (!existsSync(PUBLIC)) mkdirSync(PUBLIC, { recursive: true })

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let b = ''
    req.on('data', c => b += c)
    req.on('end', () => { try { resolve(JSON.parse(b)) } catch(e) { reject(e) } })
  })
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // ── GET /api/history — full week state ─────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/history') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(readJSON(HISTORY, { currentWeek:1, weeks:{} })))
    return
  }

  // ── POST /api/save — persist full state ────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/save') {
    try {
      const data = await parseBody(req)
      writeJSON(HISTORY, data)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    } catch (err) {
      res.writeHead(400); res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // ── POST /api/log-bet — append to Canonical_Bet_History.json ───────────────
  if (req.method === 'POST' && req.url === '/api/log-bet') {
    try {
      const entry = await parseBody(req)
      entry.timestamp = new Date().toISOString()
      const log = readJSON(CANONICAL, [])
      log.unshift(entry)
      writeJSON(CANONICAL, log)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    } catch (err) {
      res.writeHead(400); res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // ── POST /api/postmortem — append to MYTHOS_ENGINE.md ──────────────────────
  if (req.method === 'POST' && req.url === '/api/postmortem') {
    try {
      const { week, ticketType, legIndex, team, odds, note, timestamp } = await parseBody(req)
      const block = [
        '', '---',
        `## LOSS POST-MORTEM — Week ${week} · ${ticketType} · Leg ${legIndex + 1}`,
        `**Timestamp:** ${timestamp}`,
        `**Team:** ${team || '(unnamed)'}`,
        `**Odds:** ${odds || '—'}`,
        `**Analysis:**`,
        note, ''
      ].join('\n')
      appendFileSync(MYTHOS, block, 'utf8')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    } catch (err) {
      res.writeHead(400); res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // ── Static files ────────────────────────────────────────────────────────────
  let fp = join(PUBLIC, req.url === '/' ? 'dashboard.html' : req.url)
  if (!existsSync(fp)) fp = join(PUBLIC, 'dashboard.html')
  try {
    const mime = MIME[extname(fp)] || 'text/plain'
    res.writeHead(200, { 'Content-Type': mime })
    res.end(readFileSync(fp))
  } catch { res.writeHead(404); res.end('Not found') }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  ╔════════════════════════════════════════════╗')
  console.log('  ║  Strategic Analytics Dashboard V2          ║')
  console.log('  ║  AA Capital INC dba Prime Pathwy           ║')
  console.log(`  ║  http://localhost:${PORT}                    ║`)
  console.log('  ║  MYTHOS_ENGINE v1.0 · 3-Tier Parlay Mode  ║')
  console.log('  ╚════════════════════════════════════════════╝\n')
})
