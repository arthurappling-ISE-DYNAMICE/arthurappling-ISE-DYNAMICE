# Prime Pathwy Sovereign System Landing Page — Implementation Plan

> **RENAME NOTICE (2026-04-12):** The directory `Prime_Pathwy_Website/` was renamed to `Prime_Pathwy_Consulting_Wing/` for strategic clarity. All path references below using `Prime_Pathwy_Website/` are historical — the live directory is now `Prime_Pathwy_Consulting_Wing/`. This plan is an archived build record; do not re-execute.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Prime Pathwy Sovereign System landing page — a Next.js hybrid marketing + Stripe order site in Matte Black and Gold, serving property owners who need institutional-grade turnover services.

**Architecture:** Single Next.js App Router page composed of 8 sequential section components. Marketing sections (00–05) build authority before the Stripe-embedded order form (Section 06). A server-side API route creates Payment Intents; a webhook route handles post-payment logging. All pricing logic is isolated in a pure function so it can be unit tested.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS v3, @stripe/stripe-js, @stripe/react-stripe-js, stripe (server SDK), Vitest for unit tests, Vercel deployment.

---

## File Map

| File | Responsibility |
|---|---|
| `src/app/layout.tsx` | Root layout — metadata, fonts, body background |
| `src/app/page.tsx` | Assembles all section components in order |
| `src/app/globals.css` | Tailwind directives + CSS custom properties |
| `src/app/api/create-payment-intent/route.ts` | Server: creates Stripe Payment Intent |
| `src/app/api/stripe-webhook/route.ts` | Server: handles Stripe webhook events |
| `src/components/Nav.tsx` | Sticky navigation bar with anchor links |
| `src/components/HeroSection.tsx` | Section 00 — full-viewport hero |
| `src/components/SystemSection.tsx` | Section 01 — 3-card system differentiators |
| `src/components/LifecycleSection.tsx` | Section 02 — 7-step timeline |
| `src/components/DocumentationSection.tsx` | Section 03 — pull-quote + 3 pillars |
| `src/components/PricingSection.tsx` | Section 04 — two pricing tables |
| `src/components/AgreementSection.tsx` | Section 05 — plain-language terms |
| `src/components/OrderSection.tsx` | Section 06 — wrapper with eyebrow/headline |
| `src/components/OrderForm.tsx` | Multi-step form state (Steps 1–4) |
| `src/components/StripePaymentStep.tsx` | Step 5 — Stripe Elements payment form |
| `src/components/ConfirmationModal.tsx` | Post-payment success overlay |
| `src/components/Footer.tsx` | Footer with declaration + copyright |
| `src/lib/pricing.ts` | Pure functions: calculatePrice, getUnitSizes |
| `src/lib/stripe.ts` | Stripe client init (server + client) |
| `src/types/order.ts` | TypeScript types for all order state |
| `src/lib/pricing.test.ts` | Unit tests for pricing logic |
| `tailwind.config.ts` | Matte Black/Gold color tokens + font families |
| `public/logo.png` | Medallion seal logo |
| `.env.local` | STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET |
| `vercel.json` | Vercel deployment config |

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `Prime_Pathwy_Website/` (scaffold entire Next.js project)

- [ ] **Step 1: Scaffold the project**

Run from `C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website/`:

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --yes
```

Expected output: `Success! Created project at ...Prime_Pathwy_Website`

- [ ] **Step 2: Install Stripe dependencies**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

Expected output: `added N packages` with no errors.

- [ ] **Step 3: Install Vitest for unit tests**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm install -D vitest @vitest/coverage-v8
```

- [ ] **Step 4: Add vitest config to package.json**

Open `Prime_Pathwy_Website/package.json`. Add a `"test"` script and `"vitest"` config. The file will look like this after edits (merge with existing scripts — do not replace the whole file):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Also add a `vitest.config.ts` file at `Prime_Pathwy_Website/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: Verify dev server starts**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Expected: `Ready in Xs` on `http://localhost:3000`. Open browser — default Next.js page visible. Kill server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/ && git commit -m "$(cat <<'EOF'
feat: initialize Next.js project for Prime Pathwy website

Next.js 14 App Router + TypeScript + Tailwind + Stripe dependencies.
Vitest configured for unit testing.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Configure Tailwind Theme + Global Styles

