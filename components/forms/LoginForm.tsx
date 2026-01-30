// @ts-nocheck

"use client"
import * as z from "zod"
import {  LoginformSchema } from '@/lib/form-schema'
import { LoginserverAction } from '@/actions/auth.actions'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useAction } from "next-safe-action/hooks"
import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Password } from "@/components/ui/password"
import { SocialLogin } from "./SocialLogin"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { logger } from "@/config/helpers"

type Schema = z.infer<typeof LoginformSchema>;

export function LoginForm() {

const router = useRouter();
const form = useForm<Schema>({
  resolver: zodResolver(LoginformSchema as any),
  defaultValues: {
    email: "",
    password: ""
  }
})
const formAction = useAction(LoginserverAction, {
  onSuccess: async(data) => {
    form.reset();
    
    // Access the nested role from data.data.data.role
    const role = data?.data?.data?.role;

    console.log(data)

    logger.debug(role, 'role')
    
    console.log('Login successful, role:', role);
    toast.success('Welcome back!');
    
    // Redirect based on role
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === "client") {
      router.push('/dashboard');
    }
  },
  onError: (error) => {
    toast.error(error.serverError || 'Invalid email or password');
  },
});
const handleSubmit = form.handleSubmit(async (data: Schema) => {
    formAction.execute(data);
  });

const { isExecuting, hasSucceeded } = formAction;
  if (hasSucceeded) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl dark:shadow-primary/5">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-3 bg-primary/10 border-primary/20"
          >
            <Check className="size-8 text-primary" />
          </motion.div>
          <h2 className="text-center text-2xl font-bold mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-base text-muted-foreground">
            You've successfully logged in to your account
          </p>
          <p className="text-center text-base text-primary mt-3">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    )
  }
return (
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 w-full max-w-md relative border bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-primary/10 mx-auto">
        <FieldGroup className="grid gap-5 mb-6">
          <div className="text-center space-y-2 mb-2">
            <h1 className="font-bold text-3xl tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                className="h-11"
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller 
          name="password" 
          control={form.control} 
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
              <Password
                {...field}
                aria-invalid={fieldState.invalid}
                id="password"
                placeholder="Enter your password"
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
        )} />

{/* <SocialLogin mode="login" /> */}
          </FieldGroup>
          
          <Button className="w-full h-11 rounded-lg shadow-lg bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary dark:shadow-primary/20 font-medium" type="submit" disabled={isExecuting}>
            {isExecuting ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
      </form>
)}