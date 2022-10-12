import { useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import { Logo, Button } from '@components/ui'
import useLogin from '@framework/auth/use-login'
import { Form, Formik, useField } from 'formik'
import * as Yup from 'yup'
import s from './Form.module.css'
import * as Popover from "@radix-ui/react-popover"
import GoogleLogin from './GoogleLogin'
import FacebookLogin from './FacebookLogin'
import { useCustomer } from '@framework/customer'
import { identify } from '@lib/analyticsjs/methods'

const TextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})

  return (
    <div className={s.fieldset}>
      <label
        className={s.label}
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <Popover.Root
        open={open}
        onOpenChange={
          (open) => {
            setOpen(open && meta.touched && !!errors?.length)
          }
        }
      >
        <Popover.Trigger asChild>
          <input
            className={meta.touched && errors?.length ? s.invalidInput : s.validInput}
            {...field}
            onChange={(event) => {
              setOpen(true)
              field.onChange(event)
            }}
            {...props}
          />
        </Popover.Trigger>
        {!!errorsExceptRequired?.length && (
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              onOpenAutoFocus={(event) => event.preventDefault()}
              className="z-50 border border-secondary bg-primary text-center p-2"
            >
              {errorsExceptRequired.map((error, i) => {
                return (
                  <div key={i}>
                    {error}
                  </div>
                )
              })}
              <Popover.Arrow/>
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
      {meta.touched && errors && (
        <div className="text-red">
          {errors.includes("Required") ? "Required" : "Incorrect"}
        </div>
      )}
    </div>
  )
}

const LoginView: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { setModalView, closeModal } = useUI()

  const { data } = useCustomer()

  const login = useLogin()

  useEffect(() => {
    if (data) {
      identify(data!)
    }
  }, [data])

  return (
    <div className="max-w-min flex flex-col items-center justify-between p-3">
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>
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
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={async (values) => {
          const schema = Yup.object({
            email: Yup.string()
              .email('Must be a valid email address')
              .required('Required'),
            password: Yup.string()
              .required('Required')
              .matches(
                /^(?=.*[a-z])/,
                "Must contain at least 1 lowercase alphabetical character"
              )
              .matches(
                /^(?=.*[A-Z])/,
                "Must contain at least 1 uppercase alphabetical character"
              )
              .matches(
                /^(?=.*[0-9])/,
                "Must contain at least 1  numeric character"
              )
              .matches(
                /^(?=.{8,})/,
                "Must be eight characters or longer"
              ),
          })

          return await schema.validate(values, { abortEarly: false })
            .then(() => {})
            .catch((err: Yup.ValidationError) => {
              const errors = err.inner
              return errors.reduce<{[key: string]: string[]}>((a, error) => {
                const field = error.path
                const params = error.params

                if (!params || !field) {
                  return a
                }

                const errorMessages = error.type !== 'typeError'? (
                  error.errors
                ) : params.originalValue !== "" ? (
                  [`Must be a ${params.type}`]
                ) : (
                  ["Required"]
                )

                return field in a ? (
                  {...a, [field]: [...a[field], ...errorMessages]}
                ) : (
                  {...a, [field]: errorMessages}
                )
              }, {})
            })
        }}
        onSubmit={async (
          {
            email,
            password,
          },
          {setSubmitting},
        ) => {
          setLoading(true)
          try {
            setLoading(true)
            setMessage('')
            await login({
              email,
              password,
            })
            setSubmitting(false)
            setLoading(false)
            closeModal()
          } catch (e: any) {
            setMessage(e.errors[0].message)
            setLoading(false)
          }
        }}
      >
        <Form className="w-full flex flex-col space-y-4">
          <div className="space-y-2">
            <TextInput
              label="Email"
              name="email"
              type="text"
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
            />
          </div>

          <Button
            variant="slim"
            type="submit"
            loading={loading}
          >
            Log In
          </Button>
        </Form>
      </Formik>
      <span className="pt-1 text-center text-sm">
        <span>Don't have an account?</span>
        {` `}
        <a
          className="text-accent-9 font-bold hover:underline cursor-pointer"
          onClick={() => setModalView('SIGNUP_VIEW')}
          >
          Sign Up
        </a>
      </span>
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
