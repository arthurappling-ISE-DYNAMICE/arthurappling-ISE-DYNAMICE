// Prime_Pathwy_Website/src/lib/stripe.client.ts
import { loadStripe, type Stripe as StripeClient } from '@stripe/stripe-js'

// Client-side Stripe singleton. Safe to import in React components marked 'use client'.
// Call getStripe() lazily — never at module level outside a component or effect.
let stripePromise: Promise<StripeClient | null>

export function getStripe(): Promise<StripeClient | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      throw new Error(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add it to .env.local (pk_test_...) or Vercel environment variables.'
      )
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
