/**
 * Appwrite Configuration & Network Settings
 * 
 * This file contains configuration for Appwrite connection reliability
 */

export const APPWRITE_NETWORK_CONFIG = {
  /**
   * Maximum number of retry attempts for failed requests
   * Default: 3 attempts
   */
  MAX_RETRIES: 3,

  /**
   * Initial delay between retries in milliseconds
   * Uses exponential backoff: 1s, 2s, 4s
   * Default: 1000ms (1 second)
   */
  RETRY_DELAY: 2000,

  /**
   * Request timeout in milliseconds
   * Note: This is handled by Node.js fetch
   * Default: 30000ms (30 seconds)
   */
  REQUEST_TIMEOUT: 30000,

  /**
   * Error codes that trigger automatic retry
   */
  RETRYABLE_ERROR_CODES: [
    'ETIMEDOUT',      // Connection timeout
    'ECONNRESET',     // Connection reset by peer
    'ENOTFOUND',      // DNS lookup failed
    'ECONNREFUSED',   // Connection refused
    'EPIPE',          // Broken pipe
  ],

  /**
   * Error messages that trigger automatic retry
   */
  RETRYABLE_ERROR_MESSAGES: [
    'fetch failed',
    'network error',
    'socket hang up',
    'timeout',
  ],
};

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  /**
   * Session cookie name
   */
  COOKIE_NAME: 'appwrite-session',

  /**
   * Role cookie name
   */
  ROLE_COOKIE_NAME: 'user-role',

  /**
   * Session duration in seconds (30 days)
   */
  MAX_AGE: 60 * 60 * 24 * 30,

  /**
   * Cookie options
   */
  COOKIE_OPTIONS: {
    path: '/',
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: true,
  },
};

/**
 * Logging configuration
 */
export const LOGGING_CONFIG = {
  /**
   * Enable detailed retry logging
   */
  LOG_RETRIES: process.env.NODE_ENV === 'development',

  /**
   * Enable error logging
   */
  LOG_ERRORS: true,

  /**
   * Enable performance logging
   */
  LOG_PERFORMANCE: process.env.NODE_ENV === 'development',
};