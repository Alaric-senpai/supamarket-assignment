import { LoginForm } from '@/components/forms/LoginForm'
import { Metadata } from 'next'
import React from 'react'
import { ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
    title: "Sign In - Supamarket",
    description: "Login to your Supamarket account to start shopping",
    category: "Auth",
    classification: "Auth",
    openGraph: {
        type: 'website',
        title: "Sign In - Supamarket",
        description: "Access your Supamarket account",
        siteName: "Supamarket"
    }
}

const LoginScreen = () => {
  return (
    <div className='w-full max-w-2xl mx-auto px-4 h-full flex items-center justify-center flex-col gap-6 py-8'>
      {/* Branding */}
      <div className='text-center mb-2'>
        <div className='inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4'>
          <ShoppingCart className='size-8' />
        </div>
        <h1 className='text-3xl font-bold mb-2'>Welcome Back</h1>
        <p className='text-muted-foreground'>Sign in to your Supamarket account</p>
      </div>

      {/* Login Form */}
      <div className='w-full'>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginScreen