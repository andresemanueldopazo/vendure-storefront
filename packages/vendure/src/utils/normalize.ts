import { Product } from '@vercel/commerce/types/product'
import { Cart } from '@vercel/commerce/types/cart'
import { ActiveCustomerQuery, CartFragment, OrderResumeFragment, SearchResultFragment } from '../../schema'
import { OrderResume } from '@vercel/commerce/types/customer'
import { CustomerAddress } from '@vercel/commerce/types/customer/address'
import { ShippingAddress } from '@vercel/commerce/types/shipping/address'
import { Discount } from '@vercel/commerce/types/common'
import { ShippingMethod } from '@vercel/commerce/types/shipping/method'

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
    discounts: order.discounts.map(normalizeDiscount),
    customerId: order.customer?.id,
    lineItems: order.lines?.map((l) => ({
      id: l.id,
      name: l.productVariant.name,
      description: l.productVariant.product.description,
      quantity: l.quantity,
      url: l.productVariant.product.slug,
      variantId: l.productVariant.id,
      productId: l.productVariant.productId,
      images: [{ url: l.featuredAsset?.preview + '?preset=thumb' || '' }],
      discounts: l.discounts.map(normalizeDiscount),
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
    shippingMethod: order.shippingLines[0]? 
      normalizeShippingMethod(order.shippingLines[0]) 
      : undefined,
    shippingAddress: order.shippingAddress?
      normalizeShippingAddress(order.shippingAddress) : undefined,
    hasShipping: !!order.shippingAddress?.fullName,
    hasPayment: !!order.billingAddress?.fullName,
  }
}

export function normalizeShippingMethod(
  shipping: NonNullable<CartFragment['shippingLines'][number]>
): ShippingMethod {
  return {
    id: shipping.shippingMethod.id,
    name: shipping.shippingMethod.name,
    description: shipping.shippingMethod.description,
    priceWithTax: shipping.priceWithTax / 100,
    discountedPriceWithTax: shipping.discountedPriceWithTax / 100,
    discounts: shipping.discounts.map(normalizeDiscount),
  }
}

export function normalizeDiscount(
  discount: NonNullable<CartFragment['shippingLines'][number]['discounts'][number]>
): Discount {
  return {
    value: discount.amountWithTax / 100,
    description: discount.description,
  }
}

export function normalizeCustomerAddress(
  address: NonNullable<NonNullable<ActiveCustomerQuery['activeCustomer']>['addresses']>[number]
): CustomerAddress {
  return {
    company: address.company || '',
    streetLine: address.streetLine1 || '',
    city: address.city || '',
    province: address.province || '',
    postalCode: address.postalCode || '',
    country: address.country.name || '',
    phoneNumber: address.phoneNumber || '',
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
  const orderPlacedAt = new Date(order.orderPlacedAt)
  const [month, day, year] = [orderPlacedAt.getMonth(), orderPlacedAt.getDate(), orderPlacedAt.getFullYear()]
  return {
    code: order.code,
    orderPlacedAt: year + "/" + month + "/" + day,
    shippingWithTax: order.shippingWithTax / 100,
    state: order.state.split(/(?=[A-Z])/).reduce(
      (previousValue, currentValue) => previousValue + " " +  currentValue.toLowerCase()
    ),
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
      description: l.productVariant.product.description,
      variant: {
        price: l.discountedUnitPriceWithTax / 100,
        listPrice: l.unitPriceWithTax / 100,
        image: l.featuredAsset?.preview ?
          { url: l.featuredAsset.preview + '?preset=thumb' || '' } : undefined  
      },
      path: '',
    })), 
  }
}
