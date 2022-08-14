import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import useVerifyCustomerAccount, { UseVerifyCustomerAccount } from '@vercel/commerce/auth/use-verify-customer-account'
import { VerifyCustomerAccountHook } from '../types/verify-customer-account'
import { CommerceError } from '@vercel/commerce/utils/errors'
import { VerifyCustomerAccountMutation, VerifyCustomerAccountMutationVariables } from '../../schema'
import { verifyCustomerAccountMutation } from '../utils/mutations/verify-customer-account-mutation'
import useCustomer from '../customer/use-customer'

export default useVerifyCustomerAccount as UseVerifyCustomerAccount<typeof handler>

export const handler: MutationHook<VerifyCustomerAccountHook> = {
  fetchOptions: {
    query: verifyCustomerAccountMutation,
  },
  async fetcher({ input: { token }, options, fetch }) {
    const variables: VerifyCustomerAccountMutationVariables = {
      token
    }

    const { verifyCustomerAccount } = await fetch<VerifyCustomerAccountMutation>({
      ...options,
      variables,
    })

    if (verifyCustomerAccount.__typename !== 'CurrentUser') {
      throw new CommerceError({message: verifyCustomerAccount.message})
    }
    return null
  },
  useHook:
    ({ fetch }) =>
      () => {
        const { mutate } = useCustomer()

        return useCallback(
          async function verifyCustomer(input) {
            const data = await fetch({ input })
            await mutate()
            return data
          },
          [fetch]
        )
      },
}
