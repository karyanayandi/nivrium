import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { ADD_CART_LINES_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartLinesAddResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, merchandiseId, quantity } = await request.json()

    if (!cartId || !merchandiseId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !token) {
      return new Response(JSON.stringify({ error: "Missing Shopify credentials" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const client = new GraphQLClient(`https://${domain}/api/2024-01/graphql.json`, {
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
    })

    const response = await client.request<CartLinesAddResponse>(ADD_CART_LINES_MUTATION, {
      cartId,
      lines: [
        {
          merchandiseId,
          quantity: quantity || 1,
        },
      ],
    })

    return new Response(JSON.stringify(response.cartLinesAdd.cart), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart"
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
