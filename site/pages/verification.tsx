import React, { useEffect, useState } from 'react'
import { Layout } from '@components/common'
import { Container } from '@components/ui'
import useVerifyCustomerAccount from '@framework/auth/use-verify-customer-account'

export default function Verification() {
  const [message, setMessage] = useState('')
  const verifyCustomerAccount = useVerifyCustomerAccount()
  
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      'token'
    )
    if (token) {
      (async () => {
          try {
            await verifyCustomerAccount({ token })
            setMessage('Your account has been verified')
          }
          catch (e: any) {
            setMessage(e.message)
          }
      })();
    }
  }, [verifyCustomerAccount])

  return (
    <Container className="pt-4">
      {message && <div>{message}</div>}
    </Container>
  )
}

Verification.Layout = Layout
