# Components

This directory contains all React components used throughout the application, organized by functionality.

## Structure

```
components/
├── forms/              # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── SocialLogin.tsx
├── providers/          # Context providers
│   ├── auth-provider.tsx
│   └── theme-provider.tsx
├── ui/                 # UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── form.tsx
│   ├── terminal.tsx
│   ├── code-block.tsx
│   └── ... (more components)
└── README.md          # This file
```

## Form Components

### LoginForm

A complete login form with email/password authentication and social login options.

**Features:**
- Email and password validation
- Form error handling
- Loading states
- Social authentication integration
- Redirect to signup
- Success animations

**Usage:**

```tsx
import { LoginForm } from "@/components/forms/LoginForm"

export default function LoginPage() {
  return <LoginForm />
}
```

**Props:** None (self-contained)

### RegisterForm

User registration form with validation and terms acceptance.

**Features:**
- Name, email, and password fields
- Password strength validation
- Terms and conditions checkbox
- Form validation with Zod
- Social authentication integration
- Redirect to login
- Success state handling

**Usage:**

```tsx
import { RegisterForm } from "@/components/forms/RegisterForm"

export default function SignupPage() {
  return <RegisterForm />
}
```

**Props:** None (self-contained)

### SocialLogin

Reusable social authentication component supporting multiple OAuth providers.

**Features:**
- GitHub OAuth
- Google OAuth
- Mode switching (login/signup)
- Loading states per provider
- Error handling

**Usage:**

```tsx
import { SocialLogin } from "@/components/forms/SocialLogin"

// In login context
<SocialLogin mode="login" />

// In signup context
<SocialLogin mode="signup" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"login" \| "signup"` | `"login"` | Context for social auth (affects messaging) |

**Implementation:**

```tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

interface SocialLoginProps {
  mode?: "login" | "signup"
}

export function SocialLogin({ mode = "login" }: SocialLoginProps) {
  const [loading, setLoading] = useState<string | null>(null)
  
  const handleSocialLogin = async (provider: string) => {
    setLoading(provider)
    try {
      // OAuth implementation
      // Redirect to provider
    } catch (error) {
      console.error("OAuth error:", error)
    } finally {
      setLoading(null)
    }
  }
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("github")}
        disabled={loading !== null}
      >
        <Github className="mr-2 size-4" />
        GitHub
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={loading !== null}
      >
        <FcGoogle className="mr-2 size-4" />
        Google
      </Button>
    </div>
  )
}
```

## Provider Components

### AuthProvider

Context provider for managing authentication state across the application.

**Features:**
- User session management
- Authentication state
- Loading states
- Automatic session refresh

**Usage:**

```tsx
// In app/layout.tsx
import { AuthProvider } from "@/components/providers/auth-provider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

// In any component
import { useAuth } from "@/components/providers/auth-provider"

function MyComponent() {
  const { user, isLoading, logout } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

### ThemeProvider

Dark mode and theme management using next-themes.

**Features:**
- System theme detection
- Manual theme switching
- Persistent theme preference
- No flash on page load

**Usage:**

```tsx
// In app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// Using theme in components
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

## UI Components

The `ui/` directory contains components from [shadcn/ui](https://ui.shadcn.com/), a collection of re-usable components built with Radix UI and Tailwind CSS.

### Core Components

#### Button

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">Click me</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `default`, `sm`, `lg`, `icon`

#### Input

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
```

#### Form

Complete form components with validation:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"

function MyForm() {
  const form = useForm()
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Custom UI Components

#### Terminal

Interactive terminal component with typing animation.

```tsx
import { Terminal, AnimatedSpan } from "@/components/ui/terminal"

<Terminal className="bg-background">
  <AnimatedSpan className="text-green-500">
    $ pnpm install
  </AnimatedSpan>
</Terminal>
```

**Props:**
- `sequence` (boolean): Enable typing animation
- `startOnView` (boolean): Start animation when in viewport
- `className` (string): Additional CSS classes

#### CodeBlock

Syntax-highlighted code display with copy functionality.

```tsx
import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock
  language="typescript"
  filename="example.ts"
  code={`const greeting = "Hello, World!"`}
/>
```

**Props:**
- `language` (string): Programming language for syntax highlighting
- `filename` (string): Optional filename to display
- `code` (string): Code content to display

#### Spotlight

Animated spotlight effect for backgrounds.

```tsx
import { Spotlight } from "@/components/ui/spotlight-new"

<div className="relative">
  <Spotlight />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

#### AnimatedThemeToggler

Smooth theme toggle with icon animation.

```tsx
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

<AnimatedThemeToggler />
```

### Complete Component List

- `avatar.tsx` - User avatar with fallback
- `badge.tsx` - Status badges and tags
- `button.tsx` - Button component with variants
- `checkbox.tsx` - Checkbox input
- `code-block.tsx` - Syntax-highlighted code
- `dropdown-menu.tsx` - Dropdown menus
- `field.tsx` - Form field wrapper
- `form.tsx` - Form components
- `input.tsx` - Text input
- `input-group.tsx` - Grouped inputs
- `label.tsx` - Form label
- `password.tsx` - Password input with visibility toggle
- `separator.tsx` - Visual separator
- `sheet.tsx` - Slide-over panel
- `sidebar.tsx` - Navigation sidebar
- `skeleton.tsx` - Loading skeleton
- `spotlight-new.tsx` - Animated spotlight
- `terminal.tsx` - Terminal display
- `textarea.tsx` - Multi-line text input
- `tooltip.tsx` - Hover tooltips
- `animated-theme-toggler.tsx` - Theme switcher

## Adding New Components

### Using shadcn/ui CLI

```bash
# Add a new component
pnpm dlx shadcn@latest add [component-name]

# Examples:
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add calendar
```

### Creating Custom Components

1. Create file in appropriate subdirectory
2. Use TypeScript for type safety
3. Follow existing patterns (Props interface, proper exports)
4. Document with JSDoc comments

```tsx
import * as React from "react"

interface MyComponentProps {
  /** Component title */
  title: string
  /** Optional description */
  description?: string
  /** Click handler */
  onClick?: () => void
}

/**
 * MyComponent description
 * 
 * @example
 * ```tsx
 * <MyComponent title="Hello" onClick={() => console.log("Clicked")} />
 * ```
 */
export function MyComponent({ title, description, onClick }: MyComponentProps) {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

## Styling Guidelines

1. **Use Tailwind CSS** - All styling via utility classes
2. **Dark mode support** - Use `dark:` prefix for dark mode variants
3. **Responsive design** - Use breakpoint prefixes (`sm:`, `md:`, `lg:`)
4. **Consistent spacing** - Follow existing spacing patterns
5. **Accessibility** - Include ARIA labels and proper semantic HTML

## Best Practices

- Keep components focused and single-purpose
- Use TypeScript for all components
- Provide proper TypeScript interfaces for props
- Handle loading and error states
- Make components reusable and configurable
- Document complex components
- Test components with different prop combinations
- Follow accessibility guidelines (WCAG 2.1)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
