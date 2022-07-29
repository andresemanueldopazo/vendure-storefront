export const googleLoginMutation = /* GraphQL */ `
  mutation googleLogin($token: String!) {
    authenticate(input: {
      google: { token: $token }
    }) {
      __typename
      ... on CurrentUser {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`
