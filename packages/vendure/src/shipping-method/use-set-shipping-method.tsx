import useSetShippingMethod, { UseSetShippingMethod } from '@vercel/commerce/shipping-method/use-set-shipping-method'
import { SetShippingMethodHook } from '@vercel/commerce/types/shipping-method'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import { setOrderShippingMethod } from '../utils/mutations/set-order-shipping-method'
import {
  SetOrderShippingMethodMutation,
  SetOrderShippingMethodMutationVariables,
} from '../../schema'
import { ValidationError } from '@vercel/commerce/utils/errors'


export default useSetShippingMethod as UseSetShippingMethod<typeof handler>

export const handler: MutationHook<SetShippingMethodHook> = {
  fetchOptions: {
    query: setOrderShippingMethod,
  },
  async fetcher({ input: { id }, options, fetch }) {
    const variables: SetOrderShippingMethodMutationVariables = {
      shippingMethodId: id,
    }
    const { setOrderShippingMethod } = await fetch<SetOrderShippingMethodMutation>({
      ...options,
      variables
    })
    if (setOrderShippingMethod.__typename !== "Order"){
      throw new ValidationError({ message: "Order error"})
    }

    const shippingLine = setOrderShippingMethod.shippingLines[0]
    return {
      id: shippingLine.shippingMethod.id,
      name: shippingLine.shippingMethod.name,
      description: shippingLine.shippingMethod.description,
      priceWithTax: shippingLine.priceWithTax/100,
    }
  },
  useHook: ({ fetch }) =>
    function useHook() {
      return useCallback(
        async function setShippingMethod(input) {
          return await fetch({ input })
        },
        [fetch]
      )
    },
}
