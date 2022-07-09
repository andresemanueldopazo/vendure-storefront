export const facebookLoginMutation = /* GraphQL */
` mutation Authenticate($token: String!) {
    authenticate(input: {
      facebook: { token: $token }
    }) {
    ...on CurrentUser {
        id
        identifier
    }
  }
}`
