import { Discount } from "../common"

export type ShippingMethod = {
  id: string
  name: string
  description: string
  priceWithTax: number
  discountedPriceWithTax: number
  discounts: Discount[]
}

export type ShippingMethodTypes = {
  shippingMethod: ShippingMethod
}

export type SetShippingMethodHook<T extends ShippingMethodTypes = ShippingMethodTypes> = {
  data: null
  fetcherInput: Pick<T['shippingMethod'], 'id'>
  actionInput: Pick<T['shippingMethod'], 'id'>
}

export type EligibleShippingMethodsHook<T extends ShippingMethodTypes = ShippingMethodTypes> = {
  data: Omit<T['shippingMethod'], 'discounts' | 'discountedPriceWithTax'>[]
  swrState: { isEmpty: boolean }
}