**Files:**
- Modify: `Prime_Pathwy_Website/tailwind.config.ts`
- Modify: `Prime_Pathwy_Website/src/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
// Prime_Pathwy_Website/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0A0A0A',
        'bg-surface': '#0D0D0D',
        'bg-elevated': '#111111',
        gold: '#C9A84C',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace globals.css**

```css
/* Prime_Pathwy_Website/src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #0A0A0A;
  --bg-surface: #0D0D0D;
  --bg-elevated: #111111;
  --gold: #C9A84C;
  --gold-dim: rgba(201, 168, 76, 0.4);
  --gold-faint: rgba(201, 168, 76, 0.13);
  --text-primary: #F0ECE0;
  --text-secondary: #888888;
  --text-muted: #555555;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0A0A0A;
  color: #888888;
}
```

- [ ] **Step 3: Verify Tailwind compiles**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run build 2>&1 | tail -5
```

Expected: `✓ Compiled successfully` or `Route (app)` table output. No errors.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/tailwind.config.ts Prime_Pathwy_Website/src/app/globals.css && git commit -m "$(cat <<'EOF'
feat: configure Matte Black and Gold Tailwind theme

Color tokens, Georgia serif + Courier New mono font families,
CSS custom properties for all brand colors.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Pricing Logic (TDD)

**Files:**
- Create: `Prime_Pathwy_Website/src/lib/pricing.ts`
- Create: `Prime_Pathwy_Website/src/lib/pricing.test.ts`

- [ ] **Step 1: Write the failing tests first**

```ts
// Prime_Pathwy_Website/src/lib/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { calculatePrice, getUnitSizes } from './pricing'

describe('calculatePrice — apartments', () => {
  it('studio-1br: $1,200 – $1,600', () => {
    const r = calculatePrice('apartment', 'studio-1br')
    expect(r).not.toBeNull()
    expect(r!.priceRange).toEqual({ min: 1200, max: 1600 })
    expect(r!.displayPrice).toBe('$1,200 – $1,600')
    expect(r!.unitLabel).toBe('Studio / 1 Bedroom')
  })

  it('2br: $1,500 – $2,000', () => {
    const r = calculatePrice('apartment', '2br')
    expect(r!.priceRange).toEqual({ min: 1500, max: 2000 })
  })

  it('3br: $1,800 – $2,400', () => {
    const r = calculatePrice('apartment', '3br')
    expect(r!.priceRange).toEqual({ min: 1800, max: 2400 })
  })

  it('invalid size returns null', () => {
    expect(calculatePrice('apartment', '4br' as any)).toBeNull()
  })
})

describe('calculatePrice — single-family', () => {
  it('2br: $1,600 – $2,100', () => {
    const r = calculatePrice('single-family', '2br')
    expect(r!.priceRange).toEqual({ min: 1600, max: 2100 })
  })

  it('3br: $1,900 – $2,600', () => {
    const r = calculatePrice('single-family', '3br')
    expect(r!.priceRange).toEqual({ min: 1900, max: 2600 })
  })

  it('4br: $2,300 – $3,000', () => {
    const r = calculatePrice('single-family', '4br')
    expect(r!.priceRange).toEqual({ min: 2300, max: 3000 })
  })

  it('invalid size returns null', () => {
    expect(calculatePrice('single-family', 'studio-1br' as any)).toBeNull()
  })
})

describe('getUnitSizes', () => {
  it('apartment returns 3 options starting with studio-1br', () => {
    const sizes = getUnitSizes('apartment')
    expect(sizes).toHaveLength(3)
    expect(sizes[0].value).toBe('studio-1br')
    expect(sizes[0].label).toContain('$1,200')
  })

  it('single-family returns 3 options ending with 4br', () => {
    const sizes = getUnitSizes('single-family')
    expect(sizes).toHaveLength(3)
    expect(sizes[2].value).toBe('4br')
    expect(sizes[2].label).toContain('$2,300')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm test 2>&1
```

Expected: `FAIL` — `Cannot find module './pricing'`

- [ ] **Step 3: Implement pricing.ts**

```ts
// Prime_Pathwy_Website/src/lib/pricing.ts
import type { PropertyType, UnitSize, PriceRange, PriceCalculation } from '@/types/order'

const APARTMENT_PRICES: Partial<Record<UnitSize, PriceRange>> = {
  'studio-1br': { min: 1200, max: 1600 },
  '2br': { min: 1500, max: 2000 },
  '3br': { min: 1800, max: 2400 },
}

const HOME_PRICES: Partial<Record<UnitSize, PriceRange>> = {
  '2br': { min: 1600, max: 2100 },
  '3br': { min: 1900, max: 2600 },
  '4br': { min: 2300, max: 3000 },
}

const UNIT_LABELS: Partial<Record<UnitSize, string>> = {
  'studio-1br': 'Studio / 1 Bedroom',
  '2br': '2 Bedroom',
  '3br': '3 Bedroom',
  '4br': '4 Bedroom',
}

export function calculatePrice(
  propertyType: PropertyType,
  unitSize: UnitSize
): PriceCalculation | null {
  const table = propertyType === 'apartment' ? APARTMENT_PRICES : HOME_PRICES
  const range = table[unitSize]
  if (!range) return null
  return {
    unitLabel: UNIT_LABELS[unitSize] ?? unitSize,
    priceRange: range,
    displayPrice: `$${range.min.toLocaleString()} – $${range.max.toLocaleString()}`,
  }
}

export function getUnitSizes(
  propertyType: PropertyType
): { value: UnitSize; label: string }[] {
  if (propertyType === 'apartment') {
    return [
      { value: 'studio-1br', label: 'Studio / 1 Bedroom ($1,200 – $1,600)' },
      { value: '2br', label: '2 Bedroom ($1,500 – $2,000)' },
      { value: '3br', label: '3 Bedroom ($1,800 – $2,400)' },
    ]
  }
  return [
    { value: '2br', label: '2 Bedroom ($1,600 – $2,100)' },
    { value: '3br', label: '3 Bedroom ($1,900 – $2,600)' },
    { value: '4br', label: '4 Bedroom ($2,300 – $3,000)' },
  ]
}
```

Note: This imports from `@/types/order` — create that file first (Task 4 Step 1), then re-run tests.

- [ ] **Step 4: Create types/order.ts (needed for pricing.ts to compile)**

```ts
// Prime_Pathwy_Website/src/types/order.ts
export type PropertyType = 'apartment' | 'single-family'
export type UnitSize = 'studio-1br' | '2br' | '3br' | '4br'

export interface PriceRange {
  min: number
  max: number
}

export interface PriceCalculation {
  unitLabel: string
  priceRange: PriceRange
  displayPrice: string
}

export interface OrderAddons {
  disposal: boolean
  extremeConditions: boolean
}

export interface ServiceDetails {
  address: string
  preferredDate: string
  accessMethod: 'keys' | 'lockbox' | 'codes' | ''
}

export type OrderStep = 1 | 2 | 3 | 4 | 5

export interface OrderFormState {
  step: OrderStep
  propertyType: PropertyType | null
  unitSize: UnitSize | null
  addons: OrderAddons
  serviceDetails: ServiceDetails
  agreementAccepted: boolean
}
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm test 2>&1
```

Expected:
```
 ✓ src/lib/pricing.test.ts (11)
   ✓ calculatePrice — apartments (4)
   ✓ calculatePrice — single-family (4)
   ✓ getUnitSizes (2)

 Test Files  1 passed (1)
 Tests       11 passed (11)
```

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: add pricing logic with full test coverage

calculatePrice and getUnitSizes pure functions cover all pricing
from the Master Merged 2026 spec. OrderFormState types defined.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Stripe Lib + Logo

**Files:**
- Create: `Prime_Pathwy_Website/src/lib/stripe.ts`
- Create: `Prime_Pathwy_Website/public/logo.png` (copy from gemini-app)
- Create: `Prime_Pathwy_Website/.env.local`

- [ ] **Step 1: Create Stripe lib**

```ts
// Prime_Pathwy_Website/src/lib/stripe.ts
import Stripe from 'stripe'
import { loadStripe, type Stripe as StripeClient } from '@stripe/stripe-js'

// Server-side singleton — used only in API routes (Node.js runtime)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Client-side singleton — safe to call from React components
let stripePromise: Promise<StripeClient | null>

export function getStripe(): Promise<StripeClient | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}
```

- [ ] **Step 2: Copy logo to public/**

```bash
cp "C:/Users/arthu/GeminiEcosystem/gemini-app/Gemini_Generated_Image_ (1).png" \
   "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website/public/logo.png"
```

Expected: No output. Verify with:
```bash
ls "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website/public/"
```
Expected: `favicon.ico  logo.png`

- [ ] **Step 3: Create .env.local with placeholder values**

```bash
cat > "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website/.env.local" << 'EOF'
# Stripe — replace with real keys from dashboard.stripe.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_WITH_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_KEY
EOF
```

- [ ] **Step 4: Verify .env.local is gitignored**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && cat .gitignore | grep env
```

Expected: `.env*.local` appears in output. If not, add it:
```bash
echo ".env*.local" >> .gitignore
```

- [ ] **Step 5: Commit (without .env.local)**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/lib/stripe.ts Prime_Pathwy_Website/public/logo.png && git commit -m "$(cat <<'EOF'
feat: add Stripe lib init and medallion seal logo

Server and client Stripe singletons. Logo copied to public/.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Root Layout + page.tsx

**Files:**
- Modify: `Prime_Pathwy_Website/src/app/layout.tsx`
- Create: `Prime_Pathwy_Website/src/app/page.tsx` (replace default)

- [ ] **Step 1: Write layout.tsx**

```tsx
// Prime_Pathwy_Website/src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prime Pathwy Property Turnover — Sovereign System',
  description:
    'Documented. Defensible. Done. Institutional-grade property turnover services. Scope locked before work begins. Every job archived.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-[#888888] antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Write page.tsx (stub — imports components not yet created)**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
export default function Home() {
  return (
    <main>
      <p className="font-mono text-[#C9A84C] p-8">
        Prime Pathwy — Sovereign System loading...
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Open `http://localhost:3000`. Expected: Black background, gold monospace text "Prime Pathwy — Sovereign System loading...". Kill with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/app/ && git commit -m "$(cat <<'EOF'
feat: root layout and page stub with Matte Black theme

Metadata, body background, stub page confirms theme is working.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Nav Component

**Files:**
- Create: `Prime_Pathwy_Website/src/components/Nav.tsx`

- [ ] **Step 1: Write Nav.tsx**

```tsx
// Prime_Pathwy_Website/src/components/Nav.tsx
import Image from 'next/image'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A] border-b border-[#C9A84C] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Prime Pathwy Seal"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="font-serif text-[#C9A84C] text-lg tracking-wide">
          PRIME PATHWY
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        {[
          { href: '#system', label: 'System' },
          { href: '#lifecycle', label: 'Lifecycle' },
          { href: '#documentation', label: 'Documentation' },
          { href: '#pricing', label: 'Pricing' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-mono text-xs text-[#888] hover:text-[#C9A84C] tracking-widest uppercase transition-colors"
          >
            {label}
          </a>
        ))}
        <a
          href="#order"
          className="font-mono text-xs text-[#C9A84C] border border-[#C9A84C] px-4 py-2 tracking-widest uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
        >
          Place Order
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Add Nav to page.tsx and verify**

Replace `Prime_Pathwy_Website/src/app/page.tsx`:

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center pt-14">
        <p className="font-mono text-[#C9A84C]">Sections loading...</p>
      </div>
    </main>
  )
}
```

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Open `http://localhost:3000`. Expected: Sticky black nav with gold seal logo, "PRIME PATHWY" wordmark, anchor links, and gold-bordered "Place Order" button on the right. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: sticky Nav with logo, anchor links, Place Order CTA

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: HeroSection (Section 00)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/HeroSection.tsx`

- [ ] **Step 1: Write HeroSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/HeroSection.tsx
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 pt-14 text-center">
      <Image
        src="/logo.png"
        alt="Prime Pathwy Seal"
        width={200}
        height={200}
        className="rounded-full mb-8"
        priority
      />
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-[rgba(201,168,76,0.6)] mb-6">
        Prime Pathwy Property Turnover
      </p>
      <h1 className="font-serif text-[32px] md:text-[48px] text-[#F0ECE0] leading-tight mb-6 max-w-2xl italic">
        Your Last Turnover Vendor Left No Record.
        <br />
        We Leave No Doubt.
      </h1>
      <p className="font-mono text-sm text-[#555] max-w-xl leading-relaxed mb-10">
        Every order is timestamped, photographed, verified, and archived.
        This is not a cleaning service. This is a system.
      </p>
      <a
        href="#order"
        className="font-mono text-xs tracking-[0.25em] uppercase text-[#C9A84C] border border-[#C9A84C] px-8 py-4 hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
      >
        Place Your Order →
      </a>
    </section>
  )
}
```

- [ ] **Step 2: Add HeroSection to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
    </main>
  )
}
```

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Open `http://localhost:3000`. Expected: Full-viewport matte black section. Medallion seal logo (200px) centered. Italic serif headline "Your Last Turnover Vendor Left No Record. / We Leave No Doubt." in warm white. Gold "PLACE YOUR ORDER →" button. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: HeroSection — No Doubt headline, full-viewport matte black

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: SystemSection (Section 01)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/SystemSection.tsx`

- [ ] **Step 1: Write SystemSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/SystemSection.tsx
const cards = [
  {
    label: 'Scope Locked Before Work Begins',
    body: 'No verbal approvals. Scope is defined by the order record and cannot change without a written change order.',
  },
  {
    label: 'Every Job Documented',
    body: 'Before, during, and after photos. Receipts. Timestamps. Archived 18–24 months minimum.',
  },
  {
    label: 'Chargeback-Defensible by Design',
    body: 'Order record, agreement acceptance log, photo set, and payment receipt — all on file before work begins.',
  },
]

export default function SystemSection() {
  return (
    <section id="system" className="bg-[#0A0A0A] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 01 — The System
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12 max-w-2xl">
        What You&apos;re Hiring Is a System, Not a Crew
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#0D0D0D] border border-[#1E1E1E] p-6 hover:border-[rgba(201,168,76,0.4)] hover:bg-[#111] transition-colors"
          >
            <p className="font-mono text-xs text-[#C9A84C] tracking-wide mb-3 uppercase">
              {card.label}
            </p>
            <p className="font-mono text-sm text-[#888] leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
    </main>
  )
}
```

Open `http://localhost:3000`. Expected: Scroll below hero — three dark cards appear with gold labels "Scope Locked", "Every Job Documented", "Chargeback-Defensible". Cards brighten on hover. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: SystemSection — 3-card authority differentiators

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: LifecycleSection (Section 02)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/LifecycleSection.tsx`

- [ ] **Step 1: Write LifecycleSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/LifecycleSection.tsx
const steps = [
  { num: '01', label: 'Select Services', note: 'Property type + unit size', highlight: false },
  { num: '02', label: 'Review Pricing', note: 'Labor shown; disposal billed separately', highlight: false },
  { num: '03', label: 'Accept Agreements', note: 'Click-wrap — scope, payment, verification', highlight: false },
  { num: '04', label: 'Submit Payment', note: 'Captured and timestamped', highlight: false },
  {
    num: '05',
    label: 'Verification Gate',
    note: 'Identity + authority verified before scheduling ($1,000+)',
    highlight: true,
  },
  { num: '06', label: 'Work Performed', note: 'Before/during/after photos taken', highlight: false },
  { num: '07', label: 'Completion & Archive', note: 'Photos delivered, records archived', highlight: false },
]

export default function LifecycleSection() {
  return (
    <section id="lifecycle" className="bg-[#0D0D0D] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 02 — Execution Lifecycle
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12">
        7 Steps. No Surprises.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`p-4 border transition-colors ${
              step.highlight
                ? 'border-[#C9A84C] bg-[#111] ring-1 ring-[rgba(201,168,76,0.15)]'
                : 'border-[#1E1E1E] bg-[#0A0A0A]'
            }`}
          >
            <p
              className={`font-mono text-xl mb-2 ${
                step.highlight ? 'text-[#C9A84C] font-bold' : 'text-[#2A2A2A]'
              }`}
            >
              {step.num}
            </p>
            <p
              className={`font-mono text-xs mb-2 leading-snug ${
                step.highlight ? 'text-[#C9A84C]' : 'text-[#F0ECE0]'
              }`}
            >
              {step.label}
            </p>
            <p className="font-mono text-xs text-[#555] leading-relaxed">{step.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
    </main>
  )
}
```

Open `http://localhost:3000` and scroll. Expected: 7-cell grid. Step 05 "Verification Gate" is visually distinct — gold border, gold text, ring glow. Other steps are dark/muted. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: LifecycleSection — 7-step timeline, Step 05 Verification Gate emphasized

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: DocumentationSection (Section 03)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/DocumentationSection.tsx`

- [ ] **Step 1: Write DocumentationSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/DocumentationSection.tsx
const pillars = [
  {
    label: 'Before Photos',
    body: 'Comprehensive room-by-room photos before any work begins.',
  },
  {
    label: 'Milestone Photos',
    body: 'After cleanout, kitchen/bath, floors, and final sweep.',
  },
  {
    label: 'Completion Archive',
    body: 'Full photo set delivered. Records stored 18–24 months minimum.',
  },
]

export default function DocumentationSection() {
  return (
    <section id="documentation" className="bg-[#0A0A0A] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 03 — Documentation Standard
      </p>
      <div className="text-center mb-16">
        <blockquote className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] italic leading-tight mb-4 max-w-3xl mx-auto">
          &ldquo;If it is not documented, it did not occur.&rdquo;
        </blockquote>
        <p className="font-mono text-xs text-[rgba(201,168,76,0.6)] tracking-widest">
          — Prime Pathwy Operating Standard, Section 5
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {pillars.map((pillar) => (
          <div
            key={pillar.label}
            className="bg-[#0D0D0D] border border-[#1E1E1E] p-6 hover:border-[rgba(201,168,76,0.4)] hover:bg-[#111] transition-colors"
          >
            <p className="font-mono text-xs text-[#C9A84C] tracking-wide uppercase mb-3">
              {pillar.label}
            </p>
            <p className="font-mono text-sm text-[#888] leading-relaxed">{pillar.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
      <DocumentationSection />
    </main>
  )
}
```

Open `http://localhost:3000`. Scroll to Section 03. Expected: Large italic serif pull-quote centered on black background — "If it is not documented, it did not occur." — attribution below in dim gold. Three documentation cards below. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: DocumentationSection — pull-quote and 3 archival pillars

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: PricingSection (Section 04)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/PricingSection.tsx`

- [ ] **Step 1: Write PricingSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/PricingSection.tsx
const apartmentRows = [
  { type: 'Studio / 1 Bedroom', range: '$1,200 – $1,600' },
  { type: '2 Bedroom', range: '$1,500 – $2,000' },
  { type: '3 Bedroom', range: '$1,800 – $2,400' },
]

const homeRows = [
  { type: '2 Bedroom', range: '$1,600 – $2,100' },
  { type: '3 Bedroom', range: '$1,900 – $2,600' },
  { type: '4 Bedroom', range: '$2,300 – $3,000' },
  { type: 'Each Additional Bedroom', range: '+$200' },
]

const footnotes = [
  'Disposal and landfill fees billed separately at cost with receipts.',
  'Standard timeline: 2–3 business days (estimate).',
  'Extreme conditions (biohazard, hoarding) require separate written quote.',
  'Licensed trade work is not included.',
]

function PriceTable({
  title,
  rows,
}: {
  title: string
  rows: { type: string; range: string }[]
}) {
  return (
    <div className="border border-[#1E1E1E] bg-[#0A0A0A]">
      <div className="border-b border-[#1E1E1E] px-6 py-4">
        <p className="font-mono text-xs text-[#C9A84C] tracking-wide uppercase">{title}</p>
      </div>
      {rows.map((row) => (
        <div
          key={row.type}
          className="flex justify-between items-center px-6 py-3 border-b border-[#1A1A1A] last:border-b-0"
        >
          <span className="font-mono text-sm text-[#888]">{row.type}</span>
          <span className="font-mono text-sm text-[#F0ECE0]">{row.range}</span>
        </div>
      ))}
    </div>
  )
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#0D0D0D] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 04 — Pricing & Scope
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12">
        Labor Pricing — Clear, Fixed, Locked at Order
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <PriceTable title="Apartment Units — Labor Only" rows={apartmentRows} />
        <PriceTable title="Single-Family Homes — Labor Only" rows={homeRows} />
      </div>
      <div className="border-t border-[#1A1A1A] pt-6 space-y-2">
        {footnotes.map((note) => (
          <p key={note} className="font-mono text-xs text-[#555] leading-relaxed">
            · {note}
          </p>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
      <DocumentationSection />
      <PricingSection />
    </main>
  )
}
```

Open `http://localhost:3000`. Scroll to Section 04. Expected: Two dark price tables side by side. Gold table headers. Muted gray type labels on left, warm white price ranges on right. Four footnotes below in dim text. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: PricingSection — apartment and home price tables

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: AgreementSection (Section 05)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/AgreementSection.tsx`

- [ ] **Step 1: Write AgreementSection.tsx**

```tsx
// Prime_Pathwy_Website/src/components/AgreementSection.tsx
const terms = [
  {
    bold: 'Scope is locked to your order summary.',
    rest: ' Changes require a written change order approved before work continues.',
  },
  {
    bold: 'Payment is captured in full at booking.',
    rest: ' Because services involve irreversible labor, payments are non-refundable once scheduled or commenced.',
  },
  {
    bold: 'Projects of $1,000 or more require identity and authority verification',
    rest: ' before scheduling is confirmed.',
  },
  {
    bold: 'You confirm legal authority',
    rest: ' to approve services and authorize disposal of abandoned contents at the property address provided.',
  },
]

export default function AgreementSection() {
  return (
    <section id="agreement" className="bg-[#0A0A0A] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 05 — The Agreement
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12 max-w-2xl">
        What You&apos;re Accepting When You Place an Order
      </h2>
      <div className="max-w-3xl space-y-6 mb-12">
        {terms.map((term, i) => (
          <div key={i} className="flex gap-4">
            <span className="font-mono text-[#C9A84C] flex-shrink-0 mt-0.5">·</span>
            <p className="font-mono text-sm text-[#888] leading-relaxed">
              <span className="text-[#F0ECE0]">{term.bold}</span>
              {term.rest}
            </p>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-[rgba(201,168,76,0.6)] border-t border-[#1A1A1A] pt-6 max-w-3xl leading-relaxed">
        &ldquo;By completing checkout, you enter into a binding electronic agreement. The website order record is the system of record.&rdquo;
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'
import AgreementSection from '@/components/AgreementSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
      <DocumentationSection />
      <PricingSection />
      <AgreementSection />
    </main>
  )
}
```

Open `http://localhost:3000`. Scroll to Section 05. Expected: 4 gold-bulleted terms. Each term has a warm-white bold opener and muted gray continuation. Closing declaration in dim gold at bottom. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: AgreementSection — plain-language terms, system of record declaration

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: OrderForm — Steps 1–4 (No Stripe Yet)

**Files:**
- Create: `Prime_Pathwy_Website/src/components/OrderForm.tsx`
- Create: `Prime_Pathwy_Website/src/components/OrderSection.tsx`

- [ ] **Step 1: Write OrderForm.tsx (Steps 1–4 only, Step 5 is a placeholder)**

```tsx
// Prime_Pathwy_Website/src/components/OrderForm.tsx
'use client'

import { useState } from 'react'
import { calculatePrice, getUnitSizes } from '@/lib/pricing'
import type { OrderFormState, PropertyType, UnitSize } from '@/types/order'

const INITIAL_STATE: OrderFormState = {
  step: 1,
  propertyType: null,
  unitSize: null,
  addons: { disposal: false, extremeConditions: false },
  serviceDetails: { address: '', preferredDate: '', accessMethod: '' },
  agreementAccepted: false,
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-[#C9A84C] tracking-[0.15em] uppercase mb-2">
      {children}
    </p>
  )
}

function RadioCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border font-mono text-sm transition-colors ${
        selected
          ? 'border-[#C9A84C] bg-[#111] text-[#F0ECE0]'
          : 'border-[#1E1E1E] bg-[#0D0D0D] text-[#888] hover:border-[rgba(201,168,76,0.4)]'
      }`}
    >
      <span
        className={`inline-block w-3 h-3 border mr-3 ${
          selected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-[#444]'
        }`}
      />
      {children}
    </button>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 ${i + 1 <= current ? 'bg-[#C9A84C]' : 'bg-[#1E1E1E]'}`}
        />
      ))}
    </div>
  )
}

export default function OrderForm({
  onPaymentReady,
}: {
  onPaymentReady: (state: OrderFormState) => void
}) {
  const [form, setForm] = useState<OrderFormState>(INITIAL_STATE)

  const pricing =
    form.propertyType && form.unitSize
      ? calculatePrice(form.propertyType, form.unitSize)
      : null

  const unitSizes = form.propertyType ? getUnitSizes(form.propertyType) : []

  function next() {
    setForm((f) => ({ ...f, step: (f.step + 1) as OrderFormState['step'] }))
  }

  function back() {
    setForm((f) => ({ ...f, step: (f.step - 1) as OrderFormState['step'] }))
  }

  if (form.step === 5) {
    onPaymentReady(form)
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={form.step} total={5} />

      {/* Step 1: Property Type */}
      {form.step === 1 && (
        <div>
          <FieldLabel>Step 1 of 5 — Property Type</FieldLabel>
          <div className="space-y-2 mb-8">
            <RadioCard
              selected={form.propertyType === 'apartment'}
              onClick={() =>
                setForm((f) => ({ ...f, propertyType: 'apartment', unitSize: null }))
              }
            >
              Apartment Unit
            </RadioCard>
            <RadioCard
              selected={form.propertyType === 'single-family'}
              onClick={() =>
                setForm((f) => ({ ...f, propertyType: 'single-family', unitSize: null }))
              }
            >
              Single-Family Home
            </RadioCard>
          </div>
          <button
            onClick={next}
            disabled={!form.propertyType}
            className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Unit Size */}
      {form.step === 2 && (
        <div>
          <FieldLabel>Step 2 of 5 — Unit Size</FieldLabel>
          <div className="space-y-2 mb-8">
            {unitSizes.map((size) => (
              <RadioCard
                key={size.value}
                selected={form.unitSize === size.value}
                onClick={() => setForm((f) => ({ ...f, unitSize: size.value as UnitSize }))}
              >
                {size.label}
              </RadioCard>
            ))}
          </div>
          {pricing && (
            <p className="font-mono text-sm text-[#F0ECE0] mb-6">
              Estimated labor:{' '}
              <span className="text-[#C9A84C]">{pricing.displayPrice}</span>
            </p>
          )}
          <div className="flex gap-4">
            <button
              onClick={back}
              className="font-mono text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#333] text-[#555] hover:border-[#555] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={!form.unitSize}
              className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Add-Ons */}
      {form.step === 3 && (
        <div>
          <FieldLabel>Step 3 of 5 — Add-Ons</FieldLabel>
          <div className="space-y-3 mb-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.addons.disposal}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    addons: { ...f.addons, disposal: e.target.checked },
                  }))
                }
                className="mt-1 accent-[#C9A84C]"
              />
              <div>
                <p className="font-mono text-sm text-[#F0ECE0]">Disposal / Haul-Out</p>
                <p className="font-mono text-xs text-[#555] mt-1">
                  Billed separately at cost with landfill receipts provided.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.addons.extremeConditions}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    addons: { ...f.addons, extremeConditions: e.target.checked },
                  }))
                }
                className="mt-1 accent-[#C9A84C]"
              />
              <div>
                <p className="font-mono text-sm text-[#F0ECE0]">Extreme Conditions</p>
                <p className="font-mono text-xs text-[#555] mt-1">
                  Biohazard, hoarding, or similar. Requires a separate written quote — selecting this will trigger a manual review before scheduling.
                </p>
              </div>
            </label>
          </div>
          <div className="flex gap-4">
            <button
              onClick={back}
              className="font-mono text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#333] text-[#555] hover:border-[#555] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Service Details */}
      {form.step === 4 && (
        <div>
          <FieldLabel>Step 4 of 5 — Service Details</FieldLabel>
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-mono text-xs text-[#555] mb-1 tracking-wide">Property Address</p>
              <input
                type="text"
                value={form.serviceDetails.address}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    serviceDetails: { ...f.serviceDetails, address: e.target.value },
                  }))
                }
                placeholder="123 Main St, City, State ZIP"
                className="w-full bg-[#0D0D0D] border border-[#1E1E1E] text-[#F0ECE0] font-mono text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C] placeholder:text-[#333]"
              />
            </div>
            <div>
              <p className="font-mono text-xs text-[#555] mb-1 tracking-wide">Preferred Service Date</p>
              <input
                type="date"
                value={form.serviceDetails.preferredDate}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    serviceDetails: { ...f.serviceDetails, preferredDate: e.target.value },
                  }))
                }
                className="w-full bg-[#0D0D0D] border border-[#1E1E1E] text-[#F0ECE0] font-mono text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <p className="font-mono text-xs text-[#555] mb-2 tracking-wide">Access Method</p>
              <div className="space-y-2">
                {(['keys', 'lockbox', 'codes'] as const).map((method) => (
                  <RadioCard
                    key={method}
                    selected={form.serviceDetails.accessMethod === method}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        serviceDetails: { ...f.serviceDetails, accessMethod: method },
                      }))
                    }
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </RadioCard>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={back}
              className="font-mono text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#333] text-[#555] hover:border-[#555] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={
                !form.serviceDetails.address ||
                !form.serviceDetails.preferredDate ||
                !form.serviceDetails.accessMethod
              }
              className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Review & Pay →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write OrderSection.tsx (wrapper only, Stripe step wired in Task 15)**

