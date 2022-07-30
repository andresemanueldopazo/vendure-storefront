export const orderResumeFragment = /* GraphQL */ `
  fragment OrderResume on Order {
    code
    orderPlacedAt
    shippingWithTax
    state
    totalWithTax
    currencyCode
    lines {
      id
      quantity
      productVariant {
        name
      }
      discountedUnitPriceWithTax
      unitPriceWithTax
      featuredAsset {
        preview
      }
    }
  }
`
