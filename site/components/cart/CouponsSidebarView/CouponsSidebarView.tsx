import { FC, useState } from 'react'
import { Button, Input, useUI } from '@components/ui'
import useCart from '@framework/cart/use-cart'
import useAddCouponItem from '@framework/coupon/use-add-item'
import SidebarLayout from '@components/common/SidebarLayout'
import Coupon from './Coupon'
import Discounts from '../Discounts'

const Coupons: FC = () => {
  const { data } = useCart()
  const addCouponItem = useAddCouponItem()
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setSidebarView } = useUI()

  const handleApply = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    try {
      await addCouponItem({code})
      setCode('')
      setErrorMessage('')
    }
    catch (e: any) {
      setErrorMessage(e.message)
    }
  }

  const goToCart = async () => {
    setSidebarView('CART_VIEW')
  }

  return (
    <SidebarLayout
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <h2 className="px-4 pt-1 pb-8 text-2xl font-semibold tracking-wide inline-block">
        Coupons
      </h2>
      <div className="flex-1">
        {data?.discounts && data.discounts.length !== 0 &&
          <div className="flex flex-col px-4 justify-between divide-y">
            <Discounts
              discounts={data.discounts}
              currencyCode={data.currency.code}
            />
          </div>
        }
      </div>
      <div className="
        flex flex-col flex-shrink-0 py-12 px-4 space-y-4
        sticky bottom-0 bg-accent-0 border-t
      ">
        <ul>
          {data && data.coupons?.map((coupon, i) => {
            return (
              <li key={i}>
                <Coupon
                  code={coupon.code}
                />
              </li>
            )
          })}
        </ul>
        <form
          onSubmit={handleApply}
          className="flex flex-col space-y-3"
        >
          <Input placeholder="Coupon code" onChange={setCode} value={code}/>
          <Button type="submit" width="100%" variant="slim">
            Apply coupon
          </Button>
        </form>
        <p className="h-4 self-center">{errorMessage}</p>
        <Button type="submit" width="100%" variant="ghost" onClick={goToCart}>
            Continue
        </Button>
      </div>
    </SidebarLayout>
  )
}

export default Coupons
