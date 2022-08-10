import useSetShippingAddress, {
  UseSetShippingAddress
} from '@vercel/commerce/shipping/address/use-set-shipping-address'
import type { Address } from '../../types/shipping'
import { CommerceError } from '@vercel/commerce/utils/errors'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import {
  SetOrderShippingAddressMutation,
  SetOrderShippingAddressMutationVariables,
} from '../../../schema'
import { setOrderShippingAddress } from '../../utils/mutations/set-order-shipping-address'


export default useSetShippingAddress as UseSetShippingAddress<typeof handler>

export const handler: MutationHook<Address.SetShippingAddressHook> = {
  fetchOptions: {
    query: setOrderShippingAddress,
  },
  async fetcher({ input, options, fetch }) {
    const variables: SetOrderShippingAddressMutationVariables = {
      input: {
        fullName: `${input?.firstName || ''} ${input.lastName || ''}`,
        company: input.company,
        streetLine1: input.streetLine,
        postalCode: input.postalCode,
        city: input.city,
        province: input.province,
        // TODO: Since country is statically coming as a HongKong
        countryCode: 'JP',
        phoneNumber: input.phoneNumber,
      },
    }
    const { setOrderShippingAddress: data } = await fetch<SetOrderShippingAddressMutation>({
      ...options,
      variables,
    })
    if (data.__typename === 'NoActiveOrderError') {
      throw new CommerceError({
        code: data.errorCode,
        message: data.message,
      })
    }
    return null
  },
  useHook: ({ fetch }) =>
    function useHook() {
      return useCallback(
        async function setShippingAddress(input) {
          return await fetch({ input })
        },
        [fetch]
      )
    },
}
