import { Cross } from '@components/icons'
import { FC } from 'react'
import useRemoveCouponItem from '@framework/coupon/use-remove-item'

type CouponItem = {
  code: string
}

const Coupon: FC<CouponItem> = (code) => {
  const removeCouponItem = useRemoveCouponItem()

  const handleRemove = async () => {  
    await removeCouponItem(code)
  }  

  return (
    <div className="flex justify-between items-center border py-1.5 pr-4 pl-2">
      <button
        onClick={handleRemove}
      >
        <Cross width={20} height={20} />
      </button>
      <p className="text-center	">{code.code}</p>
    </div>
  )
}

export default Coupon
