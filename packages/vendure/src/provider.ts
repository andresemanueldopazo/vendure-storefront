import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useRemoveItem } from './cart/use-remove-item'
import { handler as useCustomer } from './customer/use-customer'
import { handler as useSearch } from './product/use-search'
import { handler as useLogin } from './auth/use-login'
import { handler as useFacebookLogin } from './auth/use-facebook-login'
import { handler as useGoogleLogin } from './auth/use-google-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'
import { handler as useCheckout } from './checkout/use-checkout'
import { handler as useSubmitCheckout } from './checkout/use-submit-checkout'
import { handler as useCards } from './customer/card/use-cards'
import { handler as useAddCardItem } from './customer/card/use-add-item'
import { handler as useAddresses } from './customer/address/use-addresses'
import { handler as useAddCustomerAddressItem } from './customer/address/use-add-item'
import { handler as useCreateStripePaymentIntent } from './stripe/use-create-stripe-payment-intent'
import { handler as useEligibleShippingMethods } from './shipping/method/use-eligible-shipping-methods'
import { handler as useSetShippingMethod } from './shipping/method/use-set-shipping-method'
import { handler as useSetShippingAddress } from './shipping/address/use-set-shipping-address'
import { handler as useVerifyCustomerAccount } from './auth/use-verify-customer-account'
import { fetcher } from './fetcher'

export const vendureProvider = {
  locale: 'en-us',
  cartCookie: 'session',
  fetcher,
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  customer: {
    useCustomer,
    card: {
      useCards,
      useAddItem: useAddCardItem,
    },
    address: {
      useAddresses,
      useAddItem: useAddCustomerAddressItem,
    },
  },
  products: { useSearch },
  checkout: {
    useCheckout,
    useSubmitCheckout,
  },
  auth: {
    useLogin,
    useFacebookLogin,
    useGoogleLogin,
    useLogout,
    useSignup,
    useVerifyCustomerAccount,
  },
  stripe: { useCreateStripePaymentIntent },
  shipping: {
    method: {
      useEligibleShippingMethods,
      useSetShippingMethod,
    },
    address: {
      useSetShippingAddress,
    },
  },
}

export type VendureProvider = typeof vendureProvider
