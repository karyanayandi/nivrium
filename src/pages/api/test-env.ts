import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  return new Response(
    JSON.stringify({
      hasDomain: !!domain,
      hasToken: !!token,
      domainLength: domain?.length || 0,
      tokenLength: token?.length || 0,
      allEnvKeys: Object.keys(import.meta.env).filter((k) => k.includes("SHOPIFY")),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}