```tsx
// Prime_Pathwy_Website/src/components/OrderSection.tsx
'use client'

import { useState } from 'react'
import OrderForm from './OrderForm'
import type { OrderFormState } from '@/types/order'

export default function OrderSection() {
  const [readyState, setReadyState] = useState<OrderFormState | null>(null)

  return (
    <section id="order" className="bg-[#0D0D0D] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 06 — Place Your Order
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12">
        System of Record — Order Entry
      </h2>
      {!readyState ? (
        <OrderForm onPaymentReady={setReadyState} />
      ) : (
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-sm text-[#C9A84C] mb-4">
            Stripe payment step coming in Task 15...
          </p>
          <p className="font-mono text-xs text-[#555]">
            Order: {readyState.propertyType} / {readyState.unitSize}
          </p>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 3: Add both to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'
import AgreementSection from '@/components/AgreementSection'
import OrderSection from '@/components/OrderSection'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
      <DocumentationSection />
      <PricingSection />
      <AgreementSection />
      <OrderSection />
    </main>
  )
}
```

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Open `http://localhost:3000`. Scroll to Section 06. Expected:
- Step progress bar (5 segments) at top
- Step 1: Two radio cards — "Apartment Unit" / "Single-Family Home". Select one, Continue activates.
- Step 2: Unit size options appear, price range shown after selection.
- Step 3: Disposal + Extreme Conditions checkboxes.
- Step 4: Address input, date picker, access method radios.
- Reaching step 5 shows placeholder text.
Kill with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: OrderForm Steps 1-4 — property type, unit size, addons, service details

