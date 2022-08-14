export type VerifyCustomerAccountBody = {
  token: string
}

export type VerifyCustomerAccountTypes = {
  body: VerifyCustomerAccountBody
}

export type VerifyCustomerAccountHook<T extends VerifyCustomerAccountTypes = VerifyCustomerAccountTypes> = {
  data: null
  actionInput: T['body']
  fetcherInput: T['body']
  body: T['body']
}
