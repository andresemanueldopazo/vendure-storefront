export type Coupon = {
  code: string
}

export type CouponTypes = {
  coupon: Coupon
}

export type AddItemHook<T extends CouponTypes = CouponTypes> = {
  data: null
  fetcherInput: T['coupon']
  body: T['coupon']
  actionInput: T['coupon']
}

export type RemoveItemHook<T extends CouponTypes = CouponTypes> = {
  data: null
  fetcherInput: T['coupon']
  body: T['coupon']
  actionInput: T['coupon']
}
