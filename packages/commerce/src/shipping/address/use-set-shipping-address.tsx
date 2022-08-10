import type { HookFetcherFn, MutationHook } from '../../utils/types'
import { mutationFetcher } from '../../utils/default-fetcher'
import { useHook, useMutationHook } from '../../utils/use-hook'
import type { SetShippingAddressHook } from '../../types/shipping/address'
import type { Provider } from '../..'

export type UseSetShippingAddress<
  H extends MutationHook<SetShippingAddressHook<any>> = MutationHook<SetShippingAddressHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<SetShippingAddressHook> = mutationFetcher

const fn = (provider: Provider) => provider.shipping?.address?.useSetShippingAddress!

const useSetShippingAddress: UseSetShippingAddress = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useSetShippingAddress
