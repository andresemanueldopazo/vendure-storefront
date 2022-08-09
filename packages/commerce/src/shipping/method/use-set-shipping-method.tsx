import type { HookFetcherFn, MutationHook } from '../../utils/types'
import { mutationFetcher } from '../../utils/default-fetcher'
import { useHook, useMutationHook } from '../../utils/use-hook'
import { SetShippingMethodHook } from '../../types/shipping/method'
import type { Provider } from '../..'

export type UseSetShippingMethod<
  H extends MutationHook<SetShippingMethodHook<any>> = MutationHook<SetShippingMethodHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<SetShippingMethodHook> = mutationFetcher

const fn = (provider: Provider) => provider.shipping?.method?.useSetShippingMethod!

const useSetShippingMethod: UseSetShippingMethod = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useSetShippingMethod
