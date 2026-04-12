export type PropertyType = 'apartment' | 'single-family'
export type UnitSize = 'studio-1br' | '2br' | '3br' | '4br'

export interface PriceRange {
  min: number
  max: number
}

export interface PriceCalculation {
  unitLabel: string
  priceRange: PriceRange
  displayPrice: string
}

export interface OrderAddons {
  disposal: boolean
  extremeConditions: boolean
}

export interface ServiceDetails {
  address: string
  preferredDate: string
  accessMethod: 'keys' | 'lockbox' | 'codes' | ''
}

export type OrderStep = 1 | 2 | 3 | 4 | 5

export interface OrderFormState {
  step: OrderStep
  propertyType: PropertyType | null
  unitSize: UnitSize | null
  addons: OrderAddons
  serviceDetails: ServiceDetails
  agreementAccepted: boolean
}
