import { SignupForm } from '@/components/forms/RegisterForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
    title: "Sign up - Next appwrite",
    description: "Create a user account for a client ro join the system",
    category: "Auth",
    classification: "Auth",
    openGraph: {
        type: 'website',
        title: "sign Up - Next Appwrite",
        description: "Create account page for the starter project",
        siteName: "NextAppwrite"
    }
}

const SignupScreen = () => {
  return (
    <div className='w-full min-w-md h-full flex items-center justify-center flex-col gap-4'>
        <SignupForm />
    </div>
  )
}

export default SignupScreen
