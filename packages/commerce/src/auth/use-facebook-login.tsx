import { useHook, useMutationHook } from '../utils/use-hook'
import { mutationFetcher } from '../utils/default-fetcher'
import type { MutationHook, HookFetcherFn } from '../utils/types'
import type { FacebookLoginHook } from '../types/facebook-login'
import type { Provider } from '..'

export type UseFacebookLogin<
  H extends MutationHook<FacebookLoginHook<any>> = MutationHook<FacebookLoginHook>
> = ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<FacebookLoginHook> = mutationFetcher

const fn = (provider: Provider) => provider.auth?.useFacebookLogin!

const useFacebookLogin: UseFacebookLogin = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useFacebookLogin
