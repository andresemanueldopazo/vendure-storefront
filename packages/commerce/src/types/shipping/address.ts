export type ShippingAddress = {
  firstName: string
  lastName: string
  company?: string
  streetLine: string
  city: string
  province: string
  postalCode: string
  country: string
  phoneNumber: string
}

export type ShippingAddressTypes = {
  shippingAddress: ShippingAddress
}

export type GetShippingAddressHook<
  T extends ShippingAddressTypes = ShippingAddressTypes
> = {
  data: T['shippingAddress'] | null
  swrState: { isEmpty: boolean }
}

export type SetShippingAddressHook<T extends ShippingAddressTypes = ShippingAddressTypes> = {
  data: null
  fetcherInput: T['shippingAddress']
  body: { item: T['shippingAddress'] }
  actionInput: T['shippingAddress']
}
