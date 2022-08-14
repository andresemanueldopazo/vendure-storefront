import { useHook, useMutationHook } from '../utils/use-hook'
import { mutationFetcher } from '../utils/default-fetcher'
import type { MutationHook, HookFetcherFn } from '../utils/types'
import type { VerifyCustomerAccountHook } from '../types/verify-customer-account'
import type { Provider } from '..'

export type UseVerifyCustomerAccount<
  H extends MutationHook<VerifyCustomerAccountHook<any>> = MutationHook<VerifyCustomerAccountHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<VerifyCustomerAccountHook> = mutationFetcher

const fn = (provider: Provider) => provider.auth?.useVerifyCustomerAccount!

const useVerifyCustomerAccount: UseVerifyCustomerAccount = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useVerifyCustomerAccount
