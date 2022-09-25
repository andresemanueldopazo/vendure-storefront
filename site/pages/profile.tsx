import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import AddressForm from '@components/customer/AddressForm'
import Address from '@components/customer/Address'
import Name from '@components/customer/Name'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

export default function Profile() {
  const { data } = useCustomer()

  return (
    <Container className="pt-4">
      <Text variant="pageHeading">My Profile</Text>
      {data && (
        <div className="grid gap-8 px-4 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <Name/>
            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Email
              </span>
              <span>{data.email}</span>
            </div>
          </div>
          {data.address? (
            <div>
              <span className="text-lg font-medium text-accent-600 flex-1">
                Address
              </span>
              <Address/>
            </div>
          ) : (
            <AddressForm/>
          )}
        </div>
      )}
    </Container>
  )
}

Profile.Layout = Layout
