import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import { ValidationError } from '@vercel/commerce/utils/errors'
import useResetPassword, {
  UseResetPassword
} from '@vercel/commerce/customer/password/use-reset-password'
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from '../../../schema'
import { Password } from '../../types/customer'
import { resetPasswordMutation } from '../../utils/mutations/reset-password-mutation'
import useCustomer from '../../customer/use-customer'


export default useResetPassword as UseResetPassword<typeof handler>

export const handler: MutationHook<Password.ResetPasswordHook> = {
  fetchOptions: {
    query: resetPasswordMutation,
  },
  async fetcher({ input: { token, password }, options, fetch }) {
    const variables: ResetPasswordMutationVariables = {
      token,
      password,
    }
    const { resetPassword } = await fetch<ResetPasswordMutation>({
      ...options,
      variables,
    })
    if (resetPassword?.__typename !== "CurrentUser") {
      throw new ValidationError(resetPassword)
    }

    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCustomer()

      return useCallback(
        async function resetPassword(input) {
          await fetch({ input })
          await mutate()
          return null
        },
        [fetch]
      )
    },
}
