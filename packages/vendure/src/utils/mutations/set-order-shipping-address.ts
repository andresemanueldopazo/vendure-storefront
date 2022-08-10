import { cartFragment } from '../../utils/fragments/cart-fragment'

export const setOrderShippingAddress = /* GraphQL */ `
  mutation setOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      __typename
      ... on NoActiveOrderError {
        errorCode
        message
      }
    }
  }
`
