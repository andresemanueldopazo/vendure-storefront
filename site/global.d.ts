// Declarations for modules without types
declare module 'next-themes'

type FacebookSDKLoginStatus = {
  status: 'connected' | 'not_authorized' | 'unknown',
  authResponse: {
    accessToken: string,
  }
}

type FacebookSDKInitParams = {
  appId: string,
  autoLogAppEvents: bool,
  xfbml: bool,
  version: string,
}

interface Window {
  FB?: {
    init: (params: FacebookSDKInitParams) => void,
    getLoginStatus: (
      callback: (response: FacebookSDKLoginStatus) => void,
    ) => void,
    XFBML: {
      parse: () => void,
    },
    Event: {
      subscribe: (event: string, callback: () => void) => void,
    },
  }
  handleOnSuccessFacebook?: () => void,
}
