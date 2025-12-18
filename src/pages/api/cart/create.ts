import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { CREATE_CART_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartCreateResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async () => {
  try {
    // Access env variables directly in the route
    const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    console.log("Environment check:", {
      hasDomain: !!domain,
      hasToken: !!token,
      domain: domain ? `${domain.substring(0, 10)}...` : "missing",
    })

    if (!domain || !token) {
      return new Response(
        JSON.stringify({
          error: "Missing Shopify credentials",
          details: `domain: ${!!domain}, token: ${!!token}`,
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

    const response = await client.request<CartCreateResponse>(CREATE_CART_MUTATION, {
      input: {},
    })

    return new Response(JSON.stringify(response.cartCreate.cart), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating cart:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create cart"
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error("Error details:", errorDetails)

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
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
