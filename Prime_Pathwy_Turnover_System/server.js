/**
 * Prime Pathwy Turnover System — Contact API
 * Serves the static site + handles /api/send-quote via SMTP (mail.privateemail.com)
 *
 * Start: node server.js
 * Env:   see .env (copy .env.example → .env, fill SMTP_PASS)
 */

import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3000;

const VAULT_LEADS = 'C:/Users/arthu/GeminiEcosystem/vault/prime_pathwy_master/leads';

async function writeLeadToVault(payload) {
  const ts  = new Date();
  const stamp = ts.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const name  = (payload.name || 'Unknown').replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '_') || 'Lead';
  const filename = `${stamp}_${name}.json`;
  const lead = { ...payload, logged_at: ts.toISOString() };
  await mkdir(VAULT_LEADS, { recursive: true });
  await writeFile(join(VAULT_LEADS, filename), JSON.stringify(lead, null, 2), 'utf8');
  console.log(`[vault] Lead saved → ${filename}`);
}

/* ── SMTP transporter — Namecheap Private Email ─────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   'mail.privateemail.com',
  port:   587,
  secure: false,          // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: true },
});

/* ── Middleware ──────────────────────────────────────────────────────────── */
app.use(express.json());
app.use(express.static(__dirname));   // serve index.html, assets, etc.

/* ── POST /api/send-quote ────────────────────────────────────────────────── */
app.post('/api/send-quote', async (req, res) => {
  const { subject, body, replyTo } = req.body || {};

  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing subject or body' });
  }

  const mailOptions = {
    from:    `"Prime Pathwy Intake" <${process.env.SMTP_USER}>`,
    to:      process.env.SMTP_USER,   // contact@primepathwy.com receives it
    subject: subject,
    text:    body,
    ...(replyTo ? { replyTo } : {}),  // reply goes to the client if they left an email
  };

  // Vault lead log — non-blocking, never fails the response
  writeLeadToVault(req.body).catch(err =>
    console.error('[vault] Lead write failed:', err.message)
  );

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error('[send-quote] SMTP error:', err.message);
    res.status(500).json({ error: 'Mail delivery failed' });
  }
});

/* ── Start ───────────────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`Prime Pathwy Turnover System running → http://localhost:${PORT}`);
});
