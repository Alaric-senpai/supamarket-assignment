import { createLogger } from './logger'
import { APPWRITE_NETWORK_CONFIG, LOGGING_CONFIG } from './config'
import type { RetryError } from './types'

const { MAX_RETRIES, REQUEST_TIMEOUT, RETRYABLE_ERROR_CODES, RETRYABLE_ERROR_MESSAGES, RETRY_DELAY } = APPWRITE_NETWORK_CONFIG

/**
 * Retry helper function with exponential backoff
 * Retries failed operations with configurable retry logic
 */
const retryLogger = createLogger('RETRY', {
  minLevel: 'debug'
})

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY,
  operationName: string = 'Operation'
): Promise<T> {
  const startTime = Date.now();
  const maxAttempts = MAX_RETRIES;
  const currentAttempt = maxAttempts - retries + 1;

  retryLogger.debug(`Starting attempt ${currentAttempt}/${maxAttempts}`, operationName);

  try {
    const result = await operation();
    const duration = Date.now() - startTime;

    if (LOGGING_CONFIG.LOG_PERFORMANCE) {
      retryLogger.info(
        `Completed successfully in ${duration}ms`,
        operationName,
        { duration, attempt: currentAttempt }
      );
    }

    return result;

  } catch (error) {
    const duration = Date.now() - startTime;
    const typedError = error as RetryError;

    // Check if error is retryable
    const errorCode = typedError?.code || typedError?.cause?.code;
    const errorMessage = typedError?.message || '';

    const isRetryableByCode = RETRYABLE_ERROR_CODES.includes(errorCode as never);
    const isRetryableByMessage = RETRYABLE_ERROR_MESSAGES.some(
      msg => errorMessage.toLowerCase().includes(msg.toLowerCase())
    );
    const isRetryable = isRetryableByCode || isRetryableByMessage;

    // If retryable and retries left, retry with exponential backoff
    if (isRetryable && retries > 0) {
      const nextDelay = delay * 2; // Exponential backoff
      
      if (LOGGING_CONFIG.LOG_RETRIES) {
        retryLogger.warn(
          `Attempt ${currentAttempt}/${maxAttempts} failed, retrying in ${delay}ms`,
          operationName,
          {
            duration,
            errorCode,
            errorMessage: errorMessage.substring(0, 100),
            retriesLeft: retries,
            nextDelay
          }
        );
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Recursive retry with decreased retry count and increased delay
      return withRetry(operation, retries - 1, nextDelay, operationName);
    }

    // No more retries or error not retryable - log and throw
    if (LOGGING_CONFIG.LOG_ERRORS) {
      retryLogger.logError(
        error,
        operationName,
        {
          duration,
          errorCode,
          isRetryable,
          retriesLeft: retries,
          totalAttempts: currentAttempt,
          maxAttempts
        }
      );
    }

    throw error;
  }
}

/**
 * Timeout wrapper for operations
 * Wraps an operation with a timeout
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeout: number = REQUEST_TIMEOUT,
  operationName: string = 'Operation'
): Promise<T> {
  return Promise.race([
    operation(),
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        const error = new Error(`${operationName} timed out after ${timeout}ms`);
        retryLogger.error(
          `Operation timed out`,
          operationName,
          { timeout }
        );
        reject(error);
      }, timeout)
    )
  ]);
}

/**
 * Combined retry with timeout
 * Retries an operation with timeout protection
 */
export async function withRetryAndTimeout<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    timeout?: number;
    operationName?: string;
  } = {}
): Promise<T> {
  const {
    retries = MAX_RETRIES,
    delay = RETRY_DELAY,
    timeout = REQUEST_TIMEOUT,
    operationName = 'Operation'
  } = options;

  return withRetry(
    () => withTimeout(operation, timeout, operationName),
    retries,
    delay,
    operationName
  );
}

