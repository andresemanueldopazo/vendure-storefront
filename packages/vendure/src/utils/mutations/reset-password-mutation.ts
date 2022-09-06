export const resetPasswordMutation = /* GraphQL */ `
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      __typename
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`