Multi-step form with progress indicator. Price auto-populates in Step 2.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Stripe API Routes

**Files:**
- Create: `Prime_Pathwy_Website/src/app/api/create-payment-intent/route.ts`
- Create: `Prime_Pathwy_Website/src/app/api/stripe-webhook/route.ts`

- [ ] **Step 1: Write create-payment-intent/route.ts**

```ts
// Prime_Pathwy_Website/src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { calculatePrice } from '@/lib/pricing'
import type { PropertyType, UnitSize } from '@/types/order'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyType, unitSize, address, preferredDate, accessMethod } = body as {
      propertyType: PropertyType
      unitSize: UnitSize
      address: string
      preferredDate: string
      accessMethod: string
    }

    if (!propertyType || !unitSize || !address || !preferredDate || !accessMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pricing = calculatePrice(propertyType, unitSize)
    if (!pricing) {
      return NextResponse.json({ error: 'Invalid property type or unit size' }, { status: 400 })
    }

    const amountInCents = pricing.priceRange.min * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        propertyType,
        unitSize,
        unitLabel: pricing.unitLabel,
        displayPrice: pricing.displayPrice,
        address,
        preferredDate,
        accessMethod,
        verificationRequired: 'true',
        orderedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('[create-payment-intent]', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Write stripe-webhook/route.ts**

```ts
// Prime_Pathwy_Website/src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    console.log('[stripe-webhook] Order completed:', {
      id: pi.id,
      amount: pi.amount,
      address: pi.metadata.address,
      unitLabel: pi.metadata.unitLabel,
      orderedAt: pi.metadata.orderedAt,
    })
    // Future: send confirmation email via Resend or SendGrid
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
```

- [ ] **Step 3: Verify routes compile**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`. No TypeScript errors. If you see `STRIPE_SECRET_KEY` errors, confirm `.env.local` has placeholder values (any non-empty string works for the build check).

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/app/api/ && git commit -m "$(cat <<'EOF'
feat: Stripe API routes — create-payment-intent and webhook handler

