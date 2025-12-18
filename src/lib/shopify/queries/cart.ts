import { gql } from "graphql-request"

import { IMAGE_FRAGMENT, MONEY_FRAGMENT } from "./product"

export const CART_LINE_FRAGMENT = gql`
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  fragment CartLineFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          title
          handle
        }
        image {
          ...ImageFragment
        }
        price {
          ...MoneyFragment
        }
      }
    }
    cost {
      totalAmount {
        ...MoneyFragment
      }
      subtotalAmount {
        ...MoneyFragment
      }
    }
  }
`

export const CART_FRAGMENT = gql`
  ${CART_LINE_FRAGMENT}
  ${MONEY_FRAGMENT}
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      edges {
        node {
          ...CartLineFragment
        }
      }
    }
    cost {
      totalAmount {
        ...MoneyFragment
      }
      subtotalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
    }
  }
`

export const CREATE_CART_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const ADD_CART_LINES_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const UPDATE_CART_LINES_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const REMOVE_CART_LINES_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const GET_CART_QUERY = gql`
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`
