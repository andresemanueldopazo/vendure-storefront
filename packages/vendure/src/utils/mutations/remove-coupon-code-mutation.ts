export const removeCouponCodeMutation = /* GraphQL */ `
  mutation removeCouponCode($couponCode: String!) {
    removeCouponCode(couponCode: $couponCode) {
      __typename
    }
  }
`
