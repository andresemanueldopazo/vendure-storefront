import type { HookFetcherFn, MutationHook } from '../utils/types'
import type { UpdateCustomerHook } from '../types/customer'
import type { Provider } from '..'
import { useHook, useMutationHook } from '../utils/use-hook'
import { mutationFetcher } from '../utils/default-fetcher'

export type UseUpdateCustomer<
  H extends MutationHook<UpdateCustomerHook<any>> = MutationHook<UpdateCustomerHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<UpdateCustomerHook> = mutationFetcher

const fn = (provider: Provider) => provider?.customer?.useUpdateCustomer!

const useUpdateCustomer: UseUpdateCustomer = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(args)
}

export default useUpdateCustomer
