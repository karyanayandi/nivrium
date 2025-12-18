import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { REMOVE_CART_LINES_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartLinesRemoveResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, lineId } = await request.json()

    if (!cartId || !lineId) {
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

    const response = await client.request<CartLinesRemoveResponse>(REMOVE_CART_LINES_MUTATION, {
      cartId,
      lineIds: [lineId],
    })

    return new Response(JSON.stringify(response.cartLinesRemove.cart), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to remove item from cart"
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
