import { FC, useEffect, useState } from 'react'
import cn from 'clsx'
import s from './ShippingView.module.css'
import Button from '@components/ui/Button'
import { Input, useUI } from '@components/ui'
import SidebarLayout from '@components/common/SidebarLayout'
import useSetShippingAddress from '@framework/shipping/address/use-set-shipping-address'
import useEligibleShippingMethods from '@framework/shipping/method/use-eligible-shipping-methods'
import useSetShippingMethod from '@framework/shipping/method/use-set-shipping-method'
import { useCart } from '@framework/cart'
import usePrice from '@framework/product/use-price'

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

  const [shippingMethodId, setShippingMethodId] = useState(cart?.shippingMethod?.id || "0")

  const shippingAddress = cart?.shippingAddress
  const [firstName, setFirstName] = useState(shippingAddress?.firstName || '')
  const [lastName, setLastName] = useState(shippingAddress?.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '')
  const [company, setCompany] = useState(shippingAddress?.company || '')
  const [streetLine, setStreetLine] = useState(shippingAddress?.streetLine || '')
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
  const [province, setProvince] = useState(shippingAddress?.province || '')
  const [city, setCity] = useState(shippingAddress?.city || '')

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
    (async () => {
      await setShippingMethod({id: shippingMethodId})
    })()
  }, [shippingMethodId])

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await setShippingAddress({
      firstName,
      lastName,
      phoneNumber,
      company,
      streetLine,
      postalCode,
      province,
      city,
      country: event.target.country.value,
    })

    setSidebarView(process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'STRIPE_VIEW' : 'CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView(
        process.env.COMMERCE_STRIPEPAYMENT_ENABLED? 'CART_VIEW' : 'CHECKOUT_VIEW'
      )}>
        <div className="flex flex-col flex-1 justify-between text-sm">
          <div className="px-4 sm:px-6 flex-1">
            <h2 className="pt-1 pb-2 text-2xl font-semibold tracking-wide cursor-pointer inline-block">
              Shipping
            </h2>
            <div>
              <hr className="border-accent-2 my-5"/>
              <h3 className="pb-3 text-xl font-semibold">
                Method
              </h3>
              <div className="flex flex-col">
                {elegibleShippingMethods && elegibleShippingMethods.map((shippingMethod) => {
                  const inputElement = shippingMethod.id === shippingMethodId?
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
                      <span className="ml-3 text-sm">{`$ ${shippingMethod.priceWithTax}`}</span>
                    </div>
                  )
                })}
              </div>
              <hr className="border-accent-2 my-5"/>
              <h3 className="pb-2 text-xl font-semibold">
                Address
              </h3>
              <div className="grid gap-3 grid-flow-row grid-cols-12">
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>First Name</label>
                  <Input className={s.input} onChange={setFirstName} value={firstName}/>
                </div>
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>Last Name</label>
                  <Input className={s.input} onChange={setLastName} value={lastName}/>
                </div>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Company</label>
                <Input className={s.input} onChange={setCompany} value={company}/>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Street and House Number</label>
                <Input className={s.input} onChange={setStreetLine} value={streetLine}/>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Phone Number</label>
                <Input className={s.input} onChange={setPhoneNumber} value={phoneNumber}/>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Province</label>
                <Input className={s.input} onChange={setProvince} value={province}/>
              </div>
              <div className="grid gap-3 grid-flow-row grid-cols-12">
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>Postal Code</label>
                  <Input className={s.input} onChange={setPostalCode} value={postalCode}/>
                </div>
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>City</label>
                  <Input className={s.input} onChange={setCity} value={city}/>
                </div>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Country/Region</label>
                <select name="country" className={s.select}>
                  <option>Hong Kong</option>
                </select>
              </div>
            </div>
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
                <span>{shippingPrice}</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-2 font-bold mb-2">
              <span>Total</span>
              <span>{total}</span>
            </div>
            <Button type="submit" width="100%" variant="ghost">
              Continue
            </Button>
          </div>
        </div>

      </SidebarLayout>
    </form>
  )
}

export default ShippingView
