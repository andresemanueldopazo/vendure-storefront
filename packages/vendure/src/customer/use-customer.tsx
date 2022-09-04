import { SWRHook } from '@vercel/commerce/utils/types'
import useCustomer, {
  UseCustomer,
} from '@vercel/commerce/customer/use-customer'
import { ActiveCustomerQuery } from '../../schema'
import { activeCustomerQuery } from '../utils/queries/active-customer-query'
import { CustomerHook } from '../types/customer'
import { normalizeOrderResume, normalizeCustomerAddress } from '../utils/normalize'


export default useCustomer as UseCustomer<typeof handler>

export const handler: SWRHook<CustomerHook> = {
  fetchOptions: {
    query: activeCustomerQuery,
  },
  async fetcher({ options, fetch }) {
    const { activeCustomer } = await fetch<ActiveCustomerQuery>({
      ...options,
    })
    return activeCustomer ? ({
      firstName: activeCustomer.firstName ?? '',
      lastName: activeCustomer.lastName ?? '',
      email: activeCustomer.emailAddress ?? '',
      address: activeCustomer.addresses && activeCustomer.addresses.length !== 0 ?
        normalizeCustomerAddress(activeCustomer.addresses[0]) : undefined,
      orders: {
        items: activeCustomer.orders.items.map(normalizeOrderResume),
        totalItems: activeCustomer.orders.totalItems,
      },
    }) : null
  },
  useHook:
    ({ useData }) =>
    (input) => {
      return useData({
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        },
      })
    },
}
