import useGoogleLogin from '@framework/auth/use-google-login'
import { useUI } from '@components/ui/context'
import { useEffect, useState } from 'react'

const GoogleLogin: React.FC = () => {
  const { closeModal } = useUI()
  const [error, setError] = useState('');
  const googleLogin = useGoogleLogin()

  const handleCredentialResponse = async (response: any) => {
    const id = await googleLogin({ token: response.credential })

    if (id) {
      closeModal()
      return
    }
    setError('An error occurred!')
  }

  useEffect(() => {
    (window as any).google.accounts.id.initialize({
      client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      callback: handleCredentialResponse
    })
  }, [])

  useEffect(() => {
    (window as any).google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "filled_blue", size: "large", width: "320" }
    )
  }, [])

  return (
    <div>
      <div id='buttonDiv'></div>
      {error && <div>{error}</div>}
    </div>
  )
}

export default GoogleLogin
