import { cartFragment } from '../../utils/fragments/cart-fragment'

export const setOrderShippingMethod = /* GraphQL */ `
  mutation setOrderShippingMethod($shippingMethodId: ID!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      __typename
      ... on Order {
        shippingLines {
          shippingMethod {
            id
            name
            description
          }
          priceWithTax
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on IneligibleShippingMethodError {
        errorCode
        message
      }
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`
