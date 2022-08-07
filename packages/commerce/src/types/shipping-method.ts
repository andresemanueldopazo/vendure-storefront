export type ShippingMethod = {
  id: string
  name: string
  description: string
  priceWithTax: number
}

export type ShippingMethodTypes = {
  shippingMethod: ShippingMethod
}

export type SetShippingMethodHook<T extends ShippingMethodTypes = ShippingMethodTypes> = {
  data: T['shippingMethod']
  fetcherInput: Pick<T['shippingMethod'], 'id'>
  actionInput: Pick<T['shippingMethod'], 'id'>
}

export type EligibleShippingMethodsHook<T extends ShippingMethodTypes = ShippingMethodTypes> = {
  data: T['shippingMethod'][]
  swrState: { isEmpty: boolean }
}
