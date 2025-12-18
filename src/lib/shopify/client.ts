import { GraphQLClient } from "graphql-request"

const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!domain) {
  throw new Error("Missing required environment variable: PUBLIC_SHOPIFY_STORE_DOMAIN")
}

if (!storefrontAccessToken) {
  throw new Error("Missing required environment variable: SHOPIFY_STOREFRONT_ACCESS_TOKEN")
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
})
