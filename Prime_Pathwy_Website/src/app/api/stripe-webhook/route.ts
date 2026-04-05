export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe.server'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  // Raw body required for Stripe signature verification
  const body = await req.text()

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
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
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
