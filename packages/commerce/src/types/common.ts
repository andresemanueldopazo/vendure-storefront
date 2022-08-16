export type Discount = {
  // The value of the discount
  value: number
  description: string
}

export type Measurement = {
  value: number
  unit: 'KILOGRAMS' | 'GRAMS' | 'POUNDS' | 'OUNCES'
}

export type Image = {
  url: string
  altText?: string
  width?: number
  height?: number
}
