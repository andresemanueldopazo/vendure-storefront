import useSetCustomerAddress, {
  UseSetCustomerAddress
} from '@vercel/commerce/customer/address/use-set-shipping-address'
import type { SetCustomerAddressHook } from '@vercel/commerce/types/customer/address'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import {
  ActiveCustomerQuery,
  CreateCustomerAddressMutation,
  CreateCustomerAddressMutationVariables,
  UpdateCustomerAddressMutation,
  UpdateCustomerAddressMutationVariables,
} from '../../../schema'
import { createCustomerAddressMutation
} from '../../utils/mutations/create-customer-address-mutation'
import { useCustomer } from '../../customer'
import { updateCustomerAddressMutation
} from '../../utils/mutations/update-customer-address-mutation'
import { activeCustomerQuery } from '../../utils/queries/active-customer-query'


export default useSetCustomerAddress as UseSetCustomerAddress<typeof handler>

export const handler: MutationHook<SetCustomerAddressHook> = {
  fetchOptions: {
    query: createCustomerAddressMutation,
  },
  async fetcher({ input, options, fetch }) {
    const { activeCustomer } = await fetch<ActiveCustomerQuery>({
      query: activeCustomerQuery,
    })
    const fullname = `${activeCustomer!.firstName} ${activeCustomer!.lastName}` 
    const address = {
      fullName: fullname,
      company: input.company,
      streetLine1: input.streetLine,
      postalCode: input.postalCode,
      city: input.city,
      province: input.province,
      // TODO: Since country is statically coming as a HongKong
      countryCode: 'JP',
      phoneNumber: input.phoneNumber,
    }

    const id = activeCustomer!.addresses?.length?
      activeCustomer!.addresses[0].id
      :
      await (async () => {
        const variables: CreateCustomerAddressMutationVariables = {
          input: address
        }
        const { createCustomerAddress } = await fetch<CreateCustomerAddressMutation>({
          ...options,
          variables,
        })
        return createCustomerAddress.id
      })()
 
    const variables: UpdateCustomerAddressMutationVariables = {
      input: {
        id,
        ...address,
      },
    }
    const data = await fetch<UpdateCustomerAddressMutation>({
      query: updateCustomerAddressMutation,
      variables,
    })
    console.dir(data)
    return null
  },
  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCustomer()

      return useCallback(
        async function addItem(input) {
          await fetch({ input })
          await mutate()
          return null
        },
        [fetch, mutate]
      )
    },
}
