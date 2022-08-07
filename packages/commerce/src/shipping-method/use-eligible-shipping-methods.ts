import type { SWRHook, HookFetcherFn } from '../utils/types'
import type { EligibleShippingMethodsHook } from '../types/shipping-method'
import { useHook, useSWRHook } from '../utils/use-hook'
import { Provider } from '..'

export type UseEligibleShippingMethods<
  H extends SWRHook<
    EligibleShippingMethodsHook<any>> = SWRHook<EligibleShippingMethodsHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<EligibleShippingMethodsHook> = async ({
  options,
  fetch,
}) => {
  return await fetch(options)
}

const fn = (provider: Provider) => provider.shippingMethod?.useEligibleShippingMethods!

const useEligibleShippingMethods: UseEligibleShippingMethods = (input) => {
  const hook = useHook(fn)
  return useSWRHook({ fetcher, ...hook })(input)
}

export default useEligibleShippingMethods
