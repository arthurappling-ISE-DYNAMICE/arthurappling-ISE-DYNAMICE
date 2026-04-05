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
    <section id="order" aria-labelledby="order-heading" className="bg-bg-surface py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
          SECTION 06 — PLACE YOUR ORDER
        </p>
        <h2 id="order-heading" className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12">
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
      </div>
    </section>
  )
}
