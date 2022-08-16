import { discountsFragment } from './discount-fragment'
import { orderAddressFragment } from './order-address-fragment'

export const cartFragment = /* GraphQL */ `
  fragment Cart on Order {
    id
    code
    state
    createdAt
    totalQuantity
    subTotalWithTax
    totalWithTax
    couponCodes
    currencyCode
    customer {
      id
    }
    shippingLines {
      shippingMethod {
        id
      }
    }
    shippingAddress {
      ...OrderAddressFragment
    }
    billingAddress {
      ...OrderAddressFragment
    }
    lines {
      id
      quantity
      proratedLinePriceWithTax
      discounts {
        ...DiscountFragment
      }
      featuredAsset {
        id
        preview
      }
      productVariant {
        id
        name
        sku
        priceWithTax
        stockLevel
        product {
          slug
        }
        productId
      }
    }
  }
  ${orderAddressFragment}
  ${discountsFragment}
`
