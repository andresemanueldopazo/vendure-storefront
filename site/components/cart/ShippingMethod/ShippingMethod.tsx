import usePrice from '@framework/product/use-price'
import { FC } from 'react'
import { Method } from '@commerce/types/shipping'
import Discount from '../CartItem/Discount'

type ShippingMethodInput = {
  method?: Method.ShippingMethod
  currencyCode: string
}

const ShippingMethod: FC<ShippingMethodInput> = ({ currencyCode, method }) => {
  const { price: shippingPrice } = usePrice({
      amount: method?.priceWithTax || 0,
      currencyCode,
  })
  const { price: discountedShippingPrice } = usePrice({
    amount: method?.discountedPriceWithTax || 0,
    currencyCode,
  })

  return (
    <>
      <div className="flex justify-between">
        <span>Shipping {method?.name}</span>
        <span>{method? discountedShippingPrice: "-"}</span>
      </div>
      {method &&
        <ul>
          <li>
            <span className="text-xs">
              <div dangerouslySetInnerHTML={
                {__html: method.description}
              }/>
            </span>
          </li>
          {method.discounts.length !== 0 && (
            <ul className="text-xs">
              <li className="flex justify-between">
                <span className="pl-4">Price</span>
                <span>{shippingPrice}</span>
              </li>
              {method.discounts.map((discount, i) => {
                return (
                  <li key={i} className="pl-4">
                    <Discount
                      value={discount.value}
                      description={discount.description}
                      currencyCode={currencyCode}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </ul>
      }
    </>
  )
}

export default ShippingMethod
