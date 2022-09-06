import { useHook, useMutationHook } from '../../utils/use-hook'
import { mutationFetcher } from '../../utils/default-fetcher'
import type { MutationHook, HookFetcherFn } from '../../utils/types'
import type { ResetPasswordHook } from '../../types/customer/password'
import type { Provider } from '../..'

export type UseResetPassword<
  H extends MutationHook<ResetPasswordHook<any>> = MutationHook<ResetPasswordHook>
> = ReturnType<H["useHook"]>

export const fetcher: HookFetcherFn<ResetPasswordHook> = mutationFetcher

const fn = (provider: Provider) => provider.customer?.password?.useResetPassword!

const useResetPassword: UseResetPassword = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useResetPassword
