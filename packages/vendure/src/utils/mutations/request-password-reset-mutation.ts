export const requestPasswordResetMutation = /* GraphQL */ `
  mutation requestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      __typename
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`
