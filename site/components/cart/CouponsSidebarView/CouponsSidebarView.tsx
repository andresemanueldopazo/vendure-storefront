import { FC, useState } from 'react'
import { Button, Input, useUI } from '@components/ui'
import useCart from '@framework/cart/use-cart'
import useAddCouponItem from '@framework/coupon/use-add-item'
import SidebarLayout from '@components/common/SidebarLayout'

const Coupons: FC = () => {
  const { data } = useCart()
  const addCouponItem = useAddCouponItem()
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setSidebarView } = useUI()

  const handleCode = async (e: React.SyntheticEvent<EventTarget>) => {
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
      <div className="px-4 sm:px-6 flex-1"></div>
      <div className="
        flex flex-col flex-shrink-0
        px-4 sm:px-6 py-6 py-12
        sticky bottom-0 bg-accent-0
        border-t space-y-4
      ">
        <ul className="flex flex-wrap justify-between">
          {data && data.coupons?.map((code, i) => {
            return (
              <li key={i} className="border px-6 py-1.5">{code.code}</li>
            )
          })}
        </ul>
        <form
          onSubmit={handleCode}
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
