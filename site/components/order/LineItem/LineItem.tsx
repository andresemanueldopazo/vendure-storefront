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
  withDescription,
  currencyCode,
  ...rest
}: {
  item: OrderResume['lineItems'][number],
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
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 text-base">
          <div className="flex flex-row justify-between space-x-2">
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
            <span>x{item.quantity}</span>
          </div>
          <span>{price}</span>
        </div>
        <div className={cn("hidden", {"sm:inline":withDescription})}>
          {item.description}
        </div>
      </div>
    </li>
  )
}

export default LineItem
