import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import { ValidationError } from '@vercel/commerce/utils/errors'
import useRequestPasswordReset, {
  UseRequestPasswordReset
} from '@vercel/commerce/customer/password/use-request-password-reset'
import {
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables,
} from '../../../schema'
import { Password } from '../../types/customer'
import { requestPasswordResetMutation } from '../../utils/mutations/request-password-reset-mutation'


export default useRequestPasswordReset as UseRequestPasswordReset<typeof handler>

export const handler: MutationHook<Password.RequestPasswordResetHook> = {
  fetchOptions: {
    query: requestPasswordResetMutation,
  },
  async fetcher({ input: { email }, options, fetch }) {
    const variables: RequestPasswordResetMutationVariables = {
      emailAddress: email,
    }
    const { requestPasswordReset } = await fetch<RequestPasswordResetMutation>({
      ...options,
      variables,
    })
    if (requestPasswordReset?.__typename !== 'Success') {
      throw new ValidationError(requestPasswordReset || { message: "Unknown error" })
    }

    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      return useCallback(
        async function requestPasswordReset(input) {
          await fetch({ input })
          return null
        },
        [fetch]
      )
    },
}
