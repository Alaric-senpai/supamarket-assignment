import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex relative items-start justify-center p-4 md:p-8 bg-gradient-to-br from-background via-secondary/5 to-background dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 w-screen min-h-screen overflow-y-auto'>
      
      {/* Decorative gradient orbs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl'></div>
      </div>

      {/* Back to Home Button */}
      <Button 
        asChild 
        variant="outline" 
        className='absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl backdrop-blur-md bg-background/80 dark:bg-background/50 border-border/50 dark:border-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 group z-10'
      >
        <Link href={'/'}>
          <ArrowLeft className='size-4 group-hover:-translate-x-1 transition-transform' />
          <span className='font-medium'>Home</span>
        </Link>
      </Button>

      {/* Content with no max-width constraints */}
      <div className='relative z-10 w-full max-w-7xl mx-auto pt-16 md:pt-20'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout