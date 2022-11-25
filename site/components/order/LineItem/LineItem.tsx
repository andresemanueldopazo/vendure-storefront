import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import s from './LineItem.module.css'
import { useUI } from '@components/ui/context'
import usePrice from '@framework/product/use-price'
import { OrderResume } from '@commerce/types/customer'
import { Cart } from '@commerce/types/cart'

const placeholderImg = '/product-img-placeholder.svg'

const LineItem = ({
  item,
  quantity,
  state,
  withDescription,
  currencyCode,
  ...rest
}: {
  item: Cart['lineItems'][number] | OrderResume['lineItems'][number],
  quantity: number
  state?: string
  withDescription: boolean,
  currencyCode: string
}) => {
  const { closeSidebarIfPresent } = useUI()

  const { price } = usePrice({
    amount: item.variant.price * item.quantity,
    baseAmount: item.variant.listPrice * item.quantity,
    currencyCode,
  })

  return (
    <li
      className={cn(s.root)}
      {...rest}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-2 items-center sm:items-start">
        <div className="w-64 h-64 sm:w-32 sm:h-32 relative overflow-hidden cursor-pointer z-0">
          <Link href={`/product/${item.path}`}>
            <a>
              <Image
                onClick={() => closeSidebarIfPresent()}
                className={s.productImage}
                width={300}
                height={300}
                src={item.variant.image?.url || placeholderImg}
                alt={"Product Image"}
                unoptimized
              />
            </a>
          </Link>
        </div>
        <div className="flex flex-col w-full space-y-1">
          <div className="flex flex-row space-x-2">
            <Link href={`/product/${item.path}`}>
              <a>
                <span
                  className={s.productName}
                  onClick={() => closeSidebarIfPresent()}
                >
                  {item.name}
                </span>
              </a>
            </Link>
            <div className="flex-1 flex flex-row justify-between space-x-2">
              <span> x{quantity} </span>
              <span> {price} </span>
            </div>
          </div>
          <div className="text-sm max-w-fit">
            {item.description}
          </div>
        </div>
      </div>
      <div>{state}</div>
    </li>
  )
}

export default LineItem
