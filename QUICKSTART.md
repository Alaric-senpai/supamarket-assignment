# Quick Start Guide - Enhanced Auth System

## 🎉 What's New

Your Appwrite + Next.js template now has a fully functional, production-ready authentication system with:

- ✅ Email/Password authentication  
- ✅ OAuth2 social login (Google, GitHub, Microsoft, Apple, Facebook)
- ✅ Automatic token expiry handling & refresh
- ✅ Multiple account linking/unlinking
- ✅ Active session management
- ✅ Protected routes with middleware
- ✅ Role-based access control

## 🚀 Getting Started

### 1. Configure Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USERS_TABLE_ID=your_users_table_id
NEXT_PUBLIC_URL=http://localhost:3000
```

### 2. Configure OAuth Providers in Appwrite

For each OAuth provider you want to use:

1. Go to Appwrite Console → Your Project → Auth → Settings
2. Enable the OAuth provider
3. Add credentials (Client ID, Client Secret)
4. Set redirect URL: `http://localhost:3000/(auth)/oauth`

**Supported Providers:**
- Google
- GitHub  
- Microsoft
- Apple
- Facebook

### 3. Test the Auth Flow

#### Email/Password Flow:
1. Navigate to `http://localhost:3000/(auth)/signup`
2. Register a new account
3. Login at `http://localhost:3000/(auth)/login`
4. Access dashboard at `/dashboard`

#### OAuth Flow:
1. Navigate to `http://localhost:3000/(auth)/login`
2. Click on any OAuth provider button
3. Authorize with the provider
4. Get redirected back to success page → dashboard

## 📱 Key Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/(auth)/login` | Email/password & OAuth login |
| Signup | `/(auth)/signup` | User registration |
| Dashboard | `/(client)/dashboard` | Protected user dashboard |
| Account Security | `/(client)/account-security` | Manage linked accounts & sessions |
| Link Account | `/(client)/link-account` | Connect additional OAuth providers |

## 🔧 Using Auth in Your Components

### Client Component Example

```tsx
'use client';

import { useAuth } from '@/components/providers/auth-provider';

export default function MyComponent() {
  const { 
    user,           // Current user object
    isAuthenticated,// Auth status
    isLoading,      // Loading state
    role,           // User role (admin/client)
    logout          // Logout function
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Server Action Example

```tsx
import { getCurrentUser, isLoggedIn } from '@/actions/auth.actions';

export default async function ServerComponent() {
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    return <div>Not authenticated</div>;
  }

  const { user } = await getCurrentUser();
  
  return <div>Hello {user?.name}</div>;
}
```

## 🔐 Session Management

### Automatic Features:
- **Auto-refresh**: Sessions refresh automatically when < 30 minutes remaining
- **Monitoring**: Background checks every 5 minutes
- **Expiry handling**: Graceful logout on expiry with user notification

### Manual Session Control:

```tsx
import { 
  listActiveSessions, 
  deleteSessionById, 
  refreshCurrentSession 
} from '@/actions/auth.actions';

// List all active sessions
const { sessions } = await listActiveSessions();

// Revoke a specific session
await deleteSessionById(sessionId);

// Force refresh current session
await refreshCurrentSession();
```

## 🔗 OAuth Account Linking

Users can link multiple OAuth providers to their account:

1. Navigate to `/link-account`
2. Click on a provider to connect
3. Authorize with the provider
4. Account is linked!

Manage linked accounts at `/account-security`:
- View all connected providers
- See OAuth token expiry dates
- Unlink providers (requires at least 1 active auth method)

## 🛡️ Route Protection

Routes are automatically protected by middleware:

**Public Routes** (no auth required):
- `/`
- `/(auth)/*`
- `/terms`

**Protected Routes** (auth required):
- `/dashboard`
- `/(client)/*`

**Admin Routes** (admin role required):
- `/(admin)/*`

### Add Custom Protected Routes:

Edit `middleware.ts`:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/(client)',
  '/my-custom-route',  // Add here
];
```

## 🎨 Customization

### Add More OAuth Providers

1. Update the enum in `actions/auth.actions.ts`:

```typescript
const OAuthSchema = z.object({
  provider: z.enum(["google", "github", "microsoft", "apple", "facebook", "linkedin"])
});
```

2. Add provider button in `components/forms/SocialLogin.tsx`

3. Configure in Appwrite Console

### Modify Session Duration

Edit `lib/session-manager.ts`:

```typescript
// Change refresh threshold (currently 30 minutes)
const SESSION_REFRESH_THRESHOLD = 45 * 60 * 1000; // 45 minutes
```

### Customize Redirect URLs

Edit `config/app.config.ts`:

```typescript
export const authConfig = {
    success: appConfig.url + '/my-custom-success',
    failure: appConfig.url + '/my-custom-error'
}
```

## 🐛 Troubleshooting

### OAuth Not Working

**Issue**: OAuth redirect fails  
**Solution**: 
1. Check redirect URL in Appwrite Console matches: `http://localhost:3000/(auth)/oauth`
2. Verify provider credentials are correct
3. Enable provider in Appwrite Console

### Session Expires Too Fast

**Issue**: Getting logged out frequently  
**Solution**:
1. Increase `SESSION_REFRESH_THRESHOLD` in `lib/session-manager.ts`
2. Check Appwrite session duration settings
3. Verify cookie settings in `server/cookies.ts`

### Middleware Redirecting Incorrectly

**Issue**: Can't access certain pages  
**Solution**:
1. Check route patterns in `middleware.ts`
2. Verify session cookie exists
3. Check browser console for errors

### TypeScript Errors

**Issue**: Type errors in components  
**Solution**:
1. Ensure all dependencies are installed: `npm install`
2. Restart TypeScript server in VS Code
3. Check import paths are correct

## 📚 Documentation

Detailed documentation available:
- [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md) - Complete API reference
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was implemented

## 🎯 Testing Checklist

Before deploying:

- [ ] Email/password registration works
- [ ] Email/password login works
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Protected routes redirect correctly
- [ ] Session auto-refresh works (wait 25+ min)
- [ ] Logout clears session
- [ ] Link additional OAuth account works
- [ ] Unlink OAuth account works
- [ ] View active sessions works
- [ ] Revoke session works
- [ ] Admin routes protected by role

## 🚢 Deployment

### Environment Variables for Production:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=prod_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=prod_api_key
APPWRITE_DATABASE_ID=prod_database_id
APPWRITE_USERS_TABLE_ID=prod_users_table_id
NEXT_PUBLIC_URL=https://yourdomain.com
NODE_ENV=production
```

### Update OAuth Redirect URLs:

In Appwrite Console, add production redirect URL:
`https://yourdomain.com/(auth)/oauth`

### Security Checklist:

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys rotated from development
- [ ] CORS configured in Appwrite
- [ ] Rate limiting enabled
- [ ] Error logging configured

## 🎉 You're Ready!

Your authentication system is now fully functional. Start building your app with confidence knowing auth is handled! 

For questions or issues, refer to the documentation or check the implementation files.

Happy coding! 🚀
