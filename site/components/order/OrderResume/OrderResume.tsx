import usePrice from "@framework/product/use-price"
import LineItem from "../LineItem"
import { OrderResume } from "@commerce/types/customer"
import * as Dialog from '@radix-ui/react-dialog'
import { Cross } from '@components/icons'

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
        <Dialog.Root>
          <Dialog.Trigger>
            View details
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed z-50 inset-0 grid place-items-center bg-black/50">
              <Dialog.Content className="
                absolute top-20 max-h-96 bg-primary max-w-max sm:w-3/4 px-4 pb-4 overflow-y-auto
                flex flex-col
              ">
                <Dialog.Close className="
                  sticky z-10 top-0 w-full pt-4 flex justify-end bg-primary hover:text-accent-5
                  transition ease-in-out duration-150 focus:outline-none
                ">
                  <Cross className="h-6 w-6"/>
                </Dialog.Close>
                <div className="flex flex-col jsutify-betweeen space-y-4">
                  <div className="flex flex-col justify-between sm:flex-row items-center">
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
                  {/* <div className="flex flex-row space-x-4">
                    <div className="flex flex-col sm:w-1/2">
                      <span> Shipping </span>
                      <div className="flex flex-col w-full">
                        {Object.keys(order.shippingAddress).map((key) =>
                          <div className="flex flex-row space-x-4 justify-between border-b">
                            <span className="sm:w-1/2"> {key} </span>
                            <span className="sm:w-1/2"> {(order.shippingAddress as any)[key]} </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}
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
