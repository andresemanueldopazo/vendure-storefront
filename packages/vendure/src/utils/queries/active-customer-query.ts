import { orderResumeFragment } from '../fragments/order-resume-fragment'

export const activeCustomerQuery = /* GraphQL */ `
  query activeCustomer {
    activeCustomer {
      firstName
      lastName
      emailAddress
      orders(options: { filter: { state: {notIn: ["AddingItems"] } }, sort: { orderPlacedAt: DESC } } ) {
        items {
          ...OrderResume
        }
        totalItems
      }
    }
  }
  ${orderResumeFragment}
`
