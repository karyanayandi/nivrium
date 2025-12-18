export interface PricingOption {
  id: number
  label: string
  pricePerUnit: number
  totalPrice: number
  originalPrice: number
  isPopular?: boolean
  isBestValue?: boolean
  count: number
}

export interface Gift {
  name: string
  description: string
  image: string
  value: number
  isLocked: boolean
}
