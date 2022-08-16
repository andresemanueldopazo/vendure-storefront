import { Product } from '@vercel/commerce/types/product'
import { Cart } from '@vercel/commerce/types/cart'
import { CartFragment, OrderResumeFragment, SearchResultFragment } from '../../schema'
import { OrderResume } from '@vercel/commerce/types/customer'
import { CustomerAddressTypes } from '@vercel/commerce/types/customer/address'
import { ShippingAddress } from '@vercel/commerce/types/shipping/address'

export function normalizeSearchResult(item: SearchResultFragment): Product {
  return {
    id: item.productId,
    name: item.productName,
    description: item.description,
    slug: item.slug,
    path: item.slug,
    images: [
      {
        url: item.productAsset?.preview
          ? item.productAsset?.preview + '?w=800&mode=crop'
          : '',
      },
    ],
    variants: [],
    price: {
      value: (item.priceWithTax as any).min / 100,
      currencyCode: item.currencyCode,
    },
    options: [],
    sku: item.sku,
  }
}

export function normalizeCart(order: CartFragment): Cart & {
  hasShipping: boolean
  hasPayment: boolean
} {
  return {
    id: order.id.toString(),
    createdAt: order.createdAt,
    taxesIncluded: true,
    lineItemsSubtotalPrice: order.subTotalWithTax / 100,
    currency: { code: order.currencyCode },
    subtotalPrice: order.subTotalWithTax / 100,
    totalPrice: order.totalWithTax / 100,
    coupons: order.couponCodes.map((code) => {
      return {code}
    }),
    customerId: order.customer?.id,
    lineItems: order.lines?.map((l) => ({
      id: l.id,
      name: l.productVariant.name,
      quantity: l.quantity,
      url: l.productVariant.product.slug,
      variantId: l.productVariant.id,
      productId: l.productVariant.productId,
      images: [{ url: l.featuredAsset?.preview + '?preset=thumb' || '' }],
      discounts: l.discounts.map((d) => ({
       value: d.amountWithTax / 100,
       description: d.description,
      })),
      path: '',
      variant: {
        id: l.productVariant.id,
        name: l.productVariant.name,
        sku: l.productVariant.sku,
        price: l.proratedLinePriceWithTax / l.quantity / 100,
        listPrice: l.productVariant.priceWithTax / 100,
        image: {
          url: l.featuredAsset?.preview + '?preset=thumb' || '',
        },
        requiresShipping: true,
      },
    })),
    shippingMethodId: order.shippingLines[0]?.shippingMethod.id,
    shippingAddress: order.shippingAddress?
      normalizeShippingAddress(order.shippingAddress) : undefined,
    hasShipping: !!order.shippingAddress?.fullName,
    hasPayment: !!order.billingAddress?.fullName,
  }
}

export function normalizeAddress(
  order: CartFragment
): CustomerAddressTypes['address'] {
  return {
    // TODO: Not sure what should return.
    id: '',
    mask: '',
  }
}

export function normalizeShippingAddress(
  address: NonNullable<CartFragment['shippingAddress']>
): ShippingAddress {
  const fullName = address.fullName || '' 
  const lastIndexOfSpace = fullName.lastIndexOf(' ')
  const firstName = fullName.substring(0, lastIndexOfSpace)
  const lastName = fullName.substring(lastIndexOfSpace+1)
  return {
    firstName,
    lastName,
    company:address.company || '',
    streetLine:address.streetLine1 || '',
    city:address.city || '',
    province:address.province || '',
    postalCode:address.postalCode || '',
    country:address.country || '',
    phoneNumber:address.phoneNumber || '',
  }
}

export function normalizeOrderResume(order: OrderResumeFragment): OrderResume {
  return {
    code: order.code,
    orderPlacedAt: order.orderPlacedAt,
    shippingWithTax: order.shippingWithTax / 100,
    state: order.state,
    totalPrice: order.totalWithTax / 100,
    currency: { code: order.currencyCode },
    shippingAddress: {
      streetLine: order.shippingAddress!.streetLine1!,
      city: order.shippingAddress!.city!,
      province: order.shippingAddress!.province!,
      country: order.shippingAddress!.country!,
    },
    lineItems: order.lines?.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      name: l.productVariant.name,
      variant: {
        price: l.discountedUnitPriceWithTax / 100,
        listPrice: l.unitPriceWithTax / 100,
        image: {
          url: l.featuredAsset?.preview + '?preset=thumb' || '',
        },
      },
      path: '',
    })), 
  }
}
