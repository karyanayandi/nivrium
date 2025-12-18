import type { Product, ProductImage, ProductVariant } from "@/types"
import { shopifyClient } from "./client"
import { GET_PRODUCT_QUERY, GET_PRODUCTS_QUERY } from "./queries/product"
import type { ProductQueryResponse, ShopifyProduct } from "./types"

function parsePrice(priceString: string): number {
  return parseFloat(priceString)
}

function transformImage(shopifyImage: any): ProductImage {
  return {
    id: shopifyImage.id,
    url: shopifyImage.url,
    altText: shopifyImage.altText,
  }
}

function transformVariant(shopifyVariant: any): ProductVariant {
  return {
    id: shopifyVariant.id,
    title: shopifyVariant.title,
    price: parsePrice(shopifyVariant.price.amount),
    compareAtPrice: shopifyVariant.compareAtPrice
      ? parsePrice(shopifyVariant.compareAtPrice.amount)
      : null,
    availableForSale: shopifyVariant.availableForSale,
    quantityAvailable: shopifyVariant.quantityAvailable || 0,
  }
}

function transformProduct(shopifyProduct: ShopifyProduct): Product {
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    images: shopifyProduct.images.edges.map((edge) => transformImage(edge.node)),
    variants: shopifyProduct.variants.edges.map((edge) => transformVariant(edge.node)),
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await shopifyClient.request<ProductQueryResponse>(GET_PRODUCT_QUERY, {
      handle,
    })

    if (!response.product) {
      console.error(`Product with handle "${handle}" not found`)
      return null
    }

    return transformProduct(response.product)
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error(
      `Failed to fetch product: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function getGiftProducts(tag: string = "free-gift"): Promise<Product[]> {
  try {
    const response = await shopifyClient.request<{
      products: { edges: Array<{ node: ShopifyProduct }> }
    }>(GET_PRODUCTS_QUERY, {
      query: `tag:${tag}`,
    })

    if (!response.products || response.products.edges.length === 0) {
      console.warn(`No products found with tag "${tag}"`)
      return []
    }

    return response.products.edges.map((edge) => transformProduct(edge.node))
  } catch (error) {
    console.error("Error fetching gift products:", error)
    return []
  }
}
