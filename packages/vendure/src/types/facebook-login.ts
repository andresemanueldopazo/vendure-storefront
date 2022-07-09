import * as Core from '@vercel/commerce/types/login'
import { FacebookLoginBody, FacebookLoginTypes } from '@vercel/commerce/types/facebook-login'
import type { LoginMutationVariables } from '../../schema'

export * from '@vercel/commerce/types/facebook-login'

export type FacebookLoginHook<T extends FacebookLoginTypes = FacebookLoginTypes> = {
  data: null
  actionInput: FacebookLoginBody
  fetcherInput: FacebookLoginBody
  body: T['body']
}
