import { useUI } from '@components/ui/context'
import FacebookLoginButton, { LoginResponse } from '@greatsumini/react-facebook-login'
import useFacebookLogin from '@framework/auth/use-facebook-login'
import { Button } from '@components/ui'

const FacebookLogin: React.FC = () => {
  const { closeModal } = useUI()

  const facebookLogin = useFacebookLogin()

  const handleOnSuccessFacebook = async (
    response: LoginResponse['authResponse']
  ) => {
    if (response) {
      await facebookLogin({
        token: response.accessToken,
      })
      closeModal()
    } else {
      console.log('Facebook authentication failed!')
    }
  }

  return (
    <div className="w-80 flex flex-col justify-between p-3">
      <FacebookLoginButton
        appId={process.env.NEXT_PUBLIC_APP_ID_FACEBOOK_LOGIN!}
        fields="name,email,picture"
        scope="public_profile,email,user_friends"
        onSuccess={handleOnSuccessFacebook}
        onFail={e => console.log('FB login failed:', e.status)}
      />
    </div>
  )
}

export default FacebookLogin
