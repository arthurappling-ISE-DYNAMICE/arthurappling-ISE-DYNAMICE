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
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3000;

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
