// Prime_Pathwy_Consulting_Wing/src/lib/stripe.server.ts
import 'server-only'
import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  throw new Error(
    'STRIPE_SECRET_KEY is not set. Add it to .env.local (sk_test_...) or Vercel environment variables.'
  )
}

// Server-side Stripe singleton. Import only in API routes and Server Components.
// The 'server-only' import above causes a hard build error if this module
// is ever imported in a client component or client bundle.
export const stripe = new Stripe(key, {
  apiVersion: '2026-03-25.dahlia',
})
