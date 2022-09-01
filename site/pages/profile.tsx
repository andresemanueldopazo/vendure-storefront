import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import AddressForm from '@components/customer/AddressForm'
import { useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Container className="pt-4 ">
      <Text variant="pageHeading">My Profile</Text>
      {data && (
        <div className="grid gap-10 px-4 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Full Name
              </span>
              <span>{`${data.firstName} ${data.lastName}`}</span>
            </div>
            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Email
              </span>
              <span>{data.email}</span>
            </div>
          </div>
          {data.address? (
            <div className="flex flex-col">
              <span className="text-lg text-center font-medium text-accent-600 flex-1">
                Address
              </span>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent flex-1">
                  Company
                </span>
                <span className="break-words">{data.address?.company}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent flex-1">
                  Street Line
                </span>
                <span>{data.address?.streetLine}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent-600 flex-1">
                  City
                </span>
                <span>{data.address?.city}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent-600 flex-1">
                  Province
                </span>
                <span>{data.address?.province}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent-600 flex-1">
                  Country
                </span>
                <span>{data.address?.country}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent-600 flex-1">
                  Postal Code
                </span>
                <span>{data.address?.postalCode}</span>
              </div>
              <div className="flex flex-row items-center space-x-4 py-4">
                <span className="font-medium text-accent-600 flex-1">
                  Phone Number
                </span>
                <span>{data.address?.phoneNumber}</span>
              </div>
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
