import { useUI } from '@components/ui/context'
import useFacebookLogin from '@framework/auth/use-facebook-login'
import { useEffect, useState } from 'react'

const FacebookLogin: React.FC = () => {
  const { closeModal } = useUI()
  const [error, setError] = useState('')
  const [isValidMethod, setIsValidMethod] = useState(true)
  const facebookLogin = useFacebookLogin()

  useEffect(() => {
    window.FB!.init({
      appId: process.env.NEXT_PUBLIC_APP_ID_FACEBOOK_LOGIN!,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v14.0',
    })
  }, [])

  useEffect(() => {
    window.handleOnSuccessFacebook = function () {
      window.FB!.getLoginStatus(login)
    }
    return () => {
      delete window.handleOnSuccessFacebook
    }
  }, [])

  useEffect(() => {
    window.FB!.XFBML.parse()
  }, [])

  const login = async (response: FacebookSDKLoginStatus) => {
    const { status, authResponse } = response
    if (status === 'connected') {
      const id = await facebookLogin({
        token: authResponse.accessToken
      })
      if (id) {
        closeModal()
        return
      }
      setError("Log in with Facebook is not available")
      setIsValidMethod(false)
      return
    }
    setError('An error occurred!')
  }

  return (
    <div>
      {isValidMethod &&
        <div className="hover:opacity-80">
          <div
            className="fb-login-button"
            data-width="320"
            data-size="large"
            data-button-type="continue_with"
            use-continue-as="true"
            data-layout="default"
            data-auto-logout-link="false"
            data-use-continue-as="false"
            data-scope="public_profile,email"
            data-onlogin="handleOnSuccessFacebook"
          />
        </div>}
      {error && <div>{error}</div>}
    </div>
  )
}

export default FacebookLogin
