'use client'

import { useState } from 'react'
import OrderForm from '@/components/OrderForm'
import type { OrderFormState } from '@/types/order'

export default function OrderSection() {
  const [readyState, setReadyState] = useState<OrderFormState | null>(null)

  return (
    <section
      id="order"
      aria-labelledby="order-heading"
      className="bg-bg-surface py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-8">
          SECTION 06 — PLACE YOUR ORDER
        </p>

        <h2
          id="order-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12 max-w-3xl"
        >
          System of Record — Order Entry
        </h2>

        {!readyState ? (
          <OrderForm onPaymentReady={setReadyState} />
        ) : (
          <div className="max-w-2xl mx-auto">
            <p className="font-mono text-sm text-gold mb-4">
              Stripe payment step coming in Task 15...
            </p>
            <p className="font-mono text-xs text-text-muted">
              Order: {readyState.propertyType} / {readyState.unitSize}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
