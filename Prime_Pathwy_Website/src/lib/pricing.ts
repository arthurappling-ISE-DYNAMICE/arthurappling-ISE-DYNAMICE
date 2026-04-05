import type { PropertyType, UnitSize, PriceRange, PriceCalculation } from '@/types/order'

// The $1,000+ verification gate threshold from the Prime Pathwy SOP Section 2.
// Every standard unit in the price table exceeds this threshold, so verification
// is required for all orders. Exported so tests can assert this invariant.
export const VERIFICATION_GATE_THRESHOLD = 1000

// Exact pricing from Prime Pathwy Master Merged 2026 — Section 1, Pricing & Service Scope
const APARTMENT_PRICES: Partial<Record<UnitSize, PriceRange>> = {
  'studio-1br': { min: 1200, max: 1600 },
  '2br':        { min: 1500, max: 2000 },
  '3br':        { min: 1800, max: 2400 },
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
    displayPrice: `$${range.min.toLocaleString('en-US')} \u2013 $${range.max.toLocaleString('en-US')}`,
  }
}

export function getUnitSizes(
  propertyType: PropertyType
): { value: UnitSize; label: string }[] {
  if (propertyType === 'apartment') {
    return [
      { value: 'studio-1br', label: 'Studio / 1 Bedroom ($1,200 \u2013 $1,600)' },
      { value: '2br',        label: '2 Bedroom ($1,500 \u2013 $2,000)' },
      { value: '3br',        label: '3 Bedroom ($1,800 \u2013 $2,400)' },
    ]
  }
  return [
    { value: '2br', label: '2 Bedroom ($1,600 \u2013 $2,100)' },
    { value: '3br', label: '3 Bedroom ($1,900 \u2013 $2,600)' },
    { value: '4br', label: '4 Bedroom ($2,300 \u2013 $3,000)' },
  ]
}
