import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { ADD_CART_LINES_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartLinesAddResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cartId, merchandiseId, quantity } = await request.json()

    if (!cartId || !merchandiseId) {
      console.error("Missing required fields:", {
        cartId: !!cartId,
        merchandiseId: !!merchandiseId,
      })
      return new Response(
        JSON.stringify({
          error: "Missing required fields: cartId and merchandiseId are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !token) {
      console.error("Missing Shopify credentials:", { domain: !!domain, token: !!token })
      return new Response(
        JSON.stringify({
          error: "Missing Shopify credentials. Please check environment configuration.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
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

    if (response.cartLinesAdd.userErrors && response.cartLinesAdd.userErrors.length > 0) {
      console.error("Shopify add to cart userErrors:", response.cartLinesAdd.userErrors)
      return new Response(
        JSON.stringify({
          error: "Failed to add item to cart",
          details: response.cartLinesAdd.userErrors.map((e) => e.message).join(", "),
          userErrors: response.cartLinesAdd.userErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!response.cartLinesAdd.cart) {
      console.error("Add to cart returned null cart object")
      return new Response(
        JSON.stringify({
          error: "Add to cart operation returned null. Please check cart ID and variant ID.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return new Response(JSON.stringify(response.cartLinesAdd.cart), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart"
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error("Error details:", errorDetails)

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: import.meta.env.DEV ? errorDetails : undefined,
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
