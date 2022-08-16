import useAddItem, { UseAddItem } from '@vercel/commerce/coupon/use-add-item'
import { CommerceError } from '@vercel/commerce/utils/errors'
import { MutationHook } from '@vercel/commerce/utils/types'
import { useCallback } from 'react'
import { useCart } from '../cart/index'
import { ApplyCouponCodeMutationVariables, ApplyCouponCodeMutation } from '../../schema'
import { applyCouponCodeMutation } from '../utils/mutations/apply-coupon-code-mutation'
import { AddItemHook } from '../types/coupon'

export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    query: applyCouponCodeMutation,
  },
  async fetcher({ input: { code } , options, fetch }) {
    const variables: ApplyCouponCodeMutationVariables = {
      couponCode: code,
    }

    const { applyCouponCode } = await fetch<ApplyCouponCodeMutation>({
      ...options,
      variables
    })

    if (applyCouponCode.__typename !== 'Order') {
      throw new CommerceError({message: applyCouponCode.message})
    }
    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCart()

      return useCallback(
        async function addItem(input) {
          const data = await fetch({ input })
          await mutate()
          return data
        },
        [fetch, mutate]
      )
    },
}
