import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import useGoogleLogin, { UseGoogleLogin } from '@vercel/commerce/auth/use-google-login'
import { GoogleLoginHook } from '../types/google-login'
import useCustomer from '../customer/use-customer'
import { googleLoginMutation } from '../utils/mutations/google-log-in-mutation'

export default useGoogleLogin as UseGoogleLogin<typeof handler>

export const handler: MutationHook<GoogleLoginHook> = {
  fetchOptions: {
    query: googleLoginMutation,
  },
  async fetcher({ input: { token }, options, fetch }) {
    const variables = {
      token
    }

    const { authenticate } = await fetch({
      ...options,
      variables,
    })

    if (authenticate.__typename === 'CurrentUser') {
      return authenticate.id
    }
    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCustomer()

      return useCallback(
        async function googleLogin(input) {
          const data = await fetch({ input })
          await mutate()
          return data
        },
        [fetch, mutate]
      )
    },
}
