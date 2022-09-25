import { useCallback } from 'react'
import useUpdateCustomer, { UseUpdateCustomer } from '@vercel/commerce/customer/use-update-customer'
import { UpdateCustomerHook } from '@vercel/commerce/types/customer'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { UpdateCustomerMutation, UpdateCustomerMutationVariables } from '../../schema'
import { useCustomer } from '../customer'
import { updateCustomerMutation } from '../utils/mutations/update-customer-mutation'


export default useUpdateCustomer as UseUpdateCustomer<typeof handler>

export const handler: MutationHook<UpdateCustomerHook> = {
  fetchOptions: {
    query: updateCustomerMutation,
  },
  async fetcher({ input, options, fetch }) {
    const variables: UpdateCustomerMutationVariables = {
      input: {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: String(input.phoneNumber),
      },
    }

    await fetch<UpdateCustomerMutation>({
      ...options,
      variables,
    })

    return null
  },
  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCustomer()

      return useCallback(
        async function updateItem(input) {
          await fetch({ input })
          await mutate()
          return null
        },
        [fetch, mutate]
      )
    },
}
