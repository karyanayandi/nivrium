export interface MoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface SelectedOption {
  name: string
  value: string
}

export interface ShopifyVariant {
  id: string
  title: string
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
  availableForSale: boolean
  selectedOptions: SelectedOption[]
  quantityAvailable: number
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  images: {
    edges: Array<{
      node: ShopifyImage
    }>
  }
  variants: {
    edges: Array<{
      node: ShopifyVariant
    }>
  }
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle: string
    }
    image: ShopifyImage | null
    price: MoneyV2
  }
  cost: {
    totalAmount: MoneyV2
    subtotalAmount: MoneyV2
  }
}

export interface CartCost {
  totalAmount: MoneyV2
  subtotalAmount: MoneyV2
  totalTaxAmount: MoneyV2 | null
  totalDutyAmount: MoneyV2 | null
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: CartLine
    }>
  }
  cost: CartCost
  totalQuantity: number
}

export interface ProductQueryResponse {
  product: ShopifyProduct | null
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export interface CartQueryResponse {
  cart: ShopifyCart | null
}
