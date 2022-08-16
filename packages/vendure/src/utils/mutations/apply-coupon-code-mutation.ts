export const applyCouponCodeMutation = /* GraphQL */ `
  mutation applyCouponCode($couponCode: String!) {
    applyCouponCode(couponCode: $couponCode) {
      __typename
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`