Payment Intent uses price range min. Webhook logs order metadata.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Step 5 — Stripe Elements Payment Form

**Files:**
- Create: `Prime_Pathwy_Website/src/components/StripePaymentStep.tsx`
- Modify: `Prime_Pathwy_Website/src/components/OrderSection.tsx`

- [ ] **Step 1: Write StripePaymentStep.tsx**

```tsx
// Prime_Pathwy_Website/src/components/StripePaymentStep.tsx
'use client'

import { useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { calculatePrice } from '@/lib/pricing'
import type { OrderFormState } from '@/types/order'

const stripePromise = getStripe()

function PaymentForm({
  formState,
  onSuccess,
  onBack,
}: {
  formState: OrderFormState
  onSuccess: () => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pricing =
    formState.propertyType && formState.unitSize
      ? calculatePrice(formState.propertyType, formState.unitSize)
      : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements || !agreed) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (submitError) {
      setError(submitError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Order Summary */}
      <div className="border border-[#1E1E1E] bg-[#0A0A0A] p-6 mb-6">
        <p className="font-mono text-xs text-[#C9A84C] tracking-[0.15em] uppercase mb-4">
          Order Summary
        </p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-mono text-xs text-[#555]">Property Type</span>
            <span className="font-mono text-xs text-[#F0ECE0]">
              {formState.propertyType === 'apartment' ? 'Apartment Unit' : 'Single-Family Home'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-xs text-[#555]">Unit Size</span>
            <span className="font-mono text-xs text-[#F0ECE0]">{pricing?.unitLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-xs text-[#555]">Labor Price Range</span>
            <span className="font-mono text-xs text-[#C9A84C]">{pricing?.displayPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-xs text-[#555]">Address</span>
            <span className="font-mono text-xs text-[#F0ECE0]">{formState.serviceDetails.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-xs text-[#555]">Preferred Date</span>
            <span className="font-mono text-xs text-[#F0ECE0]">{formState.serviceDetails.preferredDate}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-[#1A1A1A] pt-4">
          <p className="font-mono text-xs text-[#555]">
            · Verification will be initiated within 1 business day before scheduling is confirmed.
          </p>
          <p className="font-mono text-xs text-[#555] mt-1">
            · Payment captured today reflects the minimum of the price range. Final invoice confirmed after verification.
          </p>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="mb-6">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Agreement Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-[#C9A84C]"
        />
        <p className="font-mono text-xs text-[#888] leading-relaxed">
          I have read and accept the{' '}
          <span className="text-[#C9A84C]">Prime Pathwy Service Agreement</span>. I confirm
          legal authority to approve services at the property address provided. I understand
          payment is non-refundable once scheduling is confirmed.
        </p>
      </label>

      {error && (
        <p className="font-mono text-xs text-red-400 mb-4 border border-red-900 bg-red-950 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#333] text-[#555] hover:border-[#555] transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!agreed || loading || !stripe}
          className="font-mono text-xs tracking-[0.2em] uppercase px-8 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-1"
        >
          {loading ? 'Processing...' : 'Submit Order & Pay →'}
        </button>
      </div>
    </form>
  )
}

export default function StripePaymentStep({
  formState,
  onSuccess,
  onBack,
}: {
  formState: OrderFormState
  onSuccess: () => void
  onBack: () => void
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function createIntent() {
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyType: formState.propertyType,
            unitSize: formState.unitSize,
            address: formState.serviceDetails.address,
            preferredDate: formState.serviceDetails.preferredDate,
            accessMethod: formState.serviceDetails.accessMethod,
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to initialize payment.')
      }
    }
    createIntent()
  }, [formState])

  if (fetchError) {
    return (
      <p className="font-mono text-xs text-red-400 border border-red-900 bg-red-950 px-4 py-3 max-w-2xl mx-auto">
        {fetchError}
      </p>
    )
  }

  if (!clientSecret) {
    return (
      <p className="font-mono text-xs text-[#555] max-w-2xl mx-auto">
        Initializing secure payment...
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#C9A84C',
            colorBackground: '#0D0D0D',
            colorText: '#F0ECE0',
            colorDanger: '#ff4444',
            fontFamily: '"Courier New", Courier, monospace',
            borderRadius: '0px',
          },
        },
      }}
    >
      <PaymentForm formState={formState} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}
```

