import React, { useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"

import { useCart } from "@/contexts/CartContext"
import { env } from "@/lib/env"

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getCartCount, openCart } = useCart()

  const cartCount = getCartCount()
  const brandName = env.branding.name

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
              {brandName}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-2">
            <a
              href="#"
              className="text-sm font-medium text-primary px-4 py-2 rounded-full bg-primary/5 border border-primary/10 transition-colors"
            >
              Hydrocolloid
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-primary px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              Tracking
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-primary px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              Support
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-primary px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              Manage Subscription
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="text-slate-600 hover:text-primary p-2 rounded-full hover:bg-slate-100 transition-colors relative"
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-slate-600 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-primary/5"
            >
              Hydrocolloid
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50"
            >
              Tracking
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50"
            >
              Support
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50"
            >
              Manage Subscription
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
