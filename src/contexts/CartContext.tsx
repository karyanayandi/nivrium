import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { GraphQLClient } from "graphql-request"

import {
  ADD_CART_LINES_MUTATION,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
} from "@/lib/shopify/queries/cart"
import type {
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesRemoveResponse,
  CartLinesUpdateResponse,
  CartQueryResponse,
  ShopifyCart,
} from "@/lib/shopify/types"

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

const getGraphQLClient = () => {
  const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  return new GraphQLClient(`https://${domain}/api/2024-01/graphql.json`, {
    headers: {
      "X-Shopify-Storefront-Access-Token": token,
      "Content-Type": "application/json",
    },
  })
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    cart: null,
    loading: false,
    error: null,
    isOpen: false,
  })

  const client = getGraphQLClient()

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
      const response = await client.request<CartQueryResponse>(GET_CART_QUERY, {
        cartId,
      })

      if (response.cart) {
        setCart(response.cart)
      } else {
        localStorage.removeItem(CART_ID_KEY)
      }
    } catch (error) {
      console.error("Error restoring cart:", error)
      localStorage.removeItem(CART_ID_KEY)
    }
  }, [])

  useEffect(() => {
    restoreCart()
  }, [restoreCart])

  const createCart = async (variantId: string, quantity: number): Promise<ShopifyCart> => {
    const response = await client.request<CartCreateResponse>(CREATE_CART_MUTATION, {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    })

    if (response.cartCreate.userErrors.length > 0) {
      throw new Error(response.cartCreate.userErrors[0].message)
    }

    if (!response.cartCreate.cart) {
      throw new Error("Failed to create cart")
    }

    return response.cartCreate.cart
  }

  const addItem = async (variantId: string, quantity: number) => {
    setLoading(true)
    setError(null)

    try {
      let cart = state.cart

      if (!cart) {
        cart = await createCart(variantId, quantity)
      } else {
        const response = await client.request<CartLinesAddResponse>(ADD_CART_LINES_MUTATION, {
          cartId: cart.id,
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        })

        if (response.cartLinesAdd.userErrors.length > 0) {
          throw new Error(response.cartLinesAdd.userErrors[0].message)
        }

        if (!response.cartLinesAdd.cart) {
          throw new Error("Failed to add item to cart")
        }

        cart = response.cartLinesAdd.cart
      }

      setCart(cart)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add item to cart"
      setError(message)
      console.error("Error adding item to cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (lineId: string) => {
    if (!state.cart) return

    setLoading(true)
    setError(null)

    try {
      const response = await client.request<CartLinesRemoveResponse>(REMOVE_CART_LINES_MUTATION, {
        cartId: state.cart.id,
        lineIds: [lineId],
      })

      if (response.cartLinesRemove.userErrors.length > 0) {
        throw new Error(response.cartLinesRemove.userErrors[0].message)
      }

      if (!response.cartLinesRemove.cart) {
        throw new Error("Failed to remove item from cart")
      }

      setCart(response.cartLinesRemove.cart)
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
      const response = await client.request<CartLinesUpdateResponse>(UPDATE_CART_LINES_MUTATION, {
        cartId: state.cart.id,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      })

      if (response.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(response.cartLinesUpdate.userErrors[0].message)
      }

      if (!response.cartLinesUpdate.cart) {
        throw new Error("Failed to update quantity")
      }

      setCart(response.cartLinesUpdate.cart)
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
