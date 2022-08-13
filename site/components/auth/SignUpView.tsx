import { FC, useState, HTMLInputTypeAttribute } from 'react'
import { validate } from 'email-validator'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { InputProps } from '@components/ui/Input/Input'
import useSignup from '@framework/auth/use-signup'
import { useTheme } from 'next-themes'

interface Props {}

const SignUpView: FC<Props> = () => {
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const { inputs, allInputDataIsValid, ValidatedInputs } =
    useValidatedInputs(dirty, [
      {
        placeholder: "First Name",
        initialState: "",
        validator: n => !!n,
        errorMsgWhenInvalid: "A first name is required.",
      },
      {
        placeholder: "Last Name",
        initialState: "",
        validator: n => !!n,
        errorMsgWhenInvalid: "A last name is required.",
      },
      {
        inputType: "email",
        placeholder: "Email",
        initialState: "",
        validator: validate,
        errorMsgWhenInvalid: "Provided email is invalid.",
      },
      {
        inputType: "password",
        placeholder: "Password",
        initialState: "",
        validator: p => /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(p) && p.length >= 7,
        errorMsgWhenInvalid: "Password is invalid.",
      }
    ])

  const signup = useSignup()
  const { setModalView, closeModal } = useUI()

  const handleSignup = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    setLoading(true)
    setDirty(true) // at least one form submission

    if (allInputDataIsValid) {
      try {
        const [firstName, lastName, email, password] = inputs
        await signup({
          email,
          firstName,
          lastName,
          password,
        })
        setLoading(false)
        closeModal()
      } catch ({ errors }) {
        console.error(errors)
      }
    }
    setLoading(false)
    setDisabled(false)
  }

  return (
    <form
      onSubmit={handleSignup}
      className="w-80 flex flex-col justify-between p-1"
    >
      <div className="flex justify-center pb-6">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col">
        {ValidatedInputs}
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={disabled}
          >
            Sign Up
          </Button>
        </div>
        <HiddenTextPlaceholder />
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
    </form>
  )
}

type Pred<S> = (s: S) => boolean

type HookValidatedInputs<S> = (dirty: boolean, inputFields: InputFields<S>) => {
  inputs: S[]
  allInputDataIsValid: boolean
  ValidatedInputs: JSX.Element
}

type InputFields<S> = Array<{
  initialState: S
  placeholder: string
  validator: Pred<S>
  errorMsgWhenInvalid: string
  inputType?: HTMLInputTypeAttribute | undefined
}>

/**
 * Hook to simplify inputs field component creation and validation.
 * @param dirty Must be true only if the form was submitted *at least* once.
 * @param anInputField.placeholder String to render when the input field is empty.
 * @param anInputField.validator Function which decides if the entered input is valid or not.
 * @param anInputField.errorMsgWhenInvalid Rendered when there was at least one form submission (dirty to true) and the input is invalid according to its validator.
 * @param anInputField.inputType of the Input component, e.g. "password", "email", undefined if is a common string, etc.
 * @returns an object with the contents of every input field (in the order given in InputFields value), whether all the current inputs are valid, and a JSX element representing all the input fields ready to be rendered.
 */
function useValidatedInputs<S>(
  dirty: boolean,
  inputFields: InputFields<S>
): ReturnType<HookValidatedInputs<S>> {
  const currentInputsState: ReturnType<HookValidStates<S>> = useValidStates<S>(
    inputFields.map(({ initialState, validator }) => ({ initialState, validator}))
  )
  const ValidatedInputs =
    <>
      {inputFields.map((inputField, i) => {
        const { placeholder, errorMsgWhenInvalid, inputType } = inputField
        const { isValid, setInput } = currentInputsState[i]
        return (
          <ValidatedInput
            key={i}
            inputIsValid={isValid}
            dirty={dirty}
            errorMsgWhenInvalid={errorMsgWhenInvalid}
            type={inputType}
            placeholder={placeholder}
            onChange={setInput}
          />
        )
      })}
    </>

  return {
    inputs: currentInputsState.map(({ state }) => state),
    allInputDataIsValid: currentInputsState.every(({ isValid }) => isValid),
    ValidatedInputs
  }
}

type HookValidStates<S> = (ss: Array<{
  initialState: S
  validator: Pred<S>
}>) => Array<{
  state: S
  isValid: boolean
  setInput: React.Dispatch<React.SetStateAction<S>>
}>

/**
 * Hook to give an array of stateful values along with their corresponding state of validity and setter.
 * @returns An arrays of objects that contain: the state value, its validity state and its setter.
 */
const useValidStates = <S,>(ss: Parameters<HookValidStates<S>>[0]) => {
  const initialStates = ss.map(({ initialState }) => initialState)
  const validators = ss.map(({ validator }) => validator)

  const [[states, areValid], setValidatedStates] = useState<[S[], boolean[]]>(
    [initialStates, validators.map((v, i) => v(initialStates[i]))]
  )
  const setters = [...Array(states.length)].map(
    (_, i) => (s: S) => setValidatedStates(
      ([prevStates, prevAreValid]) => {
        prevStates[i] = s
        prevAreValid[i] = validators[i](s)
        return [prevStates, prevAreValid]
      }
    )
  )
  return states.map((state, i) => (
    {
      state,
      isValid: areValid[i],
      setInput: setters[i]
    }
  )) as ReturnType<HookValidStates<S>>
}

function useValidState<S>(
  initialState: S,
  validator: Pred<S>
): [S, boolean, React.Dispatch<React.SetStateAction<S>>] {
  const [[st, isValid], setValidatedState] = useState<[S, boolean]>(
    [initialState, validator(initialState)]
  )
  const stateSetter = (s: S) => setValidatedState([s, validator(s)])
  return [st, isValid, stateSetter as React.Dispatch<React.SetStateAction<S>>]
}

type ValidatedInputProps = {
  inputIsValid: boolean
  dirty: boolean
  errorMsgWhenInvalid: string
} & InputProps

const ValidatedInput: FC<ValidatedInputProps> = ({ inputIsValid, dirty, errorMsgWhenInvalid, ...rest }) => {
  return !dirty
    ? <>
        <Input className='mt-1' {...rest} />
        <HiddenTextPlaceholder />
      </>
    : <>
        <Input
          className='mt-1'
          style={!inputIsValid ? { borderColor: "red" } : {}}
          {...rest}
        />
        {inputIsValid
          ? <HiddenTextPlaceholder />
          : <div className='text-accent-8'>
              <span className="inline-block align-middle">
                <Info width="14" height="14" stroke="red" />
              </span>
              {` `}
              <span
                className="leading-1 text-xs inline-block max-h-px"
                style={{color: "red"}}
              >
                {errorMsgWhenInvalid}
              </span>
            </div>
        }
      </>
}

const HiddenTextPlaceholder = () => {
  const { theme } = useTheme()
  return <div style={{color: theme === "light" ? "white" : "black"}}>.</div>
}

export default SignUpView
