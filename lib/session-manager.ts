'use server';

import { validateSession, extendSession, getSessionExpiry } from '@/actions/auth.actions';
import { deleteSessionCookie, deleteRoleCookie } from '@/server/cookies';

/**
 * Session refresh threshold in milliseconds (30 minutes)
 * If session expires in less than this, it will be refreshed
 */
const SESSION_REFRESH_THRESHOLD = 24 *60 * 60 * 1000;

/**
 * Check and manage session expiry
 * Returns session status and automatically refreshes if needed
 */
export async function checkAndManageSession() {
  try {
    // First validate if session exists and is valid
    const isValid = await validateSession();
    
    if (!isValid) {
      return {
        valid: false,
        expired: true,
        message: 'Session is invalid or expired'
      };
    }

    // Get session expiry information
    const expiryInfo = await getSessionExpiry();
    
    if (!expiryInfo.success) {
      return {
        valid: false,
        expired: true,
        message: 'Could not retrieve session expiry'
      };
    }

    // Check if session is expired
    if (expiryInfo.isExpired) {
      // Clear cookies for expired session
      await deleteSessionCookie();
      await deleteRoleCookie();
      
      return {
        valid: false,
        expired: true,
        message: 'Session has expired'
      };
    }

    // Check if session needs refresh (expires soon)
    if (expiryInfo.timeRemaining && expiryInfo.timeRemaining < SESSION_REFRESH_THRESHOLD) {
      const refreshResult = await extendSession();
      
      if (refreshResult.success) {
        return {
          valid: true,
          expired: false,
          refreshed: true,
          message: 'Session refreshed successfully',
          expiry: refreshResult.data?.expire
        };
      } else {
        // Session refresh failed but still valid for now
        return {
          valid: true,
          expired: false,
          refreshed: false,
          warning: 'Session refresh failed',
          expiry: expiryInfo.expire,
          timeRemaining: expiryInfo.timeRemaining
        };
      }
    }

    // Session is valid and doesn't need refresh
    return {
      valid: true,
      expired: false,
      refreshed: false,
      expiry: expiryInfo.expire,
      timeRemaining: expiryInfo.timeRemaining
    };
  } catch (error: any) {
    console.error('Session Management Error:', error);
    return {
      valid: false,
      expired: true,
      error: error.message,
      message: 'Failed to manage session'
    };
  }
}

/**
 * Monitor session and return status for client-side handling
 */
export async function getSessionStatus() {
  try {
    const expiryInfo = await getSessionExpiry();
    
    if (!expiryInfo.success) {
      return {
        active: false,
        message: 'No active session'
      };
    }

    const now = new Date().getTime();
    const expireTime = new Date(expiryInfo.expire || '').getTime();
    const timeRemaining = expireTime - now;

    return {
      active: !expiryInfo.isExpired,
      expiry: expiryInfo.expire,
      timeRemaining: Math.max(0, timeRemaining),
      expiresIn: {
        hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
        minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000)
      },
      needsRefresh: timeRemaining < SESSION_REFRESH_THRESHOLD
    };
  } catch (error: any) {
    console.error('Get Session Status Error:', error);
    return {
      active: false,
      error: error.message,
      message: 'Failed to get session status'
    };
  }
}

/**
 * Force refresh current session
 */
export async function refreshCurrentSession() {
  try {
    const result = await extendSession();
    return result;
  } catch (error: any) {
    console.error('Refresh Session Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to refresh session'
    };
  }
}
