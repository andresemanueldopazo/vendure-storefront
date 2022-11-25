import { discountsFragment } from './discount-fragment'
import { orderAddressFragment } from './order-address-fragment'

export const orderResumeFragment = /* GraphQL */ `
  fragment OrderResume on Order {
    code
    orderPlacedAt
    shippingWithTax
    state
    subTotalWithTax
    totalWithTax
    currencyCode
    discounts {
      ...DiscountFragment
    }
    shippingAddress {
      ...OrderAddressFragment
    }
    shippingLines {
      shippingMethod {
        name
        description
      }
      discounts {
        ...DiscountFragment
      }
      priceWithTax
      discountedPriceWithTax
    }
    lines {
      id
      quantity
      linePriceWithTax
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
      items {
        fulfillment {
          state
          method
          trackingCode
        }
      }
    }
    discounts {
      ...DiscountFragment
    }
  }
  ${orderAddressFragment}
  ${discountsFragment}
`
