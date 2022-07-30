import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import s from './LineItem.module.css'
import { useUI } from '@components/ui/context'
import usePrice from '@framework/product/use-price'
import { OrderResume } from '@commerce/types/customer'

const placeholderImg = '/product-img-placeholder.svg'

const LineItem = ({
  item,
  currencyCode,
  ...rest
}: {
  item: OrderResume['lineItems'][number],
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
      <div className="flex flex-row justify-items-center space-x-4 py-4">
        <div className="w-16 h-16 bg-violet relative overflow-hidden cursor-pointer z-0">
          <Link href={`/product/${item.path}`}>
            <a>
              <Image
                onClick={() => closeSidebarIfPresent()}
                className={s.productImage}
                width={150}
                height={150}
                src={item.variant.image?.url || placeholderImg}
                alt={"Product Image"}
                unoptimized
              />
            </a>
          </Link>
        </div>
        <div className="flex-1 flex flex-col text-base">
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
        </div>
        <div className="flex flex-col justify-between space-y-2 text-sm">
          <span> {item.quantity} </span>
          {price &&
            <span> {price} </span>
          }
        </div>
      </div>
    </li>
  )
}

export default LineItem
