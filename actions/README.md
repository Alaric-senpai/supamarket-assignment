# Server Actions

This directory contains server-side actions built with [next-safe-action](https://next-safe-action.dev/) for type-safe, validated server operations.

## Overview

Server actions provide a secure way to perform server-side operations with automatic validation, error handling, and type safety. This template uses `next-safe-action` to enhance the native Next.js server actions with:

- ✅ Input validation with Zod schemas
- ✅ Type-safe inputs and outputs
- ✅ Error handling and reporting
- ✅ Middleware support
- ✅ Loading states and optimistic updates

## File Structure

```
actions/
├── safe-action.ts       # Action client configuration
├── server-action.ts     # Authentication actions
└── README.md           # This file
```

## Action Client Setup

### `safe-action.ts`

The action client is configured once and reused across all actions:

```typescript
import { createSafeActionClient } from "next-safe-action"

// Create the base action client
export const actionClient = createSafeActionClient()
```

### Advanced Configuration

You can extend the action client with middleware for common operations:

```typescript
import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  // Optional: Handle server errors globally
  handleServerError(error) {
    console.error("Action error:", error)
    return "An unexpected error occurred"
  },
  
  // Optional: Define default values
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    })
  },
})

// Authenticated action client
export const authActionClient = actionClient
  .use(async ({ next, clientInput, metadata }) => {
    // Check authentication
    const session = await getSession()
    
    if (!session) {
      throw new Error("Unauthorized")
    }
    
    return next({ 
      ctx: { userId: session.userId } 
    })
  })
```

## Creating Server Actions

### Basic Action

```typescript
"use server"
import { actionClient } from "./safe-action"
import { z } from "zod"

const mySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export const myAction = actionClient
  .inputSchema(mySchema)
  .action(async ({ parsedInput }) => {
    const { name, email } = parsedInput
    
    // Your business logic here
    
    return {
      success: true,
      message: "Action completed",
    }
  })
```

### Authentication Actions

The template includes pre-built authentication actions in `server-action.ts`:

#### Login Action

```typescript
"use server"
import { actionClient } from "./safe-action"
import { LoginformSchema } from "../lib/form-schema"
import { createAdminSession } from "@/server/clients"
import { cookies } from "next/headers"

export const LoginserverAction = actionClient
  .inputSchema(LoginformSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput
    
    try {
      // Authenticate with Appwrite
      const session = await createAdminSession()
      const user = await session.accounts.createEmailPasswordSession(
        email,
        password
      )
      
      // Set session cookie
      cookies().set("appwrite-session", user.secret, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
      
      return {
        success: true,
        message: "Login successful",
        user: {
          id: user.$id,
          email: user.email,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }
  })
```

#### Registration Action

```typescript
export const RegisterserverAction = actionClient
  .inputSchema(RegisterformSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, name } = parsedInput
    
    try {
      const session = await createAdminSession()
      
      // Create new user
      const user = await session.accounts.create(
        "unique()",
        email,
        password,
        name
      )
      
      // Auto-login after registration
      const loginSession = await session.accounts.createEmailPasswordSession(
        email,
        password
      )
      
      // Set session cookie
      cookies().set("appwrite-session", loginSession.secret, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      })
      
      return {
        success: true,
        message: "Registration successful",
        user: {
          id: user.$id,
          email: user.email,
          name: user.name,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Registration failed",
      }
    }
  })
```

## Using Actions in Components

### Basic Usage

```typescript
"use client"
import { useAction } from "next-safe-action/hooks"
import { myAction } from "@/actions/server-action"

export function MyComponent() {
  const { execute, status, result } = useAction(myAction)
  
  const handleSubmit = () => {
    execute({ name: "John", email: "john@example.com" })
  }
  
  return (
    <div>
      <button onClick={handleSubmit} disabled={status === "executing"}>
        {status === "executing" ? "Loading..." : "Submit"}
      </button>
      
      {result?.data?.success && (
        <p>Success: {result.data.message}</p>
      )}
    </div>
  )
}
```

### With React Hook Form

```typescript
"use client"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginformSchema } from "@/lib/form-schema"
import { LoginserverAction } from "@/actions/server-action"

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const { execute, status } = useAction(LoginserverAction, {
    onSuccess: (data) => {
      if (data.success) {
        // Redirect or update UI
        window.location.href = "/dashboard"
      }
    },
    onError: (error) => {
      console.error("Login error:", error)
    },
  })
  
  const onSubmit = form.handleSubmit((data) => {
    execute(data)
  })
  
  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={status === "executing"}>
        {status === "executing" ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
```

### Advanced: Optimistic Updates

```typescript
const { execute, status, optimisticData } = useAction(myAction, {
  onExecute: ({ input }) => {
    // Show optimistic UI immediately
    return { optimistic: true, ...input }
  },
  onSuccess: (data) => {
    // Update confirmed
  },
  onError: () => {
    // Revert optimistic update
  },
})
```

## Error Handling

### Server-Side Errors

```typescript
export const myAction = actionClient
  .inputSchema(mySchema)
  .action(async ({ parsedInput }) => {
    try {
      // Your logic
      return { success: true }
    } catch (error) {
      // Log error
      console.error("Action failed:", error)
      
      // Return user-friendly message
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      }
    }
  })
```

### Client-Side Error Handling

```typescript
const { execute, status } = useAction(myAction, {
  onError: ({ error, input }) => {
    // Handle validation errors
    if (error.validationErrors) {
      console.error("Validation failed:", error.validationErrors)
    }
    
    // Handle server errors
    if (error.serverError) {
      console.error("Server error:", error.serverError)
    }
  },
})
```

## Best Practices

1. **Always validate inputs** - Use Zod schemas for all action inputs
2. **Handle errors gracefully** - Provide user-friendly error messages
3. **Use TypeScript** - Leverage full type safety
4. **Keep actions focused** - One action should do one thing
5. **Secure sensitive operations** - Add authentication checks
6. **Log errors** - Use the logger utility for debugging
7. **Return consistent shapes** - Always return `{ success: boolean, message?: string, data?: any }`

## Security Considerations

- Actions run on the server and have access to sensitive APIs
- Always validate inputs with Zod schemas
- Check authentication/authorization before performing operations
- Use HTTP-only cookies for session management
- Never expose API keys or secrets in actions
- Sanitize user inputs to prevent injection attacks

## Testing

```typescript
import { myAction } from "./server-action"

describe("myAction", () => {
  it("should validate input schema", async () => {
    const result = await myAction({
      name: "a", // Too short
      email: "invalid",
    })
    
    expect(result.validationErrors).toBeDefined()
  })
  
  it("should execute successfully", async () => {
    const result = await myAction({
      name: "John Doe",
      email: "john@example.com",
    })
    
    expect(result.data?.success).toBe(true)
  })
})
```

## References

- [next-safe-action Documentation](https://next-safe-action.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Zod Documentation](https://zod.dev/)
