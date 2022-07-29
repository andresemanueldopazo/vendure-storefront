import { useCallback } from 'react'
import { MutationHook } from '@vercel/commerce/utils/types'
import useFacebookLogin, { UseFacebookLogin } from '@vercel/commerce/auth/use-facebook-login'
import { FacebookLoginHook } from '../types/facebook-login'
import useCustomer from '../customer/use-customer'
import { facebookLoginMutation } from '../utils/mutations/facebook-log-in-mutation'
import { FacebookLoginMutation, FacebookLoginMutationVariables } from '../../schema'

export default useFacebookLogin as UseFacebookLogin<typeof handler>

export const handler: MutationHook<FacebookLoginHook> = {
  fetchOptions: {
    query: facebookLoginMutation,
  },
  async fetcher({ input: { token: token }, options, fetch }) {
    const variables: FacebookLoginMutationVariables = {
      token,
    }

    const { authenticate } = await fetch<FacebookLoginMutation>({
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
        async function facebookLogin(input) {
          const data = await fetch({ input })
          await mutate()
          return data
        },
        [fetch, mutate]
      )
    },
}
