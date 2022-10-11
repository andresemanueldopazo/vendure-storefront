import { useState } from 'react'
import useSetCustomerAddress from '@framework/customer/address/use-set-customer-address'
import Button from '@components/ui/Button'
import cn from 'clsx'
import s from './AddressForm.module.css'
import * as Popover from "@radix-ui/react-popover"
import * as Dialog from '@radix-ui/react-dialog'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { useTheme } from 'next-themes'

const TextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})

  return (
    <div>
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
              className="z-40"
            >
              {errorsExceptRequired.map((error, i) => {
                return (
                  <div
                    key={i}
                    className="border border-secondary bg-primary text-center"
                  >
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

const AddressForm = () => {
  const setCustomerAddress = useSetCustomerAddress()
  const { theme } = useTheme()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>
          Add address
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "z-40 fixed inset-0 grid justify-items-center items-center",
            theme === "light" ? "bg-black/30" : "bg-white/30",
          )}
        >
          <Dialog.Content
            className="fixed w-3/4 sm:w-3/5 md:w-2/5 overflow-y-auto max-h-screen p-2 bg-primary"
          >
            <Formik
              initialValues={{
                company: '',
                streetLine: '',
                phoneNumber: '',
                province: '',
                postalCode: '',
                city: '',
                country: '',
              }}
              validate={async (values) => {
                const schema = Yup.object({
                  streetLine: Yup.string()
                    .required('Required'),
                  phoneNumber: Yup.number()
                    .positive('Must be a positive number')
                    .required('Required'),
                  city: Yup.string()
                    .required('Required'),
                  province: Yup.string()
                    .required('Required'),
                  postalCode: Yup.string()
                    .required('Required'),
                  country: Yup.string()
                    .required('Required'),
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
                  phoneNumber,
                  company,
                  streetLine,
                  postalCode,
                  province,
                  city,
                  country,
                },
                {setSubmitting},
              ) => {
                await setCustomerAddress({
                  phoneNumber,
                  company,
                  streetLine,
                  postalCode,
                  province,
                  city,
                  country,
                })
                setSubmitting(false)
              }}
            >
              <Form className={s.fieldset}>
                <TextInput
                  label="Company"
                  name="company"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="Street and House Number"
                  name="streetLine"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="Phone Number"
                  name="phoneNumber"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="Province"
                  name="province"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="Postal Code"
                  name="postalCode"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="City"
                  name="city"
                  type="text"
                  placeholder="Jane"
                />
                <TextInput
                  label="Country"
                  name="country"
                  type="text"
                  placeholder="Jane"
                />

                <Button
                  type="submit"
                  width="100%"
                  variant="ghost"
                >
                  Save
                </Button>
              </Form>
            </Formik>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddressForm
