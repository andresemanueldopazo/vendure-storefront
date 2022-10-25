import s from './ShippingMethodView.module.css'
import usePrice from '@framework/product/use-price'
import { Input } from '@components/ui'
import { Dispatch, FC, SetStateAction } from 'react'
import { Method } from '@framework/types/shipping'


type ElegibleShippingMethodInput = {
  currencyCode: string
  method: Omit<Method.ShippingMethod, 'discountedPriceWithTax' | 'discounts'>
  setShippingMethodId: Dispatch<SetStateAction<string>>
}

const ElegibleShippingMethod: FC<ElegibleShippingMethodInput> = ({ currencyCode, method, setShippingMethodId }) => {
  const { price } = usePrice({
      amount: method?.priceWithTax || 0,
      currencyCode,
  })

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row justify-between">
        <div>
          <Input
            name="shippingMethod"
            value={`${method.id}`}
            className={s.radio}
            type="radio"
            onChange={setShippingMethodId}
          />
          <span className="ml-3 text-sm">{method.name}</span>
        </div>
        <div>{price}</div>
      </div>
      <span className="ml-3 text-sm"><div dangerouslySetInnerHTML={{ __html: method.description }} /></span>
    </div>
  )
}

export default ElegibleShippingMethod
