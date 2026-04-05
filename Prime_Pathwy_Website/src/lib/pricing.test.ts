import { describe, it, expect } from 'vitest'
import { calculatePrice, getUnitSizes, VERIFICATION_GATE_THRESHOLD } from './pricing'

describe('calculatePrice — apartments', () => {
  it('studio-1br: $1,200 – $1,600', () => {
    const r = calculatePrice('apartment', 'studio-1br')
    expect(r).not.toBeNull()
    expect(r!.priceRange).toEqual({ min: 1200, max: 1600 })
    expect(r!.displayPrice).toBe('$1,200 \u2013 $1,600')
    expect(r!.unitLabel).toBe('Studio / 1 Bedroom')
  })

  it('2br: $1,500 – $2,000', () => {
    const r = calculatePrice('apartment', '2br')
    expect(r!.priceRange).toEqual({ min: 1500, max: 2000 })
    expect(r!.displayPrice).toBe('$1,500 \u2013 $2,000')
  })

  it('3br: $1,800 – $2,400', () => {
    const r = calculatePrice('apartment', '3br')
    expect(r!.priceRange).toEqual({ min: 1800, max: 2400 })
    expect(r!.displayPrice).toBe('$1,800 \u2013 $2,400')
  })

  it('invalid size (4br) returns null for apartment', () => {
    expect(calculatePrice('apartment', '4br' as any)).toBeNull()
  })
})

describe('calculatePrice — single-family', () => {
  it('2br: $1,600 – $2,100', () => {
    const r = calculatePrice('single-family', '2br')
    expect(r!.priceRange).toEqual({ min: 1600, max: 2100 })
    expect(r!.displayPrice).toBe('$1,600 \u2013 $2,100')
  })

  it('3br: $1,900 – $2,600', () => {
    const r = calculatePrice('single-family', '3br')
    expect(r!.priceRange).toEqual({ min: 1900, max: 2600 })
    expect(r!.displayPrice).toBe('$1,900 \u2013 $2,600')
  })

  it('4br: $2,300 – $3,000', () => {
    const r = calculatePrice('single-family', '4br')
    expect(r!.priceRange).toEqual({ min: 2300, max: 3000 })
    expect(r!.displayPrice).toBe('$2,300 \u2013 $3,000')
  })

  it('invalid size (studio-1br) returns null for single-family', () => {
    expect(calculatePrice('single-family', 'studio-1br' as any)).toBeNull()
  })
})

describe('getUnitSizes', () => {
  it('apartment returns 3 options', () => {
    const sizes = getUnitSizes('apartment')
    expect(sizes).toHaveLength(3)
    expect(sizes[0].value).toBe('studio-1br')
    expect(sizes[0].label).toContain('$1,200')
    expect(sizes[2].value).toBe('3br')
  })

  it('single-family returns 3 options', () => {
    const sizes = getUnitSizes('single-family')
    expect(sizes).toHaveLength(3)
    expect(sizes[0].value).toBe('2br')
    expect(sizes[2].value).toBe('4br')
    expect(sizes[2].label).toContain('$2,300')
  })
})

describe('VERIFICATION_GATE_THRESHOLD', () => {
  it('is set to 1000', () => {
    expect(VERIFICATION_GATE_THRESHOLD).toBe(1000)
  })

  it('every apartment price min exceeds the threshold', () => {
    const apartmentSizes = getUnitSizes('apartment')
    for (const size of apartmentSizes) {
      const result = calculatePrice('apartment', size.value as any)
      expect(result!.priceRange.min).toBeGreaterThan(VERIFICATION_GATE_THRESHOLD)
    }
  })

  it('every single-family price min exceeds the threshold', () => {
    const homeSizes = getUnitSizes('single-family')
    for (const size of homeSizes) {
      const result = calculatePrice('single-family', size.value as any)
      expect(result!.priceRange.min).toBeGreaterThan(VERIFICATION_GATE_THRESHOLD)
    }
  })
})
