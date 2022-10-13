import { FC, useEffect, useRef, useState } from 'react'
import cn from 'clsx'
import s from './ShippingView.module.css'
import { Button, Text } from '@components/ui'
import { Input, useUI } from '@components/ui'
import SidebarLayout from '@components/common/SidebarLayout'
import useSetShippingAddress from '@framework/shipping/address/use-set-shipping-address'
import useEligibleShippingMethods from '@framework/shipping/method/use-eligible-shipping-methods'
import useSetShippingMethod from '@framework/shipping/method/use-set-shipping-method'
import { useCart } from '@framework/cart'
import usePrice from '@framework/product/use-price'
import Discounts from '@components/cart/Discounts'
import * as Popover from "@radix-ui/react-popover"
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

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
  const { data: elegibleShippingMethods } = useEligibleShippingMethods()
  const setShippingMethod = useSetShippingMethod()
  const { data: cart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [shippingMethodId, setShippingMethodId] = useState(cart?.shippingMethod?.id || "")

  const isMounted = useRef(false);

  const { price: discountedShippingPrice } = usePrice(
    cart && {
      amount: cart?.shippingMethod?.discountedPriceWithTax || 0,
      currencyCode: cart.currency.code,
    }
  )
  const { price: shippingPrice } = usePrice(
    cart && {
      amount: cart?.shippingMethod?.priceWithTax || 0,
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

  useEffect(() => {
    isMounted.current && (async () => {
      await setShippingMethod({id: shippingMethodId})
    })()
    isMounted.current = true
  }, [shippingMethodId])

  return (
    <SidebarLayout handleBack={() => setSidebarView(
      process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'CART_VIEW' : 'CHECKOUT_VIEW'
    )}>
      <div className="flex flex-col flex-1 justify-between text-sm">
        <Text variant="sectionHeading" className="px-4 sm:px-6">
          Shipping
        </Text>
        <div className="px-4 sm:px-6 space-y-2">
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
          <hr className="border-accent-2 my-5"/>
        </div>


        <h3 className="px-4 sm:px-6 pb-2 text-xl font-semibold">
          Address
        </h3>
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
              lastName: Yup.number()
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
          <Form className="w-full flex flex-col space-y-4">
            <div className="px-4 sm:px-6 space-y-2">
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

            <div className="flex flex-col flex-shrink-0 px-6 py-4 pt-2 sticky bottom-0 bg-accent-0 border-t">
              <ul>
                <li className="flex justify-between py-1">
                  <span>Subtotal</span>
                  <span>{subTotal}</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>{cart?.shippingMethod?.name || ""} Shipping</span>
                  <span>{discountedShippingPrice}</span>
                </li>
              </ul>
              <div className="flex justify-between border-t border-accent-2 py-2 font-bold mb-2">
                <span>Total</span>
                <span>{total}</span>
              </div>
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
              >
                Continue
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </SidebarLayout>
  )
}

export default ShippingView