- [ ] **Step 2: Update OrderSection.tsx to wire in StripePaymentStep**

```tsx
// Prime_Pathwy_Website/src/components/OrderSection.tsx
'use client'

import { useState } from 'react'
import OrderForm from './OrderForm'
import StripePaymentStep from './StripePaymentStep'
import ConfirmationModal from './ConfirmationModal'
import type { OrderFormState } from '@/types/order'

export default function OrderSection() {
  const [readyState, setReadyState] = useState<OrderFormState | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <section id="order" className="bg-[#0D0D0D] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 06 — Place Your Order
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12">
        System of Record — Order Entry
      </h2>

      {!readyState && <OrderForm onPaymentReady={setReadyState} />}

      {readyState && !confirmed && (
        <StripePaymentStep
          formState={readyState}
          onSuccess={() => setConfirmed(true)}
          onBack={() => setReadyState(null)}
        />
      )}

      {confirmed && <ConfirmationModal />}
    </section>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`. No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: StripePaymentStep — Stripe Elements with night theme, order summary, agreement checkbox

Night theme styled to Matte Black/Gold aesthetic. Payment Intent
created on mount. Non-refundable policy stated before submit button.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: ConfirmationModal + Footer

**Files:**
- Create: `Prime_Pathwy_Website/src/components/ConfirmationModal.tsx`
- Create: `Prime_Pathwy_Website/src/components/Footer.tsx`

