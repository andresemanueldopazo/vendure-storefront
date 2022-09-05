import { Customer } from "."

export type Email = {
  email: Customer['email']
}

export type PasswordTypes = {
  email: Email
}

export type RequestPasswordResetHook<T extends PasswordTypes = PasswordTypes> = {
  data: null
  actionInput: T['email']
  fetcherInput: T['email']
}
