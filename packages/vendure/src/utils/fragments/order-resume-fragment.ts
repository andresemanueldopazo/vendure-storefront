export const orderResumeFragment = /* GraphQL */ `
  fragment OrderResume on Order {
    code
    orderPlacedAt
    shippingWithTax
    state
    totalWithTax
    currencyCode
    shippingAddress {
      streetLine1
      city
      province
      country
    }
    lines {
      id
      quantity
      productVariant {
        name
        product {
          description
        }
      }
      discountedUnitPriceWithTax
      unitPriceWithTax
      featuredAsset {
        preview
      }
    }
  }
`
