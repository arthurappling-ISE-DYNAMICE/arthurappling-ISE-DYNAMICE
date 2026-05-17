import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe.server'
import { calculatePrice } from '@/lib/pricing'
import type { PropertyType, UnitSize } from '@/types/order'

const VALID_PROPERTY_TYPES: PropertyType[] = ['apartment', 'single-family']
const VALID_UNIT_SIZES: UnitSize[] = ['studio-1br', '2br', '3br', '4br']

function isPropertyType(v: string): v is PropertyType {
  return VALID_PROPERTY_TYPES.includes(v as PropertyType)
}

function isUnitSize(v: string): v is UnitSize {
  return VALID_UNIT_SIZES.includes(v as UnitSize)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { propertyType, unitSize, address, preferredDate, accessMethod } = body

    // Step 1: All 5 fields must be present and non-empty strings
    if (
      typeof propertyType !== 'string' || !propertyType.trim() ||
      typeof unitSize !== 'string' || !unitSize.trim() ||
      typeof address !== 'string' || !address.trim() ||
      typeof preferredDate !== 'string' || !preferredDate.trim() ||
      typeof accessMethod !== 'string' || !accessMethod.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing or empty required fields: propertyType, unitSize, address, preferredDate, accessMethod' },
        { status: 400 }
      )
    }

    // Step 2: Validate propertyType — type predicate narrows string → PropertyType
    if (!isPropertyType(propertyType)) {
      return NextResponse.json(
        { error: `Invalid propertyType. Must be one of: ${VALID_PROPERTY_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Step 3: Validate unitSize — type predicate narrows string → UnitSize
    if (!isUnitSize(unitSize)) {
      return NextResponse.json(
        { error: `Invalid unitSize. Must be one of: ${VALID_UNIT_SIZES.join(', ')}` },
        { status: 400 }
      )
    }

    // Step 4: Server-side price lookup — client cannot influence amount
    // propertyType and unitSize are fully narrowed by the type predicates above
    const pricing = calculatePrice(propertyType, unitSize)
    if (!pricing) {
      return NextResponse.json(
        { error: 'Invalid property/unit combination' },
        { status: 400 }
      )
    }

    // Step 5: Amount derived exclusively from server-side pricing table.
    // Intentional: we charge priceRange.min as the booking deposit.
    // The display range is shown in metadata (displayPrice) for record clarity.
    const amountInCents = pricing.priceRange.min * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        propertyType,
        unitSize,
        unitLabel: pricing.unitLabel,
        displayPrice: pricing.displayPrice,
        address,
        preferredDate,
        accessMethod,
        verificationRequired: 'true',
        orderedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('[create-payment-intent]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
