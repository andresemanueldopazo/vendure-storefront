import { useRef, useState } from 'react'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Button } from '@components/ui'
import { useCustomer } from '@framework/customer'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Popover from "@radix-ui/react-popover"
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import useUpdateCustomer from '@framework/customer/use-update-customer'

const TextInput = ({ label, setChange, ...props }: any) => {
  const [field, meta] = useField(props)
  const [open, setOpen] = useState(false)
  const errors = (meta.error as unknown) as string[] | undefined
  const errorsExceptRequired = errors?.filter((error) => { return error !== "Required"})
  const input = useRef<HTMLInputElement>()

  return (
    <div className="flex flex-col">
      <label
        className="flex flex-col text-accent-7 uppercase text-xs font-medium mb-2"
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
            ref={input}
            className={
              meta.touched && errors?.length ?
                `p-2 border border-red w-full text-sm font-normal
                focus:outline-none focus:shadow focus:shadow-red`
              : 
                "p-2 border w-full text-sm font-normal focus:outline-none focus:shadow"
              }
            {...field}
            onChange={(event) => {
              setOpen(true)
              field.onChange(event)
              setChange(true)
            }}
            {...props}
            value={field.value}
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
      {meta.touched && errors && (
        <div className="text-red">
          {errors.includes("Required") ? "Required" : "Incorrect"}
        </div>
      )}
    </div>
  )
}

const Name = () => {
  const setCustomer = useUpdateCustomer()
  const [change, setChange] = useState(false)  
  const [open, setOpen] = useState(false)  
  const { data } = useCustomer()

  return (
    <Collapsible.Root
      className="flex flex-col"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-row items-center justify-between py-4">
        <span className="text-lg font-medium text-accent-600 flex-1">
          Full Name
        </span>
        {!open && (
          <div className="flex flex-row items-center justify-between space-x-2">
            <span>{`${data!.firstName} ${data!.lastName}`}</span>
            <Collapsible.Trigger
              className="cursor-pointer"
              asChild
            >
              <Pencil2Icon/>
            </Collapsible.Trigger>
          </div>
        )}
      </div>
      <Collapsible.Content>
          {data && (
            <Formik
              initialValues={{
                firstName: data.firstName,
                lastName: data.lastName,
              }}
              validate={async (values) => {
                const schema = Yup.object({
                  firstName: Yup.string()
                    .required('Required'),
                  lastName: Yup.string()
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
                  firstName,
                  lastName,
                },
                {setSubmitting},
              ) => {
                if (change) {
                  await setCustomer({
                    firstName,
                    lastName,
                  })
                }
                setSubmitting(false)
                setOpen(false)
              }}
            >
              <Form
                className="space-y-3"
              >
                <TextInput
                  setChange={setChange}
                  label="firstName"
                  name="firstName"
                  type="text"
                />
                <TextInput
                  setChange={setChange}
                  label="LastName"
                  name="lastName"
                  type="text"
                />

                <div className="flex flex-row">
                  <Button
                    type="submit"
                    width="50%"
                    variant="ghost"
                  >
                    Save changes
                  </Button>
                  <Button
                    width="50%"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Formik>
          )}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default Name
