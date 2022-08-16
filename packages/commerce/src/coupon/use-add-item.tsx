import { useHook, useMutationHook } from '../utils/use-hook'
import { mutationFetcher } from '../utils/default-fetcher'
import type { HookFetcherFn, MutationHook } from '../utils/types'
import type { AddItemHook } from '../types/coupon'
import type { Provider } from '..'

export type UseAddItem<
  H extends MutationHook<AddItemHook<any>> = MutationHook<AddItemHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<AddItemHook> = mutationFetcher

const fn = (provider: Provider) => provider.coupon?.useAddItem!

const useAddItem: UseAddItem = () => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })()
}

export default useAddItem