- [ ] **Step 1: Write ConfirmationModal.tsx**

```tsx
// Prime_Pathwy_Website/src/components/ConfirmationModal.tsx
import Image from 'next/image'

export default function ConfirmationModal() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <Image
        src="/logo.png"
        alt="Prime Pathwy Seal"
        width={80}
        height={80}
        className="rounded-full mx-auto mb-6"
      />
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
        Order Recorded
      </p>
      <h3 className="font-serif text-[24px] text-[#F0ECE0] mb-6 italic">
        Your order is in the system. We leave no doubt.
      </h3>
      <div className="border border-[#1E1E1E] bg-[#0A0A0A] p-6 text-left space-y-3 mb-8">
        <p className="font-mono text-xs text-[#888] leading-relaxed">
          · Your payment has been captured and timestamped.
        </p>
        <p className="font-mono text-xs text-[#888] leading-relaxed">
          · Verification will be initiated within 1 business day before scheduling is confirmed.
        </p>
        <p className="font-mono text-xs text-[#888] leading-relaxed">
          · A confirmation receipt has been sent to your email by Stripe.
        </p>
        <p className="font-mono text-xs text-[#888] leading-relaxed">
          · Before, during, and after photos will be documented and archived for your records.
        </p>
      </div>
      <p className="font-mono text-xs text-[rgba(201,168,76,0.5)] tracking-widest">
        Prime Pathwy Operating Standard · If it is not documented, it did not occur.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Write Footer.tsx**

```tsx
// Prime_Pathwy_Website/src/components/Footer.tsx
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#C9A84C] py-10 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Prime Pathwy Seal"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-serif text-[#C9A84C] text-sm">PRIME PATHWY</p>
            <p className="font-mono text-xs text-[#555]">© 2026 All rights reserved.</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-mono text-xs text-[#444] leading-relaxed italic">
            &ldquo;This operating structure ensures alignment, defensibility, audit readiness, and scalability.&rdquo;
          </p>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xs text-[#555]">Contact</p>
          <p className="font-mono text-xs text-[#C9A84C] mt-1">info@primepathwy.com</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Add Footer to page.tsx and verify**

```tsx
// Prime_Pathwy_Website/src/app/page.tsx
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'
import AgreementSection from '@/components/AgreementSection'
import OrderSection from '@/components/OrderSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <HeroSection />
      <SystemSection />
      <LifecycleSection />
      <DocumentationSection />
      <PricingSection />
      <AgreementSection />
      <OrderSection />
      <Footer />
    </main>
  )
}
```

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

Open `http://localhost:3000`. Scroll to bottom. Expected: Footer with gold top border, seal logo, copyright, system declaration italic text, contact email. Kill with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/src/ && git commit -m "$(cat <<'EOF'
feat: ConfirmationModal and Footer — full page assembly complete

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: End-to-End Test Mode Verification

**Goal:** Confirm the full Stripe flow works with test keys before considering the page complete.

- [ ] **Step 1: Add real Stripe test keys to .env.local**

Get test keys from `https://dashboard.stripe.com/test/apikeys`. Replace values in `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...your_actual_test_key...
STRIPE_SECRET_KEY=sk_test_...your_actual_test_key...
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_now
```

- [ ] **Step 2: Start dev server**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm run dev
```

- [ ] **Step 3: Complete the order form**

Open `http://localhost:3000`. Click "Place Your Order →". Walk through all 5 steps:
1. Select "Apartment Unit"
2. Select "Studio / 1 Bedroom" — confirm "$1,200 – $1,600" appears
3. Skip add-ons (Continue)
4. Enter address "123 Test St", any future date, select "Keys"
5. Stripe payment form loads. Enter test card: `4242 4242 4242 4242`, any future expiry, any CVC.
6. Check agreement box. Click "Submit Order & Pay →"

Expected: ConfirmationModal appears — "Your order is in the system." Gold seal logo. Four confirmation bullet points.

- [ ] **Step 4: Run tests one final time**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npm test
```

Expected: `11 passed (11)` — all pricing tests green.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/ && git commit -m "$(cat <<'EOF'
feat: complete Sovereign System landing page — all sections, Stripe E2E verified

All 8 sections live. Stripe test mode payment confirmed working.
11/11 unit tests passing.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Vercel Deployment

**Files:**
- Create: `Prime_Pathwy_Website/vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

- [ ] **Step 2: Add environment variables to Vercel**

In the Vercel dashboard for this project, add these environment variables (Settings → Environment Variables):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your live or test publishable key
- `STRIPE_SECRET_KEY` = your live or test secret key
- `STRIPE_WEBHOOK_SECRET` = from Stripe webhook dashboard after registering the endpoint

- [ ] **Step 3: Deploy**

```bash
cd "C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Website" && npx vercel --prod 2>&1
```

Expected: Deployment URL printed, e.g. `https://prime-pathwy-website.vercel.app`

- [ ] **Step 4: Register Stripe webhook**

In Stripe Dashboard → Webhooks → Add Endpoint:
- URL: `https://your-vercel-url.vercel.app/api/stripe-webhook`
- Events: `payment_intent.succeeded`
- Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars → redeploy.

- [ ] **Step 5: Final commit**

```bash
cd "C:/Users/arthu/GeminiEcosystem" && git add Prime_Pathwy_Website/vercel.json && git commit -m "$(cat <<'EOF'
feat: Vercel deployment config

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage check:**
| Spec Requirement | Covered By |
|---|---|
| Matte Black + Gold aesthetic | Task 2 (Tailwind), all components |
| Sticky Nav with anchor links | Task 6 |
| Section 00 — Hero, "No Doubt" headline | Task 7 |
| Section 01 — 3-card system differentiators | Task 8 |
| Section 02 — 7-step lifecycle, Step 05 emphasized | Task 9 |
| Section 03 — pull-quote + 3 pillars | Task 10 |
| Section 04 — pricing tables with footnotes | Task 11 |
| Section 05 — 4 plain-language agreement terms | Task 12 |
| Section 06 — 5-step order form | Task 13 |
| Stripe Payment Intents + Elements | Tasks 14–15 |
| Confirmation modal post-payment | Task 16 |
| Footer with system declaration | Task 16 |
| All pricing figures from Master Merged 2026 | Task 3 (pricing.ts) |
| Unit tests for pricing logic | Task 3 |
| Vercel deployment | Task 18 |
| .env.local with Stripe keys | Task 4 |

**Placeholder scan:** No TBDs. All copy is final text from the spec. Stripe theme values are explicit hex codes.

**Type consistency:** `OrderFormState.step` typed as `1|2|3|4|5` throughout. `PropertyType` and `UnitSize` imported consistently from `@/types/order`. `calculatePrice` signature matches usage in `StripePaymentStep` and `OrderForm`.
