import usePrice from "@framework/product/use-price"
import LineItem from "../LineItem"
import { OrderResume } from "@commerce/types/customer"

const OrderResume = ({
  order,
  ...rest
}: {
  order: OrderResume,
}) => {
  const { price: totalPrice } = usePrice({
    amount: order.totalPrice,
    currencyCode: order?.currency.code!,
  })

  const { price: shippingPrice } = usePrice({
    amount: order.shippingWithTax,
    currencyCode: order?.currency.code!,
  })

  const { streetLine, city, province, country} = order.shippingAddress

  return (
    <li
      className="flex flex-col py-4"
      {...rest}
    >
      <div>
        <div>
          <span> Code: </span>
          <span> {order.code} </span>
        </div>
        <div>
          <span> Placed at: </span>
          <span> {order.orderPlacedAt} </span>
        </div>
        <div> 
          <span> State: </span>
          <span> {order.state} </span>
        </div>
        <div>
          <ul>
            {order.lineItems.map((item) =>
              <LineItem
                key={item.id}
                item={item}
                currencyCode={order?.currency.code!}
              />
            )}
          </ul>
        </div>
        <div>
          <span> Shipping Price: </span>
          {totalPrice &&
            <span> {shippingPrice} </span>
          }
        </div>
        <div>
          <span> Shipping Address: </span>
          <span>
            {streetLine}, {city}, {province}, {country}
          </span>
        </div>
        <div>
          <span> Total: </span>
          {totalPrice &&
            <span> {totalPrice} </span>
          }
        </div>
      </div>
    </li>
  )
}

export default OrderResume
