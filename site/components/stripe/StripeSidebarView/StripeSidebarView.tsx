import { FC, useEffect, useRef, useState } from 'react'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import { Text } from '@components/ui'
import { Elements } from '@stripe/react-stripe-js'
import getStripe from '@lib/get-stripejs'
import useCreateStripePaymentIntent from '@framework/stripe/use-create-stripe-payment-intent'
import StripePaymentForm from '../StripePaymentForm'
import s from './StripeSidebarView.module.css'
import cn from 'clsx'
import usePrice from '@framework/product/use-price'
import useCart from '@framework/cart/use-cart'
import LineItem from '@components/order/LineItem'
import { ChevronRight } from '@components/icons'
import { useSpring, a } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import * as Collapsible from '@radix-ui/react-collapsible'

const StripeSidebarView: FC = () => {
  const { setSidebarView } = useUI()
  const { data } = useCreateStripePaymentIntent()
  const { data: cart } = useCart()

  const { price: discountedShippingPrice } = usePrice(
    cart && {
      amount: cart?.shippingMethod?.discountedPriceWithTax || 0,
      currencyCode: cart.currency.code,
    }
  )
  const { price: subTotal } = usePrice(
    cart && {
      amount: Number(cart.subtotalPrice),
      currencyCode: cart.currency.code,
    }
  )
  const { price: total } = usePrice(
    cart && {
      amount: Number(cart.totalPrice),
      currencyCode: cart.currency.code,
    }
  )

  const [orderSummaryRef, { height: viewHeight }] = useMeasure()
  const [open, setOpen] = useState(false)
  const animProps = useSpring({
    height: open ? viewHeight : 0,
    config: { tension: 250, friction: 32, clamp: true, duration: 150 },
    opacity: open ? 1 : 0,
  })

  const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    triggerRef!.current!.style!.top = `${triggerRef!.current!.offsetTop}px`
  }, [])

  const scrollToTop = () => {
    const el = document.getElementById('sidebar');
    el!.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <SidebarLayout
      handleBack={() => setSidebarView('SHIPPING_ADDRESS_VIEW')}
    >
      <div className="flex flex-col justify-between space-y-2 flex-1 text-sm">
        <div className="px-4 sm:px-6">
          <Collapsible.Root
            open={open}
            onOpenChange={setOpen}
            className="px-4 sm:px-6"
          >
            <Collapsible.Trigger onClick={() => scrollToTop()} ref={triggerRef} className={s.header}>
              <ChevronRight className={cn(s.icon, { [s.open]: open })} />
              <div className="w-full flex justify-between">
                Order summary
                <span>{total}</span>
              </div>
            </Collapsible.Trigger>
            <Collapsible.Content forceMount asChild>
              <a.div style={{ overflow: 'hidden', ...animProps }}>
                <div ref={orderSummaryRef} className="flex flex-col">
                  <ul>
                    {cart!.lineItems!.map((item) =>
                      <LineItem
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency.code!}
                      />
                    )}
                  </ul>
                  <ul>
                    <li className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{subTotal}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Taxes</span>
                      <span>Calculated at checkout</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{cart?.shippingMethod?.name || ""} Shipping</span>
                      <span>{discountedShippingPrice}</span>
                    </li>
                  </ul>
                  <div className="flex justify-between font-bold mb-2">
                    <span>Total</span>
                    <span>{total}</span>
                  </div>
                </div>
              </a.div>
            </Collapsible.Content>
          </Collapsible.Root>
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
      </div>
    </SidebarLayout>
  )
}

export default StripeSidebarView
