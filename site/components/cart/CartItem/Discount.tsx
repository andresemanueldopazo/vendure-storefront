import usePrice from '@framework/product/use-price'
import { FC } from 'react'

type DiscountItem = {
  value: number
  description: string
  currencyCode: string
}

const Discount: FC<DiscountItem> = (discount) => {
  const { price } = usePrice({
    amount: discount.value,
    currencyCode: discount.currencyCode,
  })

  return (
    <div className="flex flex-row justify-between space-x-4">
      <span>{discount.description}</span>
      <span>{price}</span>
    </div>
  )
}

export default Discount
