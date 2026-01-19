# Authentication System Documentation

## Overview

This Next.js + Appwrite authentication system provides a comprehensive, production-ready solution with advanced features including:

- ✅ Email/Password authentication
- ✅ OAuth2 social login (Google, GitHub, Microsoft, Apple, Facebook)
- ✅ Session management with automatic expiry handling
- ✅ Token refresh mechanism
- ✅ Multiple OAuth account linking/unlinking
- ✅ Active session management
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with middleware
- ✅ Comprehensive error handling

## Architecture

### Route Structure

```
app/
├── (auth)/                    # Auth route group (excludes layout)
│   ├── login/                 # Login page
│   ├── signup/                # Registration page
│   ├── oauth/                 # OAuth callback handler
│   ├── success/               # OAuth success page
│   ├── fail/                  # OAuth failure page
│   └── verify/                # Session verification page
├── (client)/                  # Client-protected routes
│   ├── dashboard/
│   ├── account-security/      # Manage linked accounts & sessions
│   └── link-account/          # Link additional OAuth providers
└── (admin)/                   # Admin-only routes
```

### Core Components

#### 1. Auth Actions (`actions/auth.actions.ts`)

Server actions handling all authentication operations:

- `RegisterserverAction` - User registration
- `LoginserverAction` - Email/password login
- `OAuthServerAction` - Initialize OAuth flow
- `Logout` - User logout
- `handleOauthCallback` - Process OAuth callback
- `getCurrentUser` - Get authenticated user
- `validateSession` - Validate current session
- `getSessionExpiry` - Get session expiration info
- `extendSession` - Refresh/extend session
- `listActiveSessions` - Get all user sessions
- `deleteSessionById` - Revoke specific session
- `getLinkedIdentities` - Get linked OAuth accounts
- `unlinkIdentity` - Remove OAuth account link

#### 2. Session Manager (`lib/session-manager.ts`)

Handles automatic session management:

- `checkAndManageSession()` - Validates and auto-refreshes sessions
- `getSessionStatus()` - Returns current session status
- `refreshCurrentSession()` - Force session refresh

**Session Refresh Logic:**
- Sessions are automatically refreshed when they have < 30 minutes remaining
- Background checks run every 5 minutes
- Expired sessions are automatically cleared

#### 3. Auth Provider (`components/providers/auth-provider.tsx`)

React context providing auth state throughout the app:

```tsx
const { 
  user,              // Current user object
  role,              // User role (admin/client)
  isAuthenticated,   // Auth status
  isLoading,         // Loading state
  sessionExpiry,     // Session expiration date
  timeRemaining,     // Time until expiry (ms)
  logout,            // Logout function
  refreshUser,       // Refresh user data
  checkSession       // Check session status
} = useAuth();
```

#### 4. Middleware (`middleware.ts`)

Route protection and security:

- Redirects unauthenticated users from protected routes
- Redirects authenticated users from auth pages
- Enforces role-based access control
- Adds security headers

#### 5. OAuth Route Handler (`app/(auth)/oauth/route.ts`)

Processes OAuth callbacks:

- Validates OAuth parameters
- Creates/updates user records
- Sets session cookies
- Handles errors gracefully
- Redirects to appropriate pages

## Usage Guide

### Basic Authentication

#### Email/Password Registration

```tsx
import { RegisterserverAction } from '@/actions/auth.actions';

const handleRegister = async (data) => {
  const result = await RegisterserverAction(data);
  if (result.success) {
    // Registration successful
  }
};
```

#### Email/Password Login

```tsx
import { LoginserverAction } from '@/actions/auth.actions';

const handleLogin = async (data) => {
  const result = await LoginserverAction(data);
  if (result.success) {
    // Login successful, redirect
  }
};
```

### OAuth Authentication

#### Initialize OAuth Flow

```tsx
import { OAuthServerAction } from '@/actions/auth.actions';

const handleOAuth = async (provider: 'google' | 'github') => {
  const result = await OAuthServerAction({ provider });
  if (result.success && result.data?.redirectUrl) {
    window.location.href = result.data.redirectUrl;
  }
};
```

#### OAuth Flow:

1. User clicks OAuth button
2. `OAuthServerAction` generates OAuth URL
3. User redirected to provider
4. Provider redirects to `/(auth)/oauth` with userId & secret
5. OAuth handler validates, creates session, sets cookies
6. User redirected to success page → dashboard

### Session Management

#### Check Session Status

