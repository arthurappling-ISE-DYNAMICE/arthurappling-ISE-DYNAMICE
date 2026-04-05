'use client'

import { useEffect, useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe.client'
import { calculatePrice } from '@/lib/pricing'
import type { OrderFormState } from '@/types/order'

// ─── Stripe Elements appearance: Matte Black / Gold ──────────────────────────
const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#C9A84C',
    colorBackground: '#0D0D0D',
    colorText: '#F0ECE0',
    colorTextSecondary: '#888888',
    colorDanger: '#ff4444',
    fontFamily: '"Courier New", Courier, monospace',
    borderRadius: '0px',
    colorIconTab: '#C9A84C',
    colorIconTabSelected: '#C9A84C',
  },
  rules: {
    '.Input': {
      border: '1px solid #1E1E1E',
      backgroundColor: '#0A0A0A',
      color: '#F0ECE0',
    },
    '.Input:focus': {
      border: '1px solid #C9A84C',
      outline: 'none',
      boxShadow: 'none',
    },
    '.Label': {
      color: '#888888',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '11px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
}

// ─── Inner form (must live inside <Elements> context) ────────────────────────
interface PaymentFormProps {
  formState: OrderFormState
  onSuccess: () => void
  onBack: () => void
}

function PaymentForm({ formState, onSuccess, onBack }: PaymentFormProps) {
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
      {/* 1. Order Summary */}
      <div className="border border-border-subtle bg-bg-base p-6 mb-6">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-gold mb-4">
          ORDER SUMMARY
        </p>

        <div className="space-y-2">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted">Property Type</span>
            <span className="text-text-primary capitalize">
              {formState.propertyType === 'single-family'
                ? 'Single-Family Home'
                : formState.propertyType ?? '—'}
            </span>
          </div>

          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted">Unit Size</span>
            <span className="text-text-primary">{pricing?.unitLabel ?? '—'}</span>
          </div>

          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted">Labor Price Range</span>
            <span className="text-gold">{pricing?.displayPrice ?? '—'}</span>
          </div>

          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted">Address</span>
            <span className="text-text-primary text-right max-w-[60%]">
              {formState.serviceDetails.address || '—'}
            </span>
          </div>

          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted">Preferred Date</span>
            <span className="text-text-primary">
              {formState.serviceDetails.preferredDate || '—'}
            </span>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-4 pt-4 space-y-2">
          <p className="font-mono text-[10px] text-text-muted leading-relaxed">
            · Verification will be initiated within 1 business day before scheduling is confirmed.
          </p>
          <p className="font-mono text-[10px] text-text-muted leading-relaxed">
            · Payment captured today reflects the minimum of the price range. Final invoice
            confirmed after verification.
          </p>
        </div>
      </div>

      {/* 2. Stripe PaymentElement */}
      <div className="mb-6">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {/* 3. Agreement Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer" htmlFor="agreement-checkbox">
          <input
            id="agreement-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 flex-shrink-0 accent-gold w-4 h-4"
            aria-describedby="agreement-text"
          />
          <p
            id="agreement-text"
            className="font-mono text-xs text-text-secondary leading-relaxed"
          >
            I have read and accept the{' '}
            <a href="#agreement" className="text-gold hover:underline">
              Prime Pathwy Service Agreement
            </a>
            . I confirm legal authority to approve services at the property address provided. I
            understand payment is non-refundable once scheduling is confirmed.
          </p>
        </label>
      </div>

      {/* 4. Error display */}
      {error && (
        <p
          role="alert"
          className="font-mono text-xs text-red-400 mb-4 border border-red-900 bg-red-950/50 px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* 5. Button row */}
      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-xs tracking-[0.1em] uppercase border border-dim text-text-secondary hover:border-text-muted px-6 py-3 transition-colors"
        >
          ← Back
        </button>

        <button
          type="submit"
          disabled={!agreed || loading || !stripe || !elements}
          className="flex-1 font-mono text-xs tracking-[0.15em] uppercase border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Submit Order & Pay →'}
        </button>
      </div>
    </form>
  )
}

// ─── Outer component: fetches client secret, renders <Elements> ──────────────
interface StripePaymentStepProps {
  formState: OrderFormState
  onSuccess: () => void
  onBack: () => void
}

export default function StripePaymentStep({
  formState,
  onSuccess,
  onBack,
}: StripePaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/create-payment-intent', {
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
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then((data: { clientSecret?: string; error?: string }) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setFetchError(data.error ?? 'Failed to initialize payment.')
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Network error.'
        setFetchError(message)
      })
  }, [
    formState.propertyType,
    formState.unitSize,
    formState.serviceDetails.address,
    formState.serviceDetails.preferredDate,
    formState.serviceDetails.accessMethod,
  ])

  if (!clientSecret && !fetchError) {
    return (
      <p className="font-mono text-xs text-text-muted">Initializing secure payment...</p>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto border border-red-900 bg-red-950/50 px-6 py-4">
        <p className="font-mono text-xs text-red-400">{fetchError}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 font-mono text-xs tracking-[0.1em] uppercase border border-dim text-text-secondary hover:border-text-muted px-6 py-3 transition-colors"
        >
          ← Back
        </button>
      </div>
    )
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret: clientSecret!,
        appearance: stripeAppearance,
      }}
    >
      <PaymentForm formState={formState} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}
