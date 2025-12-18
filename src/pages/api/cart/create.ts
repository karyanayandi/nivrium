import type { APIRoute } from "astro"
import { GraphQLClient } from "graphql-request"

import { CREATE_CART_MUTATION } from "../../../lib/shopify/queries/cart"
import type { CartCreateResponse } from "../../../lib/shopify/types"

export const POST: APIRoute = async () => {
  try {
    const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !token) {
      console.error("Missing Shopify credentials:", { domain: !!domain, token: !!token })
      return new Response(
        JSON.stringify({
          error: "Missing Shopify credentials. Please check environment configuration.",
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

    if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
      console.error("Shopify cart creation userErrors:", response.cartCreate.userErrors)
      return new Response(
        JSON.stringify({
          error: "Cart creation failed",
          details: response.cartCreate.userErrors.map((e) => e.message).join(", "),
          userErrors: response.cartCreate.userErrors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!response.cartCreate.cart) {
      console.error("Cart creation returned null cart object")
      return new Response(
        JSON.stringify({
          error: "Cart creation returned null. Please check Shopify store configuration.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

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
