'use client'

import { useState } from 'react'
import { calculatePrice, getUnitSizes } from '@/lib/pricing'
import type {
  OrderFormState,
  PropertyType,
  UnitSize,
  OrderStep,
} from '@/types/order'

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE: OrderFormState = {
  step: 1,
  propertyType: null,
  unitSize: null,
  addons: { disposal: false, extremeConditions: false },
  serviceDetails: { address: '', preferredDate: '', accessMethod: '' },
  agreementAccepted: false,
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-xs tracking-[0.15em] uppercase text-gold mb-2">
      {children}
    </span>
  )
}

function RadioCard({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 w-full px-5 py-4 border font-mono text-sm transition-colors text-left ${
        selected
          ? 'border-gold text-text-primary bg-bg-elevated'
          : 'border-[#333] text-text-secondary bg-bg-elevated hover:border-[#444]'
      }`}
    >
      {/* Indicator dot */}
      <span
        className={`flex-shrink-0 w-3 h-3 rounded-full border ${
          selected ? 'bg-gold border-gold' : 'border-[#555] bg-transparent'
        }`}
        aria-hidden="true"
      />
      {label}
    </button>
  )
}

function StepIndicator({ currentStep }: { currentStep: OrderStep }) {
  return (
    <div className="flex gap-1.5 mb-8" aria-label={`Step ${currentStep} of 5`}>
      {([1, 2, 3, 4, 5] as OrderStep[]).map((step) => (
        <div
          key={step}
          className={`h-0.5 flex-1 transition-colors ${
            step <= currentStep ? 'bg-gold' : 'bg-[#333]'
          }`}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step sub-renders
// ---------------------------------------------------------------------------

function Step1({
  form,
  setForm,
}: {
  form: OrderFormState
  setForm: React.Dispatch<React.SetStateAction<OrderFormState>>
}) {
  function selectType(value: PropertyType) {
    setForm((prev) => ({ ...prev, propertyType: value, unitSize: null }))
  }

  function advance() {
    setForm((prev) => ({ ...prev, step: 2 }))
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
        STEP 01 — PROPERTY TYPE
      </p>
      <h3 className="font-serif text-[22px] text-text-primary mb-8">
        What type of property are we servicing?
      </h3>

      <fieldset className="space-y-3 border-none p-0 m-0">
        <legend className="sr-only">Property type</legend>
        <RadioCard
          label="Apartment Unit"
          selected={form.propertyType === 'apartment'}
          onClick={() => selectType('apartment')}
        />
        <RadioCard
          label="Single-Family Home"
          selected={form.propertyType === 'single-family'}
          onClick={() => selectType('single-family')}
        />
      </fieldset>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={advance}
          disabled={form.propertyType === null}
          className="font-mono text-sm px-8 py-3 border border-gold text-gold bg-transparent hover:bg-gold hover:text-bg-base transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step2({
  form,
  setForm,
}: {
  form: OrderFormState
  setForm: React.Dispatch<React.SetStateAction<OrderFormState>>
}) {
  const unitSizes = form.propertyType ? getUnitSizes(form.propertyType) : []
  const pricing =
    form.propertyType && form.unitSize
      ? calculatePrice(form.propertyType, form.unitSize)
      : null

  function selectSize(value: UnitSize) {
    setForm((prev) => ({ ...prev, unitSize: value }))
  }

  function goBack() {
    setForm((prev) => ({ ...prev, step: 1 }))
  }

  function advance() {
    setForm((prev) => ({ ...prev, step: 3 }))
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
        STEP 02 — UNIT SIZE
      </p>
      <h3 className="font-serif text-[22px] text-text-primary mb-8">
        Select the size of the unit.
      </h3>

      <div>
        <label htmlFor="unit-size-select">
          <FieldLabel>Unit size</FieldLabel>
        </label>
        <select
          id="unit-size-select"
          value={form.unitSize ?? ''}
          onChange={(e) => selectSize(e.target.value as UnitSize)}
          className="w-full bg-bg-elevated border border-[#333] text-text-primary font-mono text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
        >
          <option value="" disabled>
            — Select a size —
          </option>
          {unitSizes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {pricing && (
        <p className="font-mono text-sm text-gold mt-4">
          Estimated labor: {pricing.displayPrice}
        </p>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="font-mono text-sm px-6 py-3 border border-[#444] text-text-secondary bg-transparent hover:border-[#666] transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={form.unitSize === null}
          className="font-mono text-sm px-8 py-3 border border-gold text-gold bg-transparent hover:bg-gold hover:text-bg-base transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step3({
  form,
  setForm,
}: {
  form: OrderFormState
  setForm: React.Dispatch<React.SetStateAction<OrderFormState>>
}) {
  function toggle(key: 'disposal' | 'extremeConditions') {
    setForm((prev) => ({
      ...prev,
      addons: { ...prev.addons, [key]: !prev.addons[key] },
    }))
  }

  function goBack() {
    setForm((prev) => ({ ...prev, step: 2 }))
  }

  function advance() {
    setForm((prev) => ({ ...prev, step: 4 }))
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
        STEP 03 — ADD-ONS
      </p>
      <h3 className="font-serif text-[22px] text-text-primary mb-8">
        Any additional services?
      </h3>

      <div className="space-y-4">
        {/* Disposal */}
        <label className="flex items-start gap-4 p-5 border border-[#333] bg-bg-elevated cursor-pointer hover:border-[#444] transition-colors">
          <input
            type="checkbox"
            checked={form.addons.disposal}
            onChange={() => toggle('disposal')}
            className="mt-0.5 flex-shrink-0 accent-[#C9A84C] w-4 h-4"
            aria-describedby="disposal-desc"
          />
          <div>
            <span className="block font-mono text-sm text-text-primary mb-1">
              Disposal / Haul-Out
            </span>
            <span id="disposal-desc" className="font-mono text-xs text-text-secondary">
              Billed separately at cost with landfill receipts provided.
            </span>
          </div>
        </label>

        {/* Extreme Conditions */}
        <label className="flex items-start gap-4 p-5 border border-[#333] bg-bg-elevated cursor-pointer hover:border-[#444] transition-colors">
          <input
            type="checkbox"
            checked={form.addons.extremeConditions}
            onChange={() => toggle('extremeConditions')}
            className="mt-0.5 flex-shrink-0 accent-[#C9A84C] w-4 h-4"
            aria-describedby="extreme-desc"
          />
          <div>
            <span className="block font-mono text-sm text-text-primary mb-1">
              Extreme Conditions
            </span>
            <span id="extreme-desc" className="font-mono text-xs text-text-secondary">
              Biohazard, hoarding, or similar. Requires a separate written quote — selecting
              this will trigger a manual review before scheduling.
            </span>
          </div>
        </label>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="font-mono text-sm px-6 py-3 border border-[#444] text-text-secondary bg-transparent hover:border-[#666] transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={advance}
          className="font-mono text-sm px-8 py-3 border border-gold text-gold bg-transparent hover:bg-gold hover:text-bg-base transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step4({
  form,
  setForm,
}: {
  form: OrderFormState
  setForm: React.Dispatch<React.SetStateAction<OrderFormState>>
}) {
  const { address, preferredDate, accessMethod } = form.serviceDetails
  const canContinue = address.trim() !== '' && preferredDate !== '' && accessMethod !== ''

  function updateField(key: 'address' | 'preferredDate', value: string) {
    setForm((prev) => ({
      ...prev,
      serviceDetails: { ...prev.serviceDetails, [key]: value },
    }))
  }

  function selectAccess(value: 'keys' | 'lockbox' | 'codes') {
    setForm((prev) => ({
      ...prev,
      serviceDetails: { ...prev.serviceDetails, accessMethod: value },
    }))
  }

  function goBack() {
    setForm((prev) => ({ ...prev, step: 3 }))
  }

  function advance() {
    setForm((prev) => ({ ...prev, step: 5 }))
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
        STEP 04 — SERVICE DETAILS
      </p>
      <h3 className="font-serif text-[22px] text-text-primary mb-8">
        Where and when do we show up?
      </h3>

      <div className="space-y-6">
        {/* Address */}
        <div>
          <label htmlFor="property-address">
            <FieldLabel>Property Address</FieldLabel>
          </label>
          <input
            id="property-address"
            type="text"
            value={address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="123 Main St, City, State ZIP"
            className="w-full bg-bg-elevated border border-[#333] text-text-primary font-mono text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Preferred Date */}
        <div>
          <label htmlFor="preferred-date">
            <FieldLabel>Preferred Service Date</FieldLabel>
          </label>
          <input
            id="preferred-date"
            type="date"
            value={preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            className="w-full bg-bg-elevated border border-[#333] text-text-primary font-mono text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Access Method */}
        <fieldset className="border-none p-0 m-0">
          <legend>
            <FieldLabel>Access Method</FieldLabel>
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {(['keys', 'lockbox', 'codes'] as const).map((method) => (
              <RadioCard
                key={method}
                label={method.charAt(0).toUpperCase() + method.slice(1)}
                selected={accessMethod === method}
                onClick={() => selectAccess(method)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={goBack}
          className="font-mono text-sm px-6 py-3 border border-[#444] text-text-secondary bg-transparent hover:border-[#666] transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={!canContinue}
          className="font-mono text-sm px-8 py-3 border border-gold text-gold bg-transparent hover:bg-gold hover:text-bg-base transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>

      <p className="font-mono text-xs text-text-muted mt-4">
        By proceeding, you accept the{' '}
        <a href="#agreement" className="text-gold hover:underline">
          Prime Pathwy Service Agreement
        </a>
        {' '}outlined in Section 05 above.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function OrderForm({
  onPaymentReady,
}: {
  onPaymentReady: (state: OrderFormState) => void
}) {
  const [form, setForm] = useState<OrderFormState>(INITIAL_STATE)

  // Step 5: hand off to parent and unmount
  if (form.step === 5) {
    onPaymentReady(form)
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={form.step} />

      {form.step === 1 && <Step1 form={form} setForm={setForm} />}
      {form.step === 2 && <Step2 form={form} setForm={setForm} />}
      {form.step === 3 && <Step3 form={form} setForm={setForm} />}
      {form.step === 4 && <Step4 form={form} setForm={setForm} />}
    </div>
  )
}
