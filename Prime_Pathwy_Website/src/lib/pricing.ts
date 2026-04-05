import type { PropertyType, UnitSize, PriceRange, PriceCalculation } from '@/types/order'

// The $1,000+ verification gate threshold from the Prime Pathwy SOP Section 2.
// Every standard unit in the price table exceeds this threshold, so verification
// is required for all orders. Exported so tests can assert this invariant.
export const VERIFICATION_GATE_THRESHOLD = 1000 as const

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

// Deterministic dollar formatter — no ICU dependency.
// All prices are whole-dollar values; no fraction digits needed.
function formatDollars(n: number): string {
  return n.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })
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
    displayPrice: `$${formatDollars(range.min)} \u2013 $${formatDollars(range.max)}`,
  }
}

export function getUnitSizes(
  propertyType: PropertyType
): { value: UnitSize; label: string }[] {
  const sizes: UnitSize[] =
    propertyType === 'apartment'
      ? ['studio-1br', '2br', '3br']
      : ['2br', '3br', '4br']

  return sizes.map((value) => {
    const pricing = calculatePrice(propertyType, value)!
    return {
      value,
      label: `${pricing.unitLabel} (${pricing.displayPrice})`,
    }
  })
}
