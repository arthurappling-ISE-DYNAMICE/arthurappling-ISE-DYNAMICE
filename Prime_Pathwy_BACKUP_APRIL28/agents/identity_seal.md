---
name: Prime Pathwy Turnover System — Identity Seal
type: identity
version: 2.0
sealed: 2026-04-13
---

# IDENTITY SEAL — Prime Pathwy Turnover System

## Entity

| Field               | Value                                  |
|---------------------|----------------------------------------|
| Legal Name          | AA Capital INC dba Prime Pathwy        |
| EIN                 | 84-4788578                             |
| DUNS                | 12-3035654                             |
| Architect           | Arthur F. Appling Sr.                  |
| Address             | Vallejo, CA 94590                      |

## Contact — Verified & Mobile-Synced

| Channel             | Address                                |
|---------------------|----------------------------------------|
| **Primary Email**   | contact@primepathwy.com                |
| Web                 | www.primepathwy.com                    |
| SMTP Host           | mail.privateemail.com                  |
| SMTP Port           | 587 (STARTTLS)                         |

> Previous routing address `pathwyservices@primepathwy.com` is **retired** as of 2026-04-13.
> All form submissions, mailto: links, and displayed contact text now route to `contact@primepathwy.com`.

## Brand

| Element             | Value                                  |
|---------------------|----------------------------------------|
| Aesthetic           | Matte Black & Gold · Institutional     |
| Background          | #050505 / #0A0A0A / #0D0D0D            |
| Gold Primary        | #C9A84C                                |
| Gold Bright         | #FFD700                                |
| Typography          | Georgia serif (headings) + Courier New |
| Corner Style        | Sharp — zero border-radius             |

## Services

- Full Property Turnover (Labor Only)
- Eviction Clean-Outs
- Haul-Out / Debris Removal
- Interior Paint

## Contact Form Architecture

```
index.html  →  POST /api/send-quote  →  server.js  →  SMTP (mail.privateemail.com)  →  contact@primepathwy.com
```

Fallback: if server is unreachable, form opens local email client via `mailto:contact@primepathwy.com`.

## Files

| File                | Role                                   |
|---------------------|----------------------------------------|
| index.html          | Full-site SPA (static)                 |
| server.js           | Express API + static file server       |
| .env                | SMTP credentials (not committed)       |
| .env.example        | Credential template                    |
| package.json        | Node.js manifest (ESM)                 |
| Turnover_System_Skill.md | Claude skill — content generation |

## Activation Command

```bash
cd Prime_Pathwy_Turnover_System
cp .env.example .env
# fill SMTP_PASS in .env
npm install
npm start
# → http://localhost:3000
```
