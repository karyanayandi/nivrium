import { gql } from "graphql-request"

// Fragment for product image
export const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`

export const MONEY_FRAGMENT = gql`
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const VARIANT_FRAGMENT = gql`
  ${MONEY_FRAGMENT}
  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
  }
`

export const PRODUCT_FRAGMENT = gql`
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
  }
`

export const GET_PRODUCT_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
`

export const GET_PRODUCTS_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts($query: String!) {
    products(first: 10, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
`
