import { useHook, useMutationHook } from '../../utils/use-hook'
import { mutationFetcher } from '../../utils/default-fetcher'
import type { HookFetcherFn, MutationHook } from '../../utils/types'
import type { Password } from '../../types/customer'
import type { Provider } from '../..'

export type UseRequestPasswordReset<
  H extends MutationHook<
    Password.RequestPasswordResetHook<any>
  > = MutationHook<Password.RequestPasswordResetHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<Password.RequestPasswordResetHook> = mutationFetcher

const fn = (provider: Provider) => provider.customer?.password?.useRequestPasswordReset!

const useRequestPasswordReset: UseRequestPasswordReset = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useRequestPasswordReset
