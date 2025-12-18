import React, { useEffect } from "react"
import { createPortal } from "react-dom"

import { useCart } from "@/contexts/CartContext"

interface HeroCtaProps {
  variantId: string
}

export const HeroCta: React.FC<HeroCtaProps> = ({ variantId }) => {
  const { addItem, openCart, loading } = useCart()
  const [adding, setAdding] = React.useState(false)
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  useEffect(() => {
    const elem = document.getElementById("hero-cta-slot")
    setContainer(elem)
  }, [])

  const handleClick = async () => {
    setAdding(true)
    try {
      await addItem(variantId, 1)
      openCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAdding(false)
    }
  }

  const button = (
    <button
      onClick={handleClick}
      disabled={adding || loading}
      className="bg-primary transform rounded px-12 py-4 text-sm font-bold tracking-widest text-white uppercase shadow-[0_10px_40px_-10px_rgba(93,95,239,0.5)] transition-all hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-[0_20px_40px_-10px_rgba(93,95,239,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {adding ? "Adding..." : "Get Clear Skin Now"}
    </button>
  )

  if (!container) return null

  return createPortal(button, container)
}
