import { CustomerAddress } from './address';
// import { ShippingMethod } from '../shipping/method'
// import { ShippingAddress } from '../shipping/address'
// import { Discount } from 'types/common';
export * as Card from './card'
export * as Address from './address'
export * as Password from './password'

export type OrderResume = {
  code: string;
  orderPlacedAt: any;
  shippingWithTax: number;
  state: string;
  totalPrice: number;
  currency: {
    code: string;
  };
  shippingAddress: {
    streetLine: string;
    city: string;
    province: string;
    country: string;
  };
  // shippingAddress: ShippingAddress;
  // shippingMethod: Omit<ShippingMethod, 'id' | 'discounts'>;
  lineItems: {
    id: string;
    quantity: number;
    name: string;
    description: string;
    variant: {
      price: number;
      listPrice: number;
      image?: {
          url: string;
      };
    };
    path: string;
    fulfillments: {
      state: string;
      method: string;
      trackingCode?: string | null;
      quantity: number;
    }[];
  }[],
  // discounts: Discount[];
}

export type Customer = {
  orders: {
    items: OrderResume[];
    totalItems: number;
  },
  firstName: string,
  lastName: string,
  phoneNumber?: number
  email: string,
  address?: CustomerAddress
}

export type CustomerTypes = {
  customer: Customer
}

export type CustomerHook<T extends CustomerTypes = CustomerTypes> = {
  data: T['customer'] | null
  fetchData: { customer: T['customer'] } | null
}

export type UpdateCustomerHook<T extends CustomerTypes = CustomerTypes> = {
  data: null
  fetcherInput: Pick<T['customer'], 'firstName' | 'lastName' | 'phoneNumber'>
  actionInput: Pick<T['customer'], 'firstName' | 'lastName' | 'phoneNumber'>
}

export type CustomerSchema<T extends CustomerTypes = CustomerTypes> = {
  endpoint: {
    options: {}
    handlers: {
      getLoggedInCustomer: {
        data: { customer: T['customer'] } | null
      }
    }
  }
}
