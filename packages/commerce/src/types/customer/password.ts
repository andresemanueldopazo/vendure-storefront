import { Customer } from "."

export type Email = {
  email: Customer['email']
}

export type ResetPassword = {
  token: string
  password: string
}

export type PasswordTypes = {
  email: Email
  resetPassword: ResetPassword
}

export type RequestPasswordResetHook<T extends PasswordTypes = PasswordTypes> = {
  data: null
  actionInput: T['email']
  fetcherInput: T['email']
}

export type ResetPasswordHook<T extends PasswordTypes = PasswordTypes> = {
  data: null
  actionInput: T['resetPassword']
  fetcherInput: T['resetPassword']
}
