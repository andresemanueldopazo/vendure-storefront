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
    discounts {
      ...DiscountFragment
    }
    currencyCode
    customer {
      id
    }
    shippingLines {
      shippingMethod {
        id
        name
        description
      }
      priceWithTax
      discountedPriceWithTax
      discounts {
        ...DiscountFragment
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
        product {
          description
        }
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
