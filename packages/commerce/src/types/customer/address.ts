export interface CustomerAddress {

  company: string
  streetLine: string
  city: string
  province: string
  postalCode: string
  country: string
  phoneNumber: string
}

export type CustomerAddressTypes = {
  address: CustomerAddress
}

export type SetCustomerAddressHook<T extends CustomerAddressTypes = CustomerAddressTypes> = {
  data: null
  fetcherInput: T['address']
  actionInput: T['address']
}
