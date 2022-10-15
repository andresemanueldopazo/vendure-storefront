import { FC } from 'react'
import { Discount as DiscountItem } from '@commerce/types/common'
import Discount from './Discount'

type DiscountsInput = {
  discounts: DiscountItem[]
  currencyCode: string
}

const Discounts: FC<DiscountsInput> = ({ currencyCode, discounts }) => {
  return (
    <ul>
      {discounts.map((discount, i) => {
        if (discount.value !== 0) {
          return (
            <li key={i}>
              <Discount
                value={discount.value}
                description={discount.description}
                currencyCode={currencyCode}
              />
            </li>
          )
        }
      })}
    </ul>
  )
}

export default Discounts
