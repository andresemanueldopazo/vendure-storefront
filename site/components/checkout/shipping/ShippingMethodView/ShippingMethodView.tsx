import { FC, useEffect, useRef, useState } from 'react'
import s from './ShippingMethodView.module.css'
import { Button, Text } from '@components/ui'
import { Input, useUI } from '@components/ui'
import SidebarLayout from '@components/common/SidebarLayout'
import useEligibleShippingMethods from '@framework/shipping/method/use-eligible-shipping-methods'
import useSetShippingMethod from '@framework/shipping/method/use-set-shipping-method'
import { useCart } from '@framework/cart'
import usePrice from '@framework/product/use-price'
import Discounts from '@components/Discounts'
import cn from 'clsx'
import { ChevronRight } from '@components/icons'
import LineItem from '@components/order/LineItem'
import useMeasure from 'react-use-measure'
import { useSpring, a } from '@react-spring/web'
import * as Collapsible from '@radix-ui/react-collapsible'

const ShippingMethodView: FC = () => {
  const { setSidebarView } = useUI()
  const { data: elegibleShippingMethods } = useEligibleShippingMethods()
  const setShippingMethod = useSetShippingMethod()
  const { data: cart } = useCart()

  const [shippingMethodId, setShippingMethodId] = useState(cart?.shippingMethod?.id || "")

  const isMounted = useRef(false);

  const { price: discountedShippingPrice } = usePrice(
    cart?.shippingMethod && {
      amount: cart.shippingMethod.discountedPriceWithTax || 0,
      currencyCode: cart.currency.code,
    }
  )
  const { price: shippingPrice } = usePrice(
    cart?.shippingMethod && {
      amount: cart.shippingMethod.priceWithTax || 0,
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

  const goToShippingAddress = async () => {
    setSidebarView(process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'SHIPPING_ADDRESS_VIEW' : 'CHECKOUT_VIEW')
  }

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

  useEffect(() => {
    isMounted.current && (async () => {
      await setShippingMethod({id: shippingMethodId})
    })()
    isMounted.current = true
  }, [shippingMethodId])

  return (
    <SidebarLayout 
      handleBack={() => setSidebarView(
        process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'CART_VIEW' : 'SHIPPING_ADDRESS_VIEW'
      )}
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

          <div className="flex flex-col space-y-2">
            <Text variant="sectionHeading">
              Shipping
            </Text>
            <h3 className="text-xl font-semibold">
              Method
            </h3>
            <div className="flex flex-col divide-y divide-dashed space-y-2">
              <div>
                {elegibleShippingMethods && elegibleShippingMethods.map((shippingMethod) => {
                  const inputElement = shippingMethod.id === shippingMethodId ?
                    <Input
                      name="shippingMethod"
                      value={`${shippingMethod.id}`}
                      className={s.radio}
                      type="radio"
                      onChange={setShippingMethodId}
                      checked
                    />
                  :
                    <Input
                      name="shippingMethod"
                      value={`${shippingMethod.id}`}
                      className={s.radio}
                      type="radio"
                      onChange={setShippingMethodId}
                    />
                  return (
                    <div key={shippingMethod.id} className="flex flex-row justify-between my-1">
                      <div className="flex flex-col">
                        <div className="flex flex-row">
                          {inputElement}
                          <span className="ml-3 text-sm">{shippingMethod.name}</span>
                        </div>
                        <span className="ml-3 text-sm"><div dangerouslySetInnerHTML={{ __html: shippingMethod.description }} /></span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="pt-2">
                {cart?.shippingMethod?.discountedPriceWithTax !== cart?.shippingMethod?.priceWithTax && (
                  <>
                    <div className="flex flex-row justify-between">
                      <span>Subtotal</span>
                      <span>{shippingPrice}</span>
                    </div>
                    <ul className={"flex flex-col"}>
                      <Discounts
                        discounts={cart!.shippingMethod!.discounts}
                        currencyCode={cart!.currency.code}
                      />
                    </ul>
                  </>
                )}
                <div className="flex flex-row justify-between">
                  <span>Total</span>
                  <span>{discountedShippingPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-shrink-0 px-6 py-4 pt-2 sticky bottom-0 bg-accent-0 border-t">
          <Button
            type="submit"
            width="100%"
            variant="ghost"
            disabled={!cart?.shippingMethod}
            onClick={goToShippingAddress}
          >
            Continue
          </Button>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default ShippingMethodView
