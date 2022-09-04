export const createCustomerAddressMutation = /* GraphQL */ `
  mutation createCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      __typename
      id
      fullName
      company
      streetLine1
      city
      province
      postalCode
      country {
        id
        createdAt
        updatedAt
        languageCode
        code
        name
        enabled
        translations {
          id
          createdAt
          updatedAt
          languageCode
          name
        }
      }
      phoneNumber
    }
  }
`
