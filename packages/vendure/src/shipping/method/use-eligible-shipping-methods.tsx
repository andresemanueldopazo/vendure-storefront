import useEligibleShippingMethods, {
  UseEligibleShippingMethods,
} from '@vercel/commerce/shipping/method/use-eligible-shipping-methods'
import type { Method } from '../../types/shipping'
import { SWRHook } from '@vercel/commerce/utils/types'
import { useMemo } from 'react'
import { EligibleShippingMethodsQuery } from '../../../schema'
import { eligibleShippingMethods } from '../../utils/queries/eligible-shipping-methods'


export default useEligibleShippingMethods as UseEligibleShippingMethods<typeof handler>

export const handler: SWRHook<Method.EligibleShippingMethodsHook> = {
  fetchOptions: {
    query: eligibleShippingMethods,
  },
  async fetcher({ options, fetch }) {
    const { eligibleShippingMethods } = await fetch<EligibleShippingMethodsQuery>({
      ...options
    })
    return eligibleShippingMethods.map((method) => {
      return {
        id: method.id,
        name: method.name,
        description: method.description,
        priceWithTax: method.priceWithTax/100,
      }
    })
  },
  useHook: ({ useData }) =>
    function useHook(input) {
      const response = useData({
        swrOptions: {
          revalidateOnFocus: false,
          revalidateIfStale: false,
          ...input?.swrOptions,
        },
      })

      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}
