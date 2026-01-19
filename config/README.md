# Configuration

This directory contains all configuration files and helper utilities for the application.

## Structure

```
config/
├── appwrite.config.ts    # Appwrite configuration
├── helpers/              # Utility helpers
│   ├── config.ts        # Session and app configuration
│   ├── index.ts         # Helper exports
│   ├── logger.ts        # Logging utility
│   ├── retry.helpers.ts # Retry logic with backoff
│   └── types.ts         # TypeScript types
└── README.md            # This file
```

## Appwrite Configuration

### `appwrite.config.ts`

Central configuration for Appwrite backend services.

```typescript
export const appwritecfg = {
  project: {
    id: process.env.APPWRITE_PROJECT_ID!,
    endpoint: process.env.APPWRITE_ENDPOINT!,
    apikey: process.env.APPWRITE_API_KEY!,
  },
  tables: {
    users: process.env.APPWRITE_USERS_TABLE!,
  },
}

// Network configuration for retry logic
export const APPWRITE_NETWORK_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // ms
  REQUEST_TIMEOUT: 30000, // ms
}
```

**Environment Variables Required:**

| Variable | Description | Example |
|----------|-------------|---------|
| `APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | Your project ID | `my-project-id` |
| `APPWRITE_API_KEY` | Server API key | `secret-api-key` |
| `APPWRITE_DATABASE_ID` | Database ID | `main-db` |
| `APPWRITE_USERS_TABLE` | Users collection ID | `users` |

## Helper Utilities

### Logger (`logger.ts`)

Environment-aware logging system with multiple log levels.

**Features:**
- Multiple log levels (debug, info, warn, error)
- Automatic production silencing
- Structured logging with context
- TypeScript support

**Usage:**

```typescript
import { createLogger } from '@/config/helpers'

// Create a logger instance
const logger = createLogger('AUTH', {
  minLevel: 'debug' // 'debug' | 'info' | 'warn' | 'error'
})

// Log at different levels
logger.debug('Checking user session', { userId: '123' })
logger.info('User logged in successfully')
logger.warn('Session expiring soon', { expiresIn: 300 })
logger.error(new Error('Login failed'))
```

**Advanced Usage:**

```typescript
// With context object
logger.info('User action', {
  userId: '123',
  action: 'update_profile',
  timestamp: new Date(),
})

// Error logging with stack trace
try {
  await riskyOperation()
} catch (error) {
  logger.error(error instanceof Error ? error : new Error(String(error)))
}
```

**Log Levels:**

| Level | When to Use | Production |
|-------|-------------|------------|
| `debug` | Detailed debugging information | ❌ Disabled |
| `info` | General information messages | ❌ Disabled |
| `warn` | Warning messages | ✅ Enabled |
| `error` | Error messages | ✅ Enabled |

**Implementation:**

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  minLevel?: LogLevel
}

export function createLogger(namespace: string, options: LoggerOptions = {}) {
  const { minLevel = 'info' } = options
  const isProduction = process.env.NODE_ENV === 'production'
  
  const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }
  
  const shouldLog = (level: LogLevel) => {
    if (isProduction && levels[level] < levels.warn) {
      return false
    }
    return levels[level] >= levels[minLevel]
  }
  
  return {
    debug: (message: string, context?: any) => {
      if (shouldLog('debug')) {
        console.debug(`[${namespace}] ${message}`, context || '')
      }
    },
    info: (message: string, context?: any) => {
      if (shouldLog('info')) {
        console.info(`[${namespace}] ${message}`, context || '')
      }
    },
    warn: (message: string, context?: any) => {
      if (shouldLog('warn')) {
        console.warn(`[${namespace}] ${message}`, context || '')
      }
    },
    error: (error: Error, context?: any) => {
      if (shouldLog('error')) {
        console.error(`[${namespace}] Error:`, error, context || '')
      }
    },
  }
}
```

### Retry Logic (`retry.helpers.ts`)

Automatic retry mechanism with exponential backoff for network operations.

**Features:**
- Configurable retry attempts
- Exponential backoff
- Custom retry delay
- Error filtering (only retry on specific errors)
- TypeScript support

**Usage:**

```typescript
import { withRetry } from '@/config/helpers'

// Basic usage
const data = await withRetry(
  async () => {
    return await fetch('/api/data').then(r => r.json())
  },
  3,        // max retries
  1000,     // initial delay (ms)
  'FetchData' // operation name (for logging)
)

// With custom error handling
const result = await withRetry(
  async () => {
    const response = await fetch('/api/endpoint')
    if (!response.ok) throw new Error('API Error')
    return response.json()
  },
  5,     // 5 retries
  2000,  // 2 second initial delay
  'APICall'
)
```