```tsx
import { getSessionStatus } from '@/lib/session-manager';

const status = await getSessionStatus();
console.log(status.timeRemaining); // Time until expiry
console.log(status.needsRefresh);  // Should refresh?
```

#### Manual Session Refresh

```tsx
import { refreshCurrentSession } from '@/lib/session-manager';

const result = await refreshCurrentSession();
if (result.success) {
  // Session extended
}
```

#### List Active Sessions

```tsx
import { listActiveSessions } from '@/actions/auth.actions';

const { sessions, total } = await listActiveSessions();
// Display all active sessions across devices
```

#### Revoke Session

```tsx
import { deleteSessionById } from '@/actions/auth.actions';

await deleteSessionById(sessionId);
// Revokes specific session
```

### OAuth Account Linking

#### Get Linked Accounts

```tsx
import { getLinkedIdentities } from '@/actions/auth.actions';

const { identities } = await getLinkedIdentities();
// Returns all linked OAuth providers
```

#### Unlink Account

```tsx
import { unlinkIdentity } from '@/actions/auth.actions';

const result = await unlinkIdentity(identityId);
// Removes OAuth provider link
```

### Using Auth Context

```tsx
'use client';

import { useAuth } from '@/components/providers/auth-provider';

export default function ProtectedPage() {
  const { user, isAuthenticated, isLoading, role, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome {user?.name}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Environment Variables

Required environment variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key

# Database Configuration
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USERS_TABLE_ID=your_users_table_id

# App Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development
```

## Security Features

### 1. Cookie Security

- HttpOnly cookies prevent XSS attacks
- Secure flag in production (HTTPS only)
- 30-day max age
- Session secret stored in encrypted cookie

### 2. Middleware Protection

- Automatic route protection
- Role-based access control
- Security headers (X-Frame-Options, X-Content-Type-Options)
- CSRF protection via SameSite cookies

### 3. Session Management

- Automatic expiry detection
- Token refresh before expiry
- Multi-device session tracking
- Session revocation capabilities

### 4. OAuth Security

- State validation
- Secure redirect URIs
- Token expiry tracking
- Provider identity verification

## Error Handling

All auth operations return standardized responses:

```tsx
{
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
}
```

Common error codes:
- `oauth_missing_params` - Missing OAuth parameters
- `oauth_callback_failed` - OAuth callback error
- `oauth_unauthorized` - Invalid OAuth credentials
- `session_expired` - Session has expired
- `session_error` - General session error

## Token Expiry Handling

The system implements multi-layer token expiry protection:

### 1. Automatic Refresh

```typescript
// Triggered when < 30 minutes remaining
const SESSION_REFRESH_THRESHOLD = 30 * 60 * 1000;
```

### 2. Background Monitoring

```typescript
// Auth provider checks every 5 minutes
useEffect(() => {
  const interval = setInterval(checkSession, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, [isAuthenticated]);
```

### 3. Countdown Display

```typescript
const { timeRemaining, sessionExpiry } = useAuth();
// Display time remaining to user
```

## Best Practices

1. **Always use useAuth hook** in client components
2. **Check isAuthenticated** before accessing user data
3. **Handle loading states** properly
4. **Implement session refresh UI** for better UX
5. **Use middleware** for route protection
6. **Test OAuth flows** with multiple providers
7. **Monitor session expiry** in critical flows
8. **Implement logout** on all pages
9. **Handle errors gracefully** with user feedback
10. **Use server actions** for all auth operations

## Troubleshooting

### OAuth Not Working

1. Check redirect URLs in Appwrite console
2. Verify provider credentials
3. Check browser console for errors
4. Ensure cookies are enabled

### Session Expires Too Quickly

1. Adjust `SESSION_REFRESH_THRESHOLD`
2. Check Appwrite session settings
3. Verify cookie max-age settings

### Middleware Redirecting Incorrectly

1. Check route patterns in middleware config
2. Verify publicRoutes array
3. Check session cookie availability

### User Role Not Updated

1. Clear role cookie on role change
2. Refresh user data after role update
3. Check database role column

## API Reference

See individual files for detailed API documentation:
- [Auth Actions](./actions/auth.actions.ts)
- [Session Manager](./lib/session-manager.ts)
- [Auth Provider](./components/providers/auth-provider.tsx)
- [Middleware](./middleware.ts)

## Future Enhancements

Potential improvements:
- [ ] Magic link authentication
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Rate limiting
- [ ] IP-based restrictions
- [ ] Security audit logs
- [ ] Password reset flow
- [ ] Email verification
- [ ] Account recovery
- [ ] Social account merging
