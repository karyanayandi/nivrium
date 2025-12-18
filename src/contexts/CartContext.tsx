import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

import type { ShopifyCart } from "@/lib/shopify/types"

const CART_ID_KEY = "shopify_cart_id"

interface CartState {
  cart: ShopifyCart | null
  loading: boolean
  error: string | null
  isOpen: boolean
}

interface CartContextType extends CartState {
  addItem: (variantId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  openCart: () => void
  closeCart: () => void
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper function to make API calls to our server-side endpoints
async function apiCall<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "API request failed" }))
    throw new Error(error.error || "API request failed")
  }

  return response.json()
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    cart: null,
    loading: false,
    error: null,
    isOpen: false,
  })

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }

  const setCart = (cart: ShopifyCart | null) => {
    setState((prev) => ({ ...prev, cart }))
    if (cart) {
      localStorage.setItem(CART_ID_KEY, cart.id)
    }
  }

  const restoreCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return

    try {
      // For now, we'll skip cart restoration until we implement a GET endpoint
      // This is a low priority feature as carts are restored when users add items
      // TODO: Add GET cart endpoint if needed
    } catch (error) {
      console.error("Error restoring cart:", error)
      localStorage.removeItem(CART_ID_KEY)
    }
  }, [])

  useEffect(() => {
    restoreCart()
  }, [restoreCart])

  const createCart = async (variantId: string, quantity: number): Promise<ShopifyCart> => {
    console.log("Creating new cart...")
    const cart = await apiCall<ShopifyCart>("/api/cart/create", {})

    if (!cart || !cart.id) {
      throw new Error("Cart creation failed: No cart ID returned")
    }

    console.log("Cart created successfully:", cart.id)
    console.log("Adding item to new cart:", { cartId: cart.id, merchandiseId: variantId, quantity })

    const updatedCart = await apiCall<ShopifyCart>("/api/cart/add", {
      cartId: cart.id,
      merchandiseId: variantId,
      quantity,
    })

    if (!updatedCart || !updatedCart.id) {
      throw new Error("Failed to add item to cart: No cart returned")
    }

    return updatedCart
  }

  const addItem = async (variantId: string, quantity: number) => {
    console.log("Adding item to cart:", { variantId, quantity })
    setLoading(true)
    setError(null)

    try {
      if (!variantId) {
        throw new Error("Variant ID is required")
      }

      let cart = state.cart

      if (!cart) {
        console.log("No existing cart, creating new cart...")
        cart = await createCart(variantId, quantity)
        console.log("Cart created and item added:", cart.id)
      } else {
        console.log("Adding to existing cart:", cart.id)
        console.log("Request details:", { cartId: cart.id, merchandiseId: variantId, quantity })
        cart = await apiCall<ShopifyCart>("/api/cart/add", {
          cartId: cart.id,
          merchandiseId: variantId,
          quantity,
        })
        console.log("Item added to cart:", cart.id, "Total quantity:", cart.totalQuantity)
      }

      if (!cart || !cart.id) {
        throw new Error("Cart operation succeeded but cart object is invalid")
      }

      console.log("Setting cart state with", cart.totalQuantity, "items")
      setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add item to cart"
      setError(message)
      console.error("Error adding item to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (lineId: string) => {
    if (!state.cart) return

    setLoading(true)
    setError(null)

    try {
      const cart = await apiCall<ShopifyCart>("/api/cart/remove", {
        cartId: state.cart.id,
        lineId,
      })

      setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove item"
      setError(message)
      console.error("Error removing item from cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!state.cart) return

    setLoading(true)
    setError(null)

    try {
      const cart = await apiCall<ShopifyCart>("/api/cart/update", {
        cartId: state.cart.id,
        lineId,
        quantity,
      })

      setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update quantity"
      setError(message)
      console.error("Error updating quantity:", error)
    } finally {
      setLoading(false)
    }
  }

  const openCart = () => {
    setState((prev) => ({ ...prev, isOpen: true }))
  }

  const closeCart = () => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }

  const getCartCount = () => {
    return state.cart?.totalQuantity || 0
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
    getCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
