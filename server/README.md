# Server Utilities

This directory contains server-side utilities for Appwrite integration and session management.

## Structure

```
server/
├── clients/          # Appwrite client setup
│   └── index.ts     # Client factory functions
├── cookies.ts       # Session cookie management
└── README.md        # This file
```

## Appwrite Clients

### Overview

The template provides two types of Appwrite clients:

1. **Admin Session** - Full access with API key (server-side only)
2. **User Session** - User-scoped access with session token

Both clients are configured with automatic retry logic and error handling.

### Admin Session

Use the admin session for operations that require elevated privileges.

**When to use:**
- User creation/deletion
- Accessing all users' data
- Team management
- Database schema operations
- Storage management
- Function deployment

**Usage:**

```typescript
import { createAdminSession } from '@/server/clients'

export async function getAllUsers() {
  const session = await createAdminSession()
  
  // Access all Appwrite services
  const users = await session.accounts.list()
  
  return users
}

export async function createUser(email: string, password: string, name: string) {
  const session = await createAdminSession()
  
  const user = await session.accounts.create(
    'unique()',
    email,
    password,
    name
  )
  
  return user
}
```

**Available Services:**

```typescript
const session = await createAdminSession()

// Account management
session.accounts.create()
session.accounts.delete()
session.accounts.list()
session.accounts.get()

// Database operations
session.databases.createDocument()
session.databases.updateDocument()
session.databases.deleteDocument()
session.databases.listDocuments()

// Storage
session.storage.createFile()
session.storage.deleteFile()
session.storage.listFiles()

// Teams
session.teams.create()
session.teams.list()
session.teams.delete()

// Functions
session.functions.execute()
session.functions.list()

// Messaging
session.messaging.createEmail()
session.messaging.createSMS()
```

### User Session

Use user sessions for user-specific operations with automatic session token management.

**When to use:**
- Fetching current user data
- User-specific database queries
- User preferences
- User-owned documents
- Profile operations

**Usage:**

```typescript
import { createUserSession } from '@/server/clients'

export async function getCurrentUser() {
  const session = await createUserSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }
  
  // Get current user account
  const account = await session.accounts.get()
  
  return account
}

export async function updateUserPreferences(prefs: Record<string, any>) {
  const session = await createUserSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }
  
  const updated = await session.accounts.updatePrefs(prefs)
  
  return updated
}

export async function getUserDocuments() {
  const session = await createUserSession()
  
  if (!session) {
    return []
  }
  
  const documents = await session.databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_USERS_TABLE!
  )
  
  return documents
}
```

### Implementation

**`server/clients/index.ts`:**

```typescript
import { Client, Account, Databases, Storage, Teams, Functions, Messaging } from 'node-appwrite'
import { appwritecfg } from '@/config/appwrite.config'
import { cookies } from 'next/headers'
import { withRetry } from '@/config/helpers'

interface AppwriteSession {
  accounts: Account
  databases: Databases
  storage: Storage
  teams: Teams
  functions: Functions
  messaging: Messaging
}

/**
 * Create admin session with full API access
 */
export async function createAdminSession(): Promise<AppwriteSession> {
  return withRetry(
    async () => {
      const client = new Client()
        .setEndpoint(appwritecfg.project.endpoint)
        .setProject(appwritecfg.project.id)
        .setKey(appwritecfg.project.apikey)
      
      return {
        accounts: new Account(client),
        databases: new Databases(client),
        storage: new Storage(client),
        teams: new Teams(client),
        functions: new Functions(client),
        messaging: new Messaging(client),
      }
    },
    3,
    2000,
    'CreateAdminSession'
  )
}

/**
 * Create user session from cookie token
 */
export async function createUserSession(): Promise<AppwriteSession | null> {
  const sessionCookie = cookies().get('appwrite-session')
  
  if (!sessionCookie?.value) {
    return null
  }
  
  return withRetry(
    async () => {
      const client = new Client()
        .setEndpoint(appwritecfg.project.endpoint)
        .setProject(appwritecfg.project.id)
        .setSession(sessionCookie.value)
      
      return {
        accounts: new Account(client),
        databases: new Databases(client),
        storage: new Storage(client),
        teams: new Teams(client),
        functions: new Functions(client),
        messaging: new Messaging(client),
      }
    },
    3,
    2000,
    'CreateUserSession'
  )
}
```

## Cookie Management

### Session Cookies

The `cookies.ts` file provides utilities for managing session cookies.

**Features:**
- HTTP-only cookies
- Secure flag in production
- SameSite protection
- Configurable expiration

**Usage:**

