import { SWRHook } from '@vercel/commerce/utils/types'
import useCreateStripePaymentIntent, {
  UseCreateStripePaymentIntent,
} from '@vercel/commerce/stripe/use-create-stripe-payment-intent'
import { createStripePaymentIntent } from '../utils/mutations/create-stripe-payment-intent'
import { CreateStripePaymentIntentHook } from '../types/stripe'

export default useCreateStripePaymentIntent as UseCreateStripePaymentIntent<typeof handler>

export const handler: SWRHook<CreateStripePaymentIntentHook> = {
  fetchOptions: {
    query: createStripePaymentIntent,
  },
  useHook:
    ({ useData }) =>
    (input) => {
      const response = useData({
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        }
      })
      return response
    },
}