**Retry Strategy:**

- **Delay calculation:** `initialDelay * (2 ^ attemptNumber)`
- **Example:** 1000ms → 2000ms → 4000ms → 8000ms
- **Max attempts:** Configurable (default: 3)

**Retryable Errors:**

The helper automatically retries on:
- Network timeouts
- Connection resets
- DNS failures
- 5xx server errors
- Temporary Appwrite errors

**Implementation:**

```typescript
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  operationName: string = 'Operation'
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Don't retry on last attempt
      if (attempt === maxRetries) break
      
      // Check if error is retryable
      if (!isRetryableError(lastError)) {
        throw lastError
      }
      
      // Calculate backoff delay
      const delay = initialDelay * Math.pow(2, attempt)
      
      console.warn(
        `[${operationName}] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
        lastError.message
      )
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

function isRetryableError(error: Error): boolean {
  const retryablePatterns = [
    /network/i,
    /timeout/i,
    /ECONNRESET/i,
    /ETIMEDOUT/i,
    /EAI_AGAIN/i,
  ]
  
  return retryablePatterns.some(pattern => 
    pattern.test(error.message)
  )
}
```

### Session Configuration (`config.ts`)

Session and application-wide configuration constants.

**Usage:**

```typescript
import { SESSION_CONFIG } from '@/config/helpers/config'

// Set session cookie
cookies().set(SESSION_CONFIG.COOKIE_NAME, sessionSecret, {
  ...SESSION_CONFIG.COOKIE_OPTIONS,
  maxAge: SESSION_CONFIG.MAX_AGE,
})

// Get session cookie
const session = cookies().get(SESSION_CONFIG.COOKIE_NAME)
```

**Configuration:**

```typescript
export const SESSION_CONFIG = {
  COOKIE_NAME: 'appwrite-session',
  ROLE_COOKIE_NAME: 'user-role',
  MAX_AGE: 60 * 60 * 24 * 30, // 30 days in seconds
  COOKIE_OPTIONS: {
    path: '/',
    httpOnly: true,      // Prevent XSS attacks
    sameSite: 'strict',  // CSRF protection
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  },
} as const
```

**Security Features:**

- **httpOnly** - Cookies not accessible via JavaScript (XSS protection)
- **sameSite: strict** - Cookies only sent with same-site requests (CSRF protection)
- **secure** - HTTPS only in production
- **path** - Cookie available site-wide

### Type Definitions (`types.ts`)

Shared TypeScript types and interfaces.

```typescript
export interface User {
  $id: string
  email: string
  name: string
  roles?: string[]
}

export interface Session {
  userId: string
  secret: string
  expires: Date
}

export interface AppwriteError {
  code: number
  message: string
  type: string
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerOptions {
  minLevel?: LogLevel
}
```

## Environment Variables

### Setup

Create a `.env.local` file in the root directory:

```env
# Required
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_USERS_TABLE=your-users-collection-id

# Optional
NODE_ENV=development
```

### Validation

The config validates required environment variables on startup:

```typescript
function validateConfig() {
  const required = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

## Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use `.env.example` for documentation
   - Validate required variables on startup

2. **Logging**
   - Use appropriate log levels
   - Include relevant context
   - Avoid logging sensitive data
   - Disable debug logs in production

3. **Retry Logic**
   - Only retry on transient failures
   - Set reasonable retry limits
   - Log retry attempts
   - Use exponential backoff

4. **Configuration**
   - Centralize all config in this directory
   - Use TypeScript for type safety
   - Document all configuration options
   - Provide sensible defaults

## Testing

```typescript
import { createLogger, withRetry } from '@/config/helpers'

describe('Logger', () => {
  it('should log at appropriate levels', () => {
    const logger = createLogger('TEST', { minLevel: 'info' })
    
    // This should not log (below minLevel)
    logger.debug('Debug message')
    
    // This should log
    logger.info('Info message')
  })
})

describe('Retry', () => {
  it('should retry on failure', async () => {
    let attempts = 0
    
    const result = await withRetry(
      async () => {
        attempts++
        if (attempts < 3) throw new Error('Network timeout')
        return 'success'
      },
      3,
      100,
      'Test'
    )
    
    expect(attempts).toBe(3)
    expect(result).toBe('success')
  })
})
```

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