```typescript
import { setSessionCookie, getSessionCookie, clearSessionCookie } from '@/server/cookies'

// Set session cookie
export async function login(email: string, password: string) {
  const session = await createAdminSession()
  const user = await session.accounts.createEmailPasswordSession(email, password)
  
  // Store session token
  setSessionCookie(user.secret)
  
  return user
}

// Get session cookie
export async function getSession() {
  const token = getSessionCookie()
  
  if (!token) {
    return null
  }
  
  // Validate and return session
  const session = await createUserSession()
  return session
}

// Clear session cookie
export async function logout() {
  clearSessionCookie()
}
```

**Implementation:**

```typescript
import { cookies } from 'next/headers'
import { SESSION_CONFIG } from '@/config/helpers/config'

export function setSessionCookie(token: string, maxAge?: number) {
  cookies().set(SESSION_CONFIG.COOKIE_NAME, token, {
    ...SESSION_CONFIG.COOKIE_OPTIONS,
    maxAge: maxAge || SESSION_CONFIG.MAX_AGE,
  })
}

export function getSessionCookie(): string | undefined {
  return cookies().get(SESSION_CONFIG.COOKIE_NAME)?.value
}

export function clearSessionCookie() {
  cookies().delete(SESSION_CONFIG.COOKIE_NAME)
}

export function setRoleCookie(role: string) {
  cookies().set(SESSION_CONFIG.ROLE_COOKIE_NAME, role, {
    ...SESSION_CONFIG.COOKIE_OPTIONS,
    maxAge: SESSION_CONFIG.MAX_AGE,
  })
}

export function getRoleCookie(): string | undefined {
  return cookies().get(SESSION_CONFIG.ROLE_COOKIE_NAME)?.value
}
```

## Common Patterns

### Authentication Flow

```typescript
// Server action for login
"use server"
import { createAdminSession } from '@/server/clients'
import { setSessionCookie } from '@/server/cookies'

export async function loginAction(email: string, password: string) {
  try {
    const session = await createAdminSession()
    
    // Create email/password session
    const user = await session.accounts.createEmailPasswordSession(
      email,
      password
    )
    
    // Store session token
    setSessionCookie(user.secret)
    
    return {
      success: true,
      user: {
        id: user.userId,
        email: user.providerAccessToken,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: 'Invalid credentials',
    }
  }
}
```

### Protected Route

```typescript
// middleware.ts or route handler
import { createUserSession } from '@/server/clients'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await createUserSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

// In a page
export default async function DashboardPage() {
  const session = await requireAuth()
  const user = await session.accounts.get()
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  )
}
```

### Database Operations

```typescript
import { createUserSession } from '@/server/clients'

export async function getUserPosts(userId: string) {
  const session = await createUserSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const posts = await session.databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    'posts',
    [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(10),
    ]
  )
  
  return posts.documents
}

export async function createPost(title: string, content: string) {
  const session = await createUserSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const user = await session.accounts.get()
  
  const post = await session.databases.createDocument(
    process.env.APPWRITE_DATABASE_ID!,
    'posts',
    'unique()',
    {
      title,
      content,
      userId: user.$id,
      createdAt: new Date().toISOString(),
    }
  )
  
  return post
}
```

### Error Handling

```typescript
import { createUserSession } from '@/server/clients'
import { AppwriteException } from 'node-appwrite'

export async function safeOperation() {
  try {
    const session = await createUserSession()
    
    if (!session) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }
    
    const result = await session.databases.getDocument(
      'database-id',
      'collection-id',
      'document-id'
    )
    
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    if (error instanceof AppwriteException) {
      // Handle Appwrite-specific errors
      return {
        success: false,
        error: error.message,
        code: error.code,
      }
    }
    
    // Handle generic errors
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
```

## Security Best Practices

1. **Never expose API keys** - Keep API keys server-side only
2. **Validate sessions** - Always check for valid session before operations
3. **Use HTTP-only cookies** - Prevent XSS attacks
4. **Enable CSRF protection** - Use SameSite cookies
5. **Sanitize inputs** - Validate and sanitize all user inputs
6. **Handle errors gracefully** - Don't expose sensitive error details
7. **Use HTTPS in production** - Ensure secure flag on cookies
8. **Implement rate limiting** - Use Appwrite's built-in rate limiting
9. **Log security events** - Track authentication attempts and failures

## Testing

```typescript
import { createAdminSession, createUserSession } from '@/server/clients'

describe('Appwrite Clients', () => {
  it('should create admin session', async () => {
    const session = await createAdminSession()
    expect(session.accounts).toBeDefined()
  })
  
  it('should handle missing user session', async () => {
    // Clear cookies
    const session = await createUserSession()
    expect(session).toBeNull()
  })
})
```

## Resources

- [Appwrite Node SDK](https://appwrite.io/docs/sdks#server)
- [Appwrite Server API](https://appwrite.io/docs/server/account)
- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [HTTP-only Cookies](https://owasp.org/www-community/HttpOnly)
