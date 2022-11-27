import usePrice from "@framework/product/use-price"
import LineItem from "../LineItem"
import { OrderResume } from "@commerce/types/customer"
import * as Dialog from '@radix-ui/react-dialog'
import { Cross } from '@components/icons'
import Discount, { DiscountItem } from "@components/Discounts/Discount"
import { FC } from "react"

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
  const { price: shippingPrice } = usePrice(
    order.shippingMethod && {
      amount: order.shippingMethod.priceWithTax,
      currencyCode: order?.currency.code!,
    }
  )
  const { price: discountedShippingPrice } = usePrice(
    order.shippingMethod && {
      amount: order.shippingMethod.discountedPriceWithTax,
      currencyCode: order?.currency.code!,
    }
  )
  const { price: subTotalPrice } = usePrice({
    amount: order.subTotalPrice,
    currencyCode: order?.currency.code!,
  })

  return (
    <li
      className="min-w-[50%] py-4 flex flex-col space-y-2"
      {...rest}
    >
      <div className="w-full flex flex-col sm:flex-row items-center sm:space-x-4">
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
        <Dialog.Root>
          <Dialog.Trigger>
            View details
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed z-50 inset-0 grid place-items-center bg-black/50">
              <Dialog.Content className="absolute top-20 h-3/4 bg-primary overflow-y-auto flex flex-col space-y-4">
                <div className="p-4 sticky z-10 top-0 pt-4 bg-primary flex flex-col-reverse sm:flex-row sm:space-x-4 shadow-magical">
                  <div className="flex flex-col sm:flex-row sm:flex-row sm:space-x-4">
                    <div className="min-w-max flex flex-row justify-between sm:flex-col space-x-4 sm:space-x-0">
                      <span> Order code </span>
                      <span> {order.code} </span>
                    </div>
                    <div className="min-w-max flex flex-row justify-between sm:flex-col space-x-4 sm:space-x-0">
                      <span> Date placed </span>
                      <span> {order.orderPlacedAt} </span>
                    </div>
                  </div>
                  <Dialog.Close className="w-full sm:w-24 flex justify-end sm:justify-end hover:text-accent-5 transition ease-in-out duration-150 focus:outline-none">
                    <Cross className="h-6 w-6"/>
                  </Dialog.Close>
                </div>
                <div className="px-4 pb-4 flex flex-col space-y-2">
                  <ul className="flex flex-col space-y-2">
                    {order.lineItems.map((item) => {     
                      const itemsWithFulfillmentQuantity = item.fulfillments.reduce<number>(
                        (previousValue, currentValue) => previousValue + currentValue.quantity, 0
                      )
                      return (
                        <>
                          {item.fulfillments.map((fulfillment) =>         
                            <LineItem
                              key={item.id}
                              item={item}
                              quantity={fulfillment.quantity}
                              state={fulfillment.state}
                              withDescription={true}
                              currencyCode={order?.currency.code!}
                            />
                          )}
                          {!itemsWithFulfillmentQuantity &&
                            <LineItem
                              key={item.id}
                              item={item}
                              quantity={item.quantity - itemsWithFulfillmentQuantity}
                              state={"Order placed"}
                              withDescription={true}
                              currencyCode={order?.currency.code!}
                            />
                          }
                        </>
                      )
                    })}
                  </ul>
                  <div className="space-y-2">
                    <span> Shipping </span>
                    <div className="flex flex-col">
                      <div className="flex flex-col space-y-1">
                        <div className="flex flex-col sm:flex-row sm:w-full">
                          <span className="sm:w-1/2"> {order.shippingAddress.firstName} {order.shippingAddress.lastName} </span>
                          <span className="sm:w-1/2"> {order.shippingAddress.phoneNumber} </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-col w-full">
                            <span> {order.shippingAddress.company} </span>
                            <span className="max-w-fit">
                              {order.shippingAddress.streetLine},{' '}
                              {order.shippingAddress.city},{' '}
                              {order.shippingAddress.province},{' '}
                              {order.shippingAddress.country}
                            </span>
                            <span> ZIP Code {order.shippingAddress.postalCode} </span>
                          </div>
                        </div>
                      </div>
                      {order.shippingMethod &&
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-row justify-between">
                            <span> {order.shippingMethod.name} shipping </span>
                            <span> {shippingPrice} </span>
                          </div>
                          <span className="text-sm max-w-fit"> {order.shippingMethod.description || "Without description lllllllllllll llllllll llllllllll llllllllll lllllllll lllllllllllll lllllllll lllllllllll llllllll "} </span>
                          {order.shippingMethod.discounts.reduce<(FC<DiscountItem> | JSX.Element)[]>((previousValue, currentValue) => {
                            if (currentValue.value !== 0) {
                              return [
                                ...previousValue,
                                <Discount
                                  key={currentValue.description}
                                  className="flex flex-row justify-between"
                                  description={currentValue.description}
                                  value={currentValue.value}
                                  currencyCode={order.currency.code}
                                />,
                              ]
                            }
                            return previousValue
                          }, [])}
                        </div>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <ul>
                      <li className="flex justify-between">
                        <span> Subtotal </span>
                        <span> {subTotalPrice} </span>
                      </li>
                      <li className="flex justify-between">
                        <span> Shipping </span>
                        <span> {discountedShippingPrice} </span>
                      </li>
                      {order.discounts.reduce<(FC<DiscountItem> | JSX.Element)[]>((previousValue, currentValue) => {
                        if (currentValue.type === "DISTRIBUTED_ORDER_PROMOTION") {
                          return [
                            ...previousValue,
                            <Discount
                              key={currentValue.description}
                              className="flex flex-row justify-between"
                              description={currentValue.description}
                              value={currentValue.value}
                              currencyCode={order.currency.code}
                            />,
                          ]
                        }
                        return previousValue
                      }, [])}
                    </ul>
                    <div className="flex justify-between border-t border-accent-2 font-bold">
                      <span> Total </span>
                      <span> {totalPrice} </span>
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <ul className="flex flex-col space-y-2">
        {order.lineItems.map((item) =>
          <LineItem
            key={item.id}
            item={item}
            quantity={item.quantity}
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
