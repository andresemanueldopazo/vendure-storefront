import type { HookFetcherFn, MutationHook } from '../../utils/types'
import type { SetCustomerAddressHook } from '../../types/customer/address'
import type { Provider } from '../..'
import { useHook, useMutationHook } from '../../utils/use-hook'
import { mutationFetcher } from '../../utils/default-fetcher'

export type UseSetCustomerAddress<
  H extends MutationHook<SetCustomerAddressHook<any>> = MutationHook<SetCustomerAddressHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<SetCustomerAddressHook> = mutationFetcher

const fn = (provider: Provider) => provider.customer?.address?.useSetCustomerAddress!

const useSetCustomerAddress: UseSetCustomerAddress = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useSetCustomerAddress
