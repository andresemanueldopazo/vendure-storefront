import { useHook, useSWRHook } from '../utils/use-hook'
import { SWRFetcher } from '../utils/default-fetcher'
import type { CreateStripePaymentIntentHook } from '../types/stripe'
import type { HookFetcherFn, SWRHook } from '../utils/types'
import type { Provider } from '..'

export type UseCreateStripePaymentIntent<
  H extends SWRHook<CreateStripePaymentIntentHook> = SWRHook<CreateStripePaymentIntentHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<CreateStripePaymentIntentHook> = SWRFetcher

const fn = (provider: Provider) => provider.stripe?.useCreateStripePaymentIntent!

const useCreateStripePaymentIntent: UseCreateStripePaymentIntent = (input) => {
  const hook = useHook(fn)
  return useSWRHook({ fetcher, ...hook })(input)
}

export default useCreateStripePaymentIntent
