import React, { InputHTMLAttributes, useEffect, useState } from 'react'
import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import * as Popover from "@radix-ui/react-popover"
import cn from 'clsx'
import s from './PasswordReset.module.css'
import useResetPassword from '@framework/customer/password/use-reset-password'
import { useRouter } from 'next/router'
import { Form, Formik, useField } from 'formik'
import * as Yup from 'yup'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  type: string
}

const TextInput = ({ label, ...props }: InputProps) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})

  return (
    <div className="flex flex-col">
      <label
        className={s.label}
        htmlFor={props.name}
      >
        {label}
      </label>
      <span className="absolute opacity-1 -z-10">
        {field.value}
      </span>
      <div className="flex flex-row items-center">
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
              className={
                cn((
                    meta.touched
                    && errors?.length
                  ) ?
                    s.invalidInput
                  :
                    s.validInput,
                )
              }
              {...field}
              onChange={(event) => {
                setOpen(true)
                field.onChange(event)
              }}
              {...props}
              value={field.value}
            />
          </Popover.Trigger>
          {!!errorsExceptRequired?.length && (
            <Popover.Portal>
              <div>
                <Popover.Content
                  className="border border-secondary bg-primary px-1 text-center"
                  sideOffset={5}
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  {errorsExceptRequired.map((error, i) => {
                    return (
                      <div key={i}>
                        {error}
                      </div>
                    )
                  })}
                  <Popover.Arrow
                    className="fill-secondary"
                  />
                </Popover.Content>
              </div>
            </Popover.Portal>
          )}
        </Popover.Root>
      </div>
      {meta.touched && errors && (
        <div className="text-red text-center">
          {errors.includes("Required") ? "Required" : "Incorrect"}
        </div>
      )}
    </div>
  )
}

export default function PasswordReset() {
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [message, setMessage] = useState("")
  const [token, setToken] = useState("")
  const resetPassword = useResetPassword()
  const router = useRouter()

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "")
  }, [])

  return (
    <Container className="pt-4">
      {token && (
        <Formik
          initialValues={{
            password: "",
          }}
          validate={async (values) => {
            const schema = Yup.object({
              password: Yup.string()
                .required("Required")
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

                  if (!params || field !== "password") {
                    return a
                  }

                  const errorMessages = error.type !== "typeError" ? (
                    error.errors
                  ) : params.originalValue !== "" ? (
                    [`Must be a ${params.type}`]
                  ) : (
                    ["Required"]
                  )

                  return {"password": [...a["password"] || [], ...errorMessages]}
                }, {})
              })
          }}
          onSubmit={async (
            { password },
            { setSubmitting },
          ) => {
            try {
              await resetPassword({
                token,
                password,
              })
              setSubmitting(false)
              router.push("/")
            } catch (e: any) {
              setMessage(e.errors[0].message)
              setLoading(false)
              setDisabled(false)
            }
          }}
        >
          <Form className={s.fieldset}>
            <div className="w-80  flex flex-col space-y-4">
              {message && (
                <div className="text-red border border-red p-3">{message}</div>
                )}
              <TextInput
                label="Password"
                name="password"
                type="password"
              />

              <div className="pt-2 w-full flex flex-col">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  disabled={disabled}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </Container>
  )
}

PasswordReset.Layout = Layout
