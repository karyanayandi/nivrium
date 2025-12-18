import React from "react"

import { CartProvider } from "@/contexts/CartContext"
import type { Product } from "@/types"
import { CartSidebar } from "./CartSidebar"
import { Header } from "./Header"
import { ProductSection } from "./ProductSection"

interface AppShellProps {
  product: Product
}

export const AppShell: React.FC<AppShellProps> = ({ product }) => {
  return (
    <CartProvider>
      <Header />
      <CartSidebar />
      <ProductSection product={product} />
    </CartProvider>
  )
}
