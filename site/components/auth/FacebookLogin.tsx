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
    <FacebookLoginButton
      appId={process.env.NEXT_PUBLIC_APP_ID_FACEBOOK_LOGIN!}
      fields="name,email,picture"
      scope="public_profile,email,user_friends"
      onSuccess={handleOnSuccessFacebook}
      onFail={e => console.log("FB login failed:", e.status)}
      render={({ onClick }) =>
        <div className="flex flex-col">
          <Button
            className="gap-2"
            onClick={onClick}
            variant="slim"
            style={{
              backgroundColor: "#4267b2",
              color: "white"
            }}
          >
            <div>
              <img src="f-logo-35x35.png" />
            </div>
            <div>
              Log In with Facebook
            </div>
          </Button>
        </div>
      }
    />
  )
}

export default FacebookLogin
