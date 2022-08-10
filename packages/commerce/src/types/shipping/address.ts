export interface Address {
  id: string
  mask: string
}

export interface AddressFields {
  type: string
  firstName: string
  lastName: string
  company: string
  streetNumber: string
  apartments: string
  zipCode: string
  city: string
  country: string
}

export type ShippingAddressTypes = {
  address?: Address
  fields: AddressFields
}

export type SetShippingAddressHook<T extends ShippingAddressTypes = ShippingAddressTypes> = {
  data: T['address']
  input?: T['fields']
  fetcherInput: T['fields']
  body: { item: T['fields'] }
  actionInput: T['fields']
}
