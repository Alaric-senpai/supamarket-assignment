import { LoginForm } from '@/components/forms/LoginForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
    title: "Sign in - Next appwrite",
    description: "login a user account for a client ro join the system",
    category: "Auth",
    classification: "Auth",
    openGraph: {
        type: 'website',
        title: "log in - Next Appwrite",
        description: "login into account page for the starter project",
        siteName: "NextAppwrite"
    }
}

const LoginScreen = () => {
  return (
    <div className='w-full min-w-md h-full flex items-center justify-center flex-col gap-4'>
        <LoginForm />
    </div>
  )
}

export default LoginScreen