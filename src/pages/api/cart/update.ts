import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { UPDATE_CART_LINES_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartLinesUpdateResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, lineId, quantity } = await request.json()

    console.log("Update cart request:", { cartId, lineId, quantity })

    if (!cartId || !lineId || quantity === undefined) {
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

    const response = await client.request<CartLinesUpdateResponse>(UPDATE_CART_LINES_MUTATION, {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    })

    console.log("Cart updated successfully:", response.cartLinesUpdate.cart?.totalQuantity, "items")

    if (response.cartLinesUpdate.userErrors && response.cartLinesUpdate.userErrors.length > 0) {
      console.error("Shopify user errors:", response.cartLinesUpdate.userErrors)
      return new Response(
        JSON.stringify({
          error: response.cartLinesUpdate.userErrors[0].message,
          userErrors: response.cartLinesUpdate.userErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!response.cartLinesUpdate.cart) {
      return new Response(JSON.stringify({ error: "Cart update failed" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    return new Response(JSON.stringify(response.cartLinesUpdate.cart), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to update cart"
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
