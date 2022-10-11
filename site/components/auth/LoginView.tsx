import { FC, useEffect, useState, useCallback } from 'react'
import { Logo, Button, Input } from '@components/ui'
import useLogin from '@framework/auth/use-login'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import { identify } from '@lib/analyticsjs/methods'
import { useCustomer } from '@framework/customer'

const LoginView: React.FC = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { setModalView, closeModal } = useUI()

  const { data } = useCustomer()

  const login = useLogin()

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }

    try {
      setLoading(true)
      setMessage('')
      await login({
        email,
        password,
      })
      setLoading(false)
      closeModal()
    } catch (e: any) {
      setMessage(e.errors[0].message)
      setLoading(false)
      setDisabled(false)
    }
  }

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword)
    }
  }, [email, password, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  useEffect(() => {
    if (data) {
      identify(data!)
    }
  }, [data])

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-3 pb-6"
      >
          {message && (
            <div className="text-red border border-red p-3">
              {message}. Did you {` `}
              <a
                className="text-accent-9 inline font-bold hover:underline cursor-pointer"
                onClick={() => setModalView('FORGOT_VIEW')}
              >
                forgot your password?
              </a>
            </div>
          )}
          <Input type="email" placeholder="Email" onChange={setEmail} />
          <Input type="password" placeholder="Password" onChange={setPassword} />

          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={disabled}
          >
            Log In
          </Button>
      </form>
      <div className="text-center text-sm pb-3">
        <span>Don't have an account?</span>
        {` `}
        <a
          className="text-accent-9 font-bold hover:underline cursor-pointer"
          onClick={() => setModalView('SIGNUP_VIEW')}
          >
          Sign Up
        </a>
      </div>
      <div className='flex justify-between place-items-center pb-4'>
        <div className='bg-slate-400 h-px basis-5/12'></div>
        <div className="text-sm">
          or
        </div>
        <div className='bg-slate-400 w-40 h-px basis-5/12'></div>
      </div>
      <div className="h-[95px] w-[320px] space-y-3">
        <div>
          <GoogleLogin/>
        </div>
        <div>
          <FacebookLogin/>
        </div>
      </div>
    </div>
  )
}

export default LoginView
