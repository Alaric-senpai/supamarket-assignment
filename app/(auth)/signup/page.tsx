import { Metadata } from 'next'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { SignupForm } from '@/components/forms/RegisterForm'

export const metadata: Metadata = {
    title: "Sign Up - Supamarket",
    description: "Create your Supamarket account to start shopping",
    category: "Auth",
    classification: "Auth",
    openGraph: {
        type: 'website',
        title: "Sign Up - Supamarket",
        description: "Join Supamarket today",
        siteName: "Supamarket"
    }
}

const SignupScreen = () => {
  return (
    <div className='w-full max-w-2xl mx-auto px-4 h-full flex items-center justify-center flex-col gap-6 py-8'>
      {/* Branding */}
      <div className='text-center mb-2'>
        <div className='inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4'>
          <ShoppingCart className='size-8' />
        </div>
        <h1 className='text-3xl font-bold mb-2'>Join Supamarket</h1>
        <p className='text-muted-foreground'>Create an account to start shopping</p>
      </div>

      {/* Register Form */}
      <div className='w-full'>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupScreen
