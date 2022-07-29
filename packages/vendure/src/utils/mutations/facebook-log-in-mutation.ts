export const facebookLoginMutation = /* GraphQL */ `
  mutation facebookLogin($token: String!) {
    authenticate(input: {
      facebook: { token: $token }
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
