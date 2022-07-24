import { useHook, useMutationHook } from '../utils/use-hook'
import { mutationFetcher } from '../utils/default-fetcher'
import type { MutationHook, HookFetcherFn } from '../utils/types'
import type { GoogleLoginHook } from '../types/google-login'
import type { Provider } from '..'

export type UseGoogleLogin<
  H extends MutationHook<GoogleLoginHook<any>> = MutationHook<GoogleLoginHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<GoogleLoginHook> = mutationFetcher

const fn = (provider: Provider) => provider.auth?.useGoogleLogin!

const useGoogleLogin: UseGoogleLogin = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useGoogleLogin
