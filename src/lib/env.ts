export const env = {
  shopify: {
    domain: import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || "",
    storefrontToken: import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
    productHandle: import.meta.env.SHOPIFY_PRODUCT_HANDLE || "hydrocolloid-treatment",
  },
  branding: {
    name: import.meta.env.PUBLIC_BRAND_NAME || "Nivrium",
  },
  site: {
    title: import.meta.env.PUBLIC_SITE_TITLE || "Nivrium - Premium Hydrocolloid Treatment",
    description:
      import.meta.env.PUBLIC_SITE_DESCRIPTION ||
      "Get clearer, smoother, and acne-free skin overnight.",
    url: import.meta.env.PUBLIC_SITE_URL || "",
    ogImage: import.meta.env.PUBLIC_OG_IMAGE || "/og-image.png",
  },
  hero: {
    title:
      import.meta.env.PUBLIC_HERO_TITLE || "Get Clearer, Smoother, and Acne Free Skin Overnight.",
    subtitle: import.meta.env.PUBLIC_HERO_SUBTITLE || "Are you ready to look your best?",
    guaranteeDays: Number(import.meta.env.PUBLIC_GUARANTEE_DAYS) || 90,
    productRating: Number(import.meta.env.PUBLIC_PRODUCT_RATING) || 4.9,
    reviewCount: Number(import.meta.env.PUBLIC_REVIEW_COUNT) || 1842,
  },
  sale: {
    bannerText: import.meta.env.PUBLIC_SALE_BANNER_TEXT || "",
  },
  social: {
    twitter: import.meta.env.PUBLIC_TWITTER_HANDLE || "@nivrium",
    facebook: import.meta.env.PUBLIC_FACEBOOK_URL || "https://facebook.com/nivrium",
    instagram: import.meta.env.PUBLIC_INSTAGRAM_HANDLE || "@nivrium",
  },
}

export function validateRequiredEnv() {
  const required = [
    { key: "PUBLIC_SHOPIFY_STORE_DOMAIN", value: env.shopify.domain },
    { key: "SHOPIFY_STOREFRONT_ACCESS_TOKEN", value: env.shopify.storefrontToken },
  ]

  const missing = required.filter((item) => !item.value)

  if (missing.length > 0) {
    const missingKeys = missing.map((item) => item.key).join(", ")
    throw new Error(
      `Missing required environment variables: ${missingKeys}. Please check your .env file.`,
    )
  }
}
