import useAddItem, {
  UseAddItem
} from '@vercel/commerce/customer/address/use-add-item'
import type { AddItemHook } from '@vercel/commerce/types/customer/address'
import { CommerceError } from '@vercel/commerce/utils/errors'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import { setOrderShippingMethod } from '../../utils/mutations/set-order-shipping-method'
import { eligibleShippingMethods } from '../../utils/queries/eligible-shipping-methods'
import {
  ActiveOrderResult,
  EligibleShippingMethodsQuery,
  MutationSetOrderShippingAddressArgs,
  SetOrderShippingMethodResult
} from '../../../schema'
import { setOrderShippingAddress } from '../../utils/mutations/set-order-shipping-address'
import { normalizeAddress } from '../../utils/normalize'
import useAddresses from './use-addresses'


export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    query: setOrderShippingAddress,
  },
  async fetcher({ input: item, options, fetch }) {
    // Shipping method choice to allow proof of Stripe payment
    const eligibleMethods = await fetch<EligibleShippingMethodsQuery>({
      query: eligibleShippingMethods,
    })
    const shippingMethodId =
      eligibleMethods?.['eligibleShippingMethods']?.[0].id
    if (shippingMethodId) {
      await fetch<SetOrderShippingMethodResult>({
        query: setOrderShippingMethod,
        variables: {
          shippingMethodId,
        },
      })
    }

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
      const { mutate } = useAddresses()

      return useCallback(
        async function addItem(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}
