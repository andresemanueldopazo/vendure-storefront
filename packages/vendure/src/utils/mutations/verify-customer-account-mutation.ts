export const verifyCustomerAccountMutation = /* GraphQL */ `
  mutation verifyCustomerAccount($token: String!) {
    verifyCustomerAccount(token: $token) {
      __typename
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`
