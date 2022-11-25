import usePrice from '@framework/product/use-price'
import { FC } from 'react'

export type DiscountItem = {
  value: number
  description: string
  currencyCode: string
  className?: string
}

const Discount: FC<DiscountItem> = (discount) => {
  const { price } = usePrice({
    amount: discount.value,
    currencyCode: discount.currencyCode,
  })

  return (
    <div className={discount.className}>
      <span className="max-w-fit">{discount.description}</span>
      <span>{price}</span>
    </div>
  )
}

export default Discount
