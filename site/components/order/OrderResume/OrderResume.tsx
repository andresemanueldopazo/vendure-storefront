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

  return (
    <li
      className="py-4 flex flex-col space-y-2"
      {...rest}
    >
      <div className="w-full flex flex-col sm:flex-row items-center">
        <div className="w-full flex flex-row justify-between sm:flex-col space-x-4 sm:space-x-0">
          <span> Order code </span>
          <span> {order.code} </span>
        </div>
        <div className="w-full flex flex-row justify-between sm:flex-col space-x-4 sm:space-x-0">
          <span> Date placed </span>
          <span> {order.orderPlacedAt} </span>
        </div>
        <div className="w-full flex flex-row justify-between sm:flex-col space-x-4 sm:space-x-0"> 
          <span> Total amount </span>
          <span> {totalPrice} </span>
        </div>
      </div>
      <ul className="flex flex-col space-y-2">
        {order.lineItems.map((item) =>
          <LineItem
            key={item.id}
            item={item}
            withDescription={true}
            currencyCode={order?.currency.code!}
          />
        )}
      </ul>
      <span> {order.state} </span>
    </li>
  )
}

export default OrderResume
