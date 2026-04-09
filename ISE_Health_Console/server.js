// ISE_Health_Console/server.js — ESM
import http from 'http'
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT      = 3131
const DATA_FILE = path.join(__dirname, 'health_data.json')
const DIST_DIR  = __dirname

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(
    { glucose: [], bloodPressure: [], last_lab_a1c: 8.6, projected_a1c: 8.23, lastUpdated: null },
    null, 2
  ))
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.url === '/api/data' && req.method === 'GET') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(fs.readFileSync(DATA_FILE, 'utf8'))
    } catch { res.writeHead(500); res.end('{}') }
    return
  }

  if (req.url === '/api/data' && req.method === 'POST') {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        parsed.lastUpdated = new Date().toISOString()
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2))
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch { res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' })) }
    })
    return
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)
  if (!fs.existsSync(filePath)) filePath = path.join(DIST_DIR, 'index.html')

  try {
    const mime = MIME[path.extname(filePath)] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': mime })
    res.end(fs.readFileSync(filePath))
  } catch { res.writeHead(404); res.end('Not found') }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ISE Health Console — http://localhost:${PORT}`)
  console.log('  Press Ctrl+C to stop.\n')
})
