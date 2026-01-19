/**
 * Logger Types
 * Type definitions for logging system
 */

/**
 * Log level type
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * Log context type
 */
export type LogContext = Record<string, unknown>

/**
 * Logger options interface
 */
export interface LoggerOptions {
  namespace?: string
  minLevel?: LogLevel
  isDevelopment?: boolean
}

/**
 * Logger instance interface
 */
export interface ILogger {
  debug(message: string, error?: Error, context?: LogContext): void
  info(message: string, error?: Error, context?: LogContext): void
  warn(message: string, error?: Error, context?: LogContext): void
  error(message: string, error?: Error, context?: LogContext): void
  logError(error: Error, source: string, context?: LogContext): void
  child(namespace: string): ILogger
  setDevelopment(isDevelopment: boolean): void
  setMinLevel(level: LogLevel): void
}

/**
 * Helper Types
 * Type definitions for helper utilities
 */

/**
 * Retry error interface
 */
export interface RetryError extends Error {
  retryable?: boolean
  statusCode?: number
  code?: string | number
  cause?: {
    code?: string | number
  }
}

/**
 * Retry options interface
 */
export interface RetryOptions {
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  onRetry?: (error: Error, attempt: number) => void
}

/**
 * Timeout options interface
 */
export interface TimeoutOptions {
  timeoutMs: number
  timeoutMessage?: string
}

/**
 * Retry and timeout options interface
 */
export interface RetryAndTimeoutOptions extends RetryOptions, TimeoutOptions {}

/**
 * Async function type
 */
export type AsyncFunction<T> = () => Promise<T>

/**
 * Retry result type
 */
export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: Error
  attempts: number
  totalDuration: number
}
