import useSetShippingMethod, { UseSetShippingMethod } from '@vercel/commerce/shipping/method/use-set-shipping-method'
import type { Method } from '../../types/shipping'
import type { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import { useCart } from '../../cart'
import { setOrderShippingMethod } from '../../utils/mutations/set-order-shipping-method'
import {
  SetOrderShippingMethodMutation,
  SetOrderShippingMethodMutationVariables,
} from '../../../schema'
import { ValidationError } from '@vercel/commerce/utils/errors'


export default useSetShippingMethod as UseSetShippingMethod<typeof handler>

export const handler: MutationHook<Method.SetShippingMethodHook> = {
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
    console.dir(setOrderShippingMethod)
    if (setOrderShippingMethod.__typename !== "Order"){
      throw new ValidationError({ message: "Order error"})
    }
    return null
  },
  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCart()
      return useCallback(
        async function setShippingMethod(input) {
          await fetch({ input })
          await mutate()
          return null
        },
        [fetch]
      )
    },
}
