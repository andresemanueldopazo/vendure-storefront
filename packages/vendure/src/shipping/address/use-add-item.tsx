import useAddItem, {
  UseAddItem
} from '@vercel/commerce/shipping/address/use-add-item'
import type { Address } from '../../types/shipping'
import { CommerceError } from '@vercel/commerce/utils/errors'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import {
  ActiveOrderResult,
  MutationSetOrderShippingAddressArgs,
} from '../../../schema'
import { setOrderShippingAddress } from '../../utils/mutations/set-order-shipping-address'
import { normalizeAddress } from '../../utils/normalize'


export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<Address.AddItemHook> = {
  fetchOptions: {
    query: setOrderShippingAddress,
  },
  async fetcher({ input: item, options, fetch }) {
    const variables: MutationSetOrderShippingAddressArgs = {
      input: {
        fullName: `${item.firstName || ''} ${item.lastName || ''}`,
        company: item.company,
        streetLine1: item.streetNumber,
        streetLine2: item.apartments,
        postalCode: item.zipCode,
        city: item.city,
        // TODO: Since country is statically coming as a HongKong
        countryCode: 'JP',
      },
    }
    const data = await fetch<ActiveOrderResult>({
      ...options,
      variables,
    })
    if (data.__typename === 'Order') {
      return normalizeAddress(data)
    } else if (data.__typename === 'NoActiveOrderError') {
      throw new CommerceError({
        code: data.errorCode,
        message: data.message,
      })
    }
  },
  useHook: ({ fetch }) =>
    function useHook() {
      return useCallback(
        async function addItem(input) {
          return await fetch({ input })
        },
        [fetch]
      )
    },
}
