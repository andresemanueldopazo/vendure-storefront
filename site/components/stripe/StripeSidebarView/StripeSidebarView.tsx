import { FC } from 'react'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import { Text } from '@components/ui'
import { Elements } from '@stripe/react-stripe-js'
import getStripe from '@lib/get-stripejs'
import useCreateStripePaymentIntent from '@framework/stripe/use-create-stripe-payment-intent'
import StripePaymentForm from '../StripePaymentForm'

const StripeSidebarView: FC = () => {
  const { setSidebarView } = useUI()
  const { data } = useCreateStripePaymentIntent()
  return (
    <SidebarLayout
      handleBack={() => setSidebarView('SHIPPING_VIEW')}
    >
      <div className="px-4 sm:px-6">
        <Text variant="sectionHeading">Payment</Text>
      </div>
      {data? (
        <Elements
          stripe={getStripe()}
          options={{ clientSecret: data!.createStripePaymentIntent }}
        >
          <StripePaymentForm/>
        </Elements>
      ) : null}
    </SidebarLayout>
  )
}

export default StripeSidebarView
