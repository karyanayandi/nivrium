export interface PricingOption {
  id: number
  label: string
  pricePerUnit: number
  totalPrice: number
  originalPrice: number
  isPopular?: boolean
  isBestValue?: boolean
  count: number
  shopifyVariantId?: string
}

export interface Gift {
  name: string
  description: string
  image: string
  value: number
  isLocked: boolean
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductImage {
  id: string
  url: string
  altText: string | null
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  compareAtPrice: number | null
  availableForSale: boolean
  quantityAvailable: number
}
