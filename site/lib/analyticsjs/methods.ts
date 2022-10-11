import { Customer, Product } from "@commerce/types"

export const identify = (customer: Customer.Customer) => {
  window.analytics!.identify(customer.email, {
    id: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    address: {
      street: customer.address?.streetLine,
      city: customer.address?.city,
      state: customer.address?.province,
      postalCode: customer.address?.postalCode,
      country: customer.address?.country,
    },
    company: customer.address?.company,
    phone: customer.address?.phoneNumber,
  })
}

export const trackProductViewed = (product: Product.Product) => {
  console.dir(product)
  window.analytics!.track('Product Viewed', {
    product_id: product.id,
    sku: product.sku,
    name: product.name,
    price: product.price,
    url: product.path,
    image_url: product.images[0],
  })
}
