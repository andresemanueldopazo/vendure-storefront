import { MutableRefObject, useEffect, useRef, useState } from 'react'
import useSetCustomerAddress from '@framework/customer/address/use-set-customer-address'
import { useCustomer } from '@framework/customer'
import cn from 'clsx'
import s from './Address.module.css'
import { Button } from '@components/ui'
import * as Popover from "@radix-ui/react-popover"
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { Pencil2Icon } from '@radix-ui/react-icons'

const TextInput = ({ label, setChange, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})
  const [width, setWidth] = useState(0)
  const [editing, setEditing] = useState(false)
  const span = useRef() as MutableRefObject<HTMLSpanElement | null>
  const input = useRef<HTMLInputElement>()

  useEffect(() => {
    if (editing) {
      input?.current?.focus()
    }
  }, [editing])

  useEffect(() => {
    const width = span?.current?.offsetWidth
    setWidth((width || 0) + 20)
  }, [field.value])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <label 
          className={"flex-initial"}
          htmlFor={props.id || props.name}
        >
          {label}
        </label>
        <span
          className="absolute opacity-1 -z-10"
          ref={span}
        >
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
                ref={input}
                className={
                  cn((
                      meta.touched
                      && document.activeElement === input.current
                      && errors?.length
                    ) ?
                      s.invalidInput
                    :
                      s.validInput,
                    !editing && "border-transparent select-none bg-white",
                  )
                }
                style={{ width }}
                {...field}
                onChange={(event) => {
                  setOpen(true)
                  field.onChange(event)
                  setChange(true)
                }}
                onBlur={() => {
                  setEditing(false)
                }}
                {...props}
                value={field.value}
                disabled={!editing}
              />
            </Popover.Trigger>
            {!!errorsExceptRequired?.length && (
              <Popover.Portal>
                <div>
                  <Popover.Content
                    sideOffset={5}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                  >
                    {errorsExceptRequired.map((error, i) => {
                      return (
                        <div
                          key={i}
                          className="bg-red text-center"
                        >
                          {error}
                        </div>
                      )
                    })}
                    <Popover.Arrow/>
                  </Popover.Content>
                </div>
              </Popover.Portal>
            )}
          </Popover.Root>
          <button onClick={() => setEditing(true)}>
            <Pencil2Icon/>
          </button>
        </div>
      </div>
      {meta.touched && errors && (
        <div className="px-4 text-red text-right">
          {errors.includes("Required") ? "Required" : "Incorrect"}
        </div>
      )}
    </div>
  )
}

const AddressForm = () => {
  const setCustomerAddress = useSetCustomerAddress()
  const [change, setChange] = useState(false)  
  const { data } = useCustomer()

  return (
    <div className="flex flex-col">
      {data && (
        <Formik
          initialValues={{
            company: data!.address!.company,
            streetLine: data?.address!.streetLine,
            phoneNumber: data?.address!.phoneNumber,
            province: data?.address!.province,
            postalCode: data?.address!.postalCode,
            city: data?.address!.city,
            country: data?.address!.country,
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
          onSubmit={async ({
              company,
              streetLine,
              phoneNumber,
              postalCode,
              province,
              city,
              country,
            },
            {setSubmitting},
          ) => {
            await setCustomerAddress({
              company,
              streetLine,
              phoneNumber,
              postalCode,
              province,
              city,
              country,
            })
            setChange(false)
            setSubmitting(false)
          }}
        >
          <Form className={s.fieldset}>
            <TextInput
              setChange={setChange}
              label="Company"
              name="company"
              type="text"
            />
            <TextInput
              setChange={setChange}
              label="Street and House Number"
              name="streetLine"
              type="text"
            />
            <TextInput
              setChange={setChange}
              label="Phone Number"
              name="phoneNumber"
              type="text"
            />
            <TextInput
              setChange={setChange}
              label="Postal Code"
              name="postalCode"
              type="text"
            />
            <TextInput
            setChange={setChange}
              label="City"
              name="city"
              type="text"
            />
            <TextInput
              setChange={setChange}
              label="Province"
              name="province"
              type="text"
            />
            <TextInput
              setChange={setChange}
              label="Country"
              name="country"
              type="text"
            />

            {change && (
              <Button
                type="submit"
                width="100%"
                variant="ghost"
              >
                Save changes
              </Button>
            )}
          </Form>
        </Formik>
      )}
    </div>
  )
}

export default AddressForm
