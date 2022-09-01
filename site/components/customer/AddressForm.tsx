import { useState } from 'react'
import Button from '@components/ui/Button'
import useSetCustomerAddress from '@framework/customer/address/use-set-customer-address'
import * as Popover from "@radix-ui/react-popover"
import * as Dialog from '@radix-ui/react-dialog'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import s from './AddressForm.module.css'

const TextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  console.dir(errors)
  return (
    <div className={s.fieldset}>
      <label className={s.label} htmlFor={props.id || props.name}>{label}</label>
      <Popover.Root
        open={open}
        onOpenChange={
          (open) => {
            setOpen(open && meta.touched && errors?.length != 0)
          }
        }
      >
        <Popover.Trigger asChild>
          <input
            className={(meta.touched && errors?.length)? s.invalidInput : s.validInput}
            {...field}
            onChange={(event) => {
              setOpen(true)
              field.onChange(event)
            }}
            {...props}
          />
        </Popover.Trigger>
        {!!errors?.filter((error) => { return error !== "Required"}).length && (
          <Popover.Portal>
            <div>
              <Popover.Content
                sideOffset={5}
                onOpenAutoFocus={(event) => event.preventDefault()}
              >
                {((errors as unknown) as string[])?.map((item) => {
                  return (
                    <div className="bg-red text-center">{item}</div>
                  )
                })}
                <Popover.Arrow/>
              </Popover.Content>
            </div>
          </Popover.Portal>
        )}
      </Popover.Root>
      {meta.touched && errors?.length && (
        errors.includes("Required") ? (
          <div className="text-red">Required</div>
        ) : (
          <div className="text-red">Incorrect</div>
        )
      )}
    </div>
  )
}

const AddressForm = () => {
  const setCustomerAddress = useSetCustomerAddress()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>
          Add address
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div>
          <Dialog.Overlay
            className="fixed inset-0 grid justify-items-center items-center bg-black/30"
          >
            <Dialog.Content
              className="fixed overflow-y-auto max-h-screen p-2 bg-white"
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
                    company: Yup.string()
                      .required('Required'),
                    streetLine: Yup.string()
                      .required('Required'),
                    phoneNumber: Yup.string()
                      .required('Required'),
                    city: Yup.string()
                      .required('Required'),
                    province: Yup.string()
                      .required('Required'),
                    postalCode: Yup.string()
                      .max(2, 'Must be 20 characters or less')
                      .required('Required')
                      .email("Must be a email"),
                    country: Yup.string()
                      .required('Required'),
                  })

                  return await schema.validate(values, { abortEarly: false })
                    .then(() => {})
                    .catch((err: Yup.ValidationError) => {
                      return err.inner.reduce<{[key: string]: string[]}>((a, i, n) => {
                        const path = i.path!
                        const errors = i.errors
                        return path in a? {...a, [path]: [...a[path], ...errors] } : {...a, [path]: errors}
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
                <Form className={s.fieldSet}>
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
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddressForm
