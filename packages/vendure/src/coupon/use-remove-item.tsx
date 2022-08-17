import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import useRemoveItem, { UseRemoveItem } from '@vercel/commerce/coupon/use-remove-item'
import { RemoveCouponCodeMutation, RemoveCouponCodeMutationVariables } from '../../schema'
import { RemoveItemHook } from '../types/coupon'
import { removeCouponCodeMutation } from '../utils/mutations/remove-coupon-code-mutation'
import { useCart } from '../cart'

export default useRemoveItem as UseRemoveItem<typeof handler>

export const handler: MutationHook<RemoveItemHook> = {
  fetchOptions: {
    query: removeCouponCodeMutation,
  },
  async fetcher({ input, options, fetch }) {
    const variables: RemoveCouponCodeMutationVariables = {
      couponCode: input.code
    }
    await fetch<RemoveCouponCodeMutation>({
      ...options,
      variables,
    })
    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCart()

      return useCallback(
        async function removeItem(input) {
          await fetch({ input })
          await mutate()
          return null
        },
        [fetch, mutate]
      )
    },
}
