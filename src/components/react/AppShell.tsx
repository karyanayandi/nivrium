import React from "react"

import { CartProvider } from "@/contexts/CartContext"
import type { Product } from "@/types"
import { CartSidebar } from "./CartSidebar"
import { Header } from "./Header"
import { HeroCta } from "./HeroCta"
import { ProductSection } from "./ProductSection"

interface AppShellProps {
  product: Product
}

export const AppShell: React.FC<AppShellProps> = ({ product }) => {
  const defaultVariant = product.variants[1] || product.variants[0]

  return (
    <CartProvider>
      <Header />
      <CartSidebar />
      <div id="hero-cta-container" />
      <HeroCta variantId={defaultVariant.id} />
      <ProductSection product={product} />
    </CartProvider>
  )
}
