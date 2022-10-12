import { useState } from 'react'
import { useUI } from '@components/ui/context'
import { Logo, Button } from '@components/ui'
import useSignup from '@framework/auth/use-signup'
import s from './Form.module.css'
import * as Popover from "@radix-ui/react-popover"
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

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

const SignUpView = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const signup = useSignup()
  const { setModalView, closeModal } = useUI()

  return (
    <div className="flex flex-col w-80">
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>
      {message && (
        <div className="text-red border border-red pb-12">
          {message}
        </div>
      )}
      <Formik
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        }}
        validate={async (values) => {
          const schema = Yup.object({
            email: Yup.string()
              .email('Must be a valid email address')
              .required('Required'),
            firstName: Yup.string()
              .required('Required'),
            lastName: Yup.string()
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
            firstName,
            lastName,
            password,
          },
          {setSubmitting},
        ) => {
          setLoading(true)
          try {
            await signup({
              email,
              firstName,
              lastName,
              password,
            })
            setLoading(false)
            closeModal()
            setSubmitting(false)
          } catch (e: any) {
            setMessage(e.errors[0].message)
            setLoading(false)
          }
        }}
      >
        <Form className="flex flex-col space-y-4">
          <div className="space-y-2">
            <TextInput
              label="First Name"
              name="firstName"
              type="text"
            />
            <TextInput
              label="Last name"
              name="lastName"
              type="text"
            />
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
            Sign Up
          </Button>
        </Form>
      </Formik>
      <span className="pt-1 text-center text-sm">
        <span className="text-accent-7">Do you have an account?</span>
        {` `}
        <a
          className="text-accent-9 font-bold hover:underline cursor-pointer"
          onClick={() => setModalView('LOGIN_VIEW')}
        >
          Log In
        </a>
      </span>
    </div>
  )
}

export default SignUpView
