'use server';

import { getRoleCookie, getUserSessionCookie } from '@/server/cookies';
import { createClientSession } from '@/server/clients';
import { getUserRole } from '@/actions/user.actions';
import { UserRole } from './utils';

/**
 * Verify user role with double-check to prevent cookie manipulation
 * This checks both the cookie AND validates against the database
 */
export async function verifyUserRole(requiredRole:UserRole): Promise<{
  valid: boolean;
  message?: string;
}> {
  try {
    // Check 1: Cookie check (fast, but can be manipulated)
    const cookieRole = await getRoleCookie();
    
    if (!cookieRole) {
      return {
        valid: false,
        message: 'No role cookie found'
      };
    }

    // Check 2: Session validation (ensures user is actually logged in)
    const sessionSecret = await getUserSessionCookie();
    
    if (!sessionSecret) {
      return {
        valid: false,
        message: 'No active session'
      };
    }

    // Check 3: Get user from session and verify role from database
    try {
      const { accounts } = await createClientSession();
      const user = await accounts.get();
      
      if (!user || !user.$id) {
        return {
          valid: false,
          message: 'Invalid session'
        };
      }

      // Check 4: Verify role from database (authoritative source)
      const dbRole = await getUserRole(user.$id);
      
      // Check 5: Compare all three sources
      const cookieMatches = cookieRole === requiredRole;
      const dbMatches = dbRole === requiredRole;
      
      if (!cookieMatches || !dbMatches) {
        // Role mismatch detected - possible tampering
        console.error('[Security Alert] Role mismatch detected', {
          userId: user.$id,
          cookieRole,
          dbRole,
          requiredRole
        });
        
        return {
          valid: false,
          message: 'Role verification failed'
        };
      }

      // All checks passed
      return {
        valid: true
      };

    } catch (sessionError) {
      console.error('Session validation error:', sessionError);
      return {
        valid: false,
        message: 'Session validation failed'
      };
    }

  } catch (error) {
    console.error('Role verification error:', error);
    return {
      valid: false,
      message: 'Role verification error'
    };
  }
}

/**
 * Require admin role with strict verification
 * Throws error if not admin - use in server components/actions
 */
export async function requireAdmin(): Promise<void> {
  const result = await verifyUserRole('admin');
  
  if (!result.valid) {
    throw new Error(`Admin access required: ${result.message}`);
  }
}

/**
 * Require client role (or admin) with verification
 * Throws error if not authorized - use in server components/actions
 */
export async function requireClient(): Promise<void> {
  const adminResult = await verifyUserRole('admin');
  
  if (adminResult.valid) {
    return; // Admin can access client routes
  }

  const clientResult = await verifyUserRole('client');
  
  if (!clientResult.valid) {
    throw new Error(`Client access required: ${clientResult.message}`);
  }
}
