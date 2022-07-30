import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import {useCustomer} from '@framework/customer'

const StripePaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState('');
  const { mutate } = useCustomer()

  useEffect(() => {
    if (!stripe) {
      return
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return;
    }

    // Retrieve the PaymentIntent
    stripe
      .retrievePaymentIntent(clientSecret!)
      .then(async ({paymentIntent}) => {
        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        await mutate()
        switch (paymentIntent!.status) {
          case 'succeeded':
            setMessage('Success! Payment received.')
            break

          case 'processing':
            setMessage("Payment processing. We'll update you when payment is received.")
            break

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            setMessage('Payment failed. Please try another payment method.')
            break

          default:
            setMessage('Something went wrong.')
            break
        }
      })
  }, [stripe])

  return (
    <div>
      {message && <div>{message}</div>}
    </div>
  )
}

export default StripePaymentStatus
