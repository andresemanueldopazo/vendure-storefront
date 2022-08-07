export type ShippingMethod = {
  id: string
  name: string
  description: string
  priceWithTax: number
}

export type ShippingMethodTypes = {
  data: ShippingMethod
}

export type EligibleShippingMethodsHook<T extends ShippingMethodTypes = ShippingMethodTypes> = {
  data: T['data'][]
  swrState: { isEmpty: boolean }
}
