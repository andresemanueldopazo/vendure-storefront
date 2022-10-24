import { FC, useEffect, useRef, useState } from 'react'
import s from './ShippingAddressView.module.css'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui'
import SidebarLayout from '@components/common/SidebarLayout'
import useSetShippingAddress from '@framework/shipping/address/use-set-shipping-address'
import { useCart } from '@framework/cart'
import usePrice from '@framework/product/use-price'
import * as Popover from "@radix-ui/react-popover"
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import cn from 'clsx'
import { ChevronRight } from '@components/icons'
import LineItem from '@components/order/LineItem'
import useMeasure from 'react-use-measure'
import { useSpring, a } from '@react-spring/web'
import * as Collapsible from '@radix-ui/react-collapsible'

const TextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})

  return (
    <div className={s.fieldset}>
      <label
        className={s.label}
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <Popover.Root
        open={open}
        onOpenChange={
          (open) => {
            setOpen(open && meta.touched && !!errors?.length)
          }
        }
      >
        <Popover.Trigger asChild>
          <input
            className={meta.touched && errors?.length ? s.invalidInput : s.validInput}
            {...field}
            onChange={(event) => {
              setOpen(true)
              field.onChange(event)
            }}
            {...props}
          />
        </Popover.Trigger>
        {!!errorsExceptRequired?.length && (
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              onOpenAutoFocus={(event) => event.preventDefault()}
              className="z-40"
            >
              {errorsExceptRequired.map((error, i) => {
                return (
                  <div
                    key={i}
                    className="border border-secondary bg-primary text-center"
                  >
                    {error}
                  </div>
                )
              })}
              <Popover.Arrow/>
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
      {meta.touched && errors && (
        <div className="text-red">
          {errors.includes("Required") ? "Required" : "Incorrect"}
        </div>
      )}
    </div>
  )
}

interface Form extends HTMLFormElement {
  cardHolder: HTMLInputElement
  cardNumber: HTMLInputElement
  cardExpireDate: HTMLInputElement
  cardCvc: HTMLInputElement
  firstName: HTMLInputElement
  lastName: HTMLInputElement
  company: HTMLInputElement
  streetNumber: HTMLInputElement
  zipCode: HTMLInputElement
  city: HTMLInputElement
  country: HTMLSelectElement
}

const ShippingView: FC = () => {
  const { setSidebarView } = useUI()
  const setShippingAddress = useSetShippingAddress()
  const { data: cart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
    <SidebarLayout handleBack={() => setSidebarView(
      process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'SHIPPING_METHOD_VIEW' : 'CHECKOUT_VIEW'
    )}>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          company: '',
          streetLine: '',
          phoneNumber: '',
          province: '',
          postalCode: '',
          city: '',
          country: '',
        }}
        validate={async (values) => {
          const schema = Yup.object({
            firstName: Yup.string()
              .required('Required'),
            lastName: Yup.string()
              .required('Required'),
            streetLine: Yup.string()
              .required('Required'),
            phoneNumber: Yup.number()
              .positive('Must be a positive number')
              .required('Required'),
            city: Yup.string()
              .required('Required'),
            province: Yup.string()
              .required('Required'),
            postalCode: Yup.string()
              .required('Required'),
            country: Yup.string()
              .required('Required'),
          })

          return await schema.validate(values, { abortEarly: false })
          .then(() => {})
          .catch((err: Yup.ValidationError) => {
            const errors = err.inner
            return errors.reduce<{[key: string]: string[]}>((a, error) => {
              const field = error.path
              const params = error.params

              if (!params || !field) {
                return a
              }

              const errorMessages = error.type !== 'typeError'? (
                error.errors
              ) : params.originalValue !== "" ? (
                [`Must be a ${params.type}`]
              ) : (
                ["Required"]
              )

              return field in a ? (
                {...a, [field]: [...a[field], ...errorMessages]}
              ) : (
                {...a, [field]: errorMessages}
              )
            }, {})
          })
        }}
        onSubmit={async (
          {
            firstName,
            lastName,
            phoneNumber,
            company,
            streetLine,
            postalCode,
            province,
            city,
            country,
          },
          {setSubmitting},
        ) => {
          setLoading(true)
          try {
            await setShippingAddress({
              firstName,
              lastName,
              phoneNumber,
              company,
              streetLine,
              postalCode,
              province,
              city,
              country
            })
            setSidebarView(process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'STRIPE_VIEW' : 'CHECKOUT_VIEW')
            setSubmitting(false)
            setSubmitting(false)
          } catch (e: any) {
            setMessage(e.errors[0].message)
            setLoading(false)
          }
        }}
      >
        <Form className="flex flex-col justify-between space-y-2 flex-1 text-sm">
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
                Address
              </h3>
              <TextInput
                label="First Name"
                name="firstName"
                type="text"
              />
              <TextInput
                label="Last Name"
                name="lastName"
                type="text"
              />
              <TextInput
                label="Company"
                name="company"
                type="text"
              />
              <TextInput
                label="Street and House Number"
                name="streetLine"
                type="text"
              />
              <TextInput
                label="Phone Number"
                name="phoneNumber"
                type="text"
              />
              <TextInput
                label="Province"
                name="province"
                type="text"
              />
              <TextInput
                label="Postal Code"
                name="postalCode"
                type="text"
                />
              <TextInput
                label="City"
                name="city"
                type="text"
                />
              <TextInput
                label="Country"
                name="country"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 px-6 py-4 pt-2 sticky bottom-0 bg-accent-0 border-t">
            {message && (
              <div className="text-red border border-red pb-12">
                {message}
              </div>
            )}
            <Button
              type="submit"
              width="100%"
              variant="ghost"
              loading={loading}
              onClick={() => {
                scrollToTop()
                setOpen(false)
              }}
            >
              Continue
            </Button>
          </div>
        </Form>
      </Formik>
    </SidebarLayout>
  )
}

export default ShippingView
