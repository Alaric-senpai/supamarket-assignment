// lib/logger.ts
import type { LogLevel, LogContext, LoggerOptions } from './types'

class Logger {
  private defaultOperation: string;
  private enableTimestamp: boolean;
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(options: LoggerOptions = {}) {
    this.defaultOperation = options.namespace || 'APP';
    this.enableTimestamp = true;
    this.minLevel = options.minLevel || 'info';
    this.isDevelopment = options.isDevelopment ?? (process.env.NODE_ENV === 'development');
  }

  private shouldLog(level: LogLevel): boolean {
    // Only log in development environment
    if (!this.isDevelopment) {
      // In production, only log errors
      return level === 'error';
    }
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private getLevelEmoji(level: LogLevel): string {
    if (!this.isDevelopment) return '';
    
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      default: return '';
    }
  }

  private formatMessage(
    level: LogLevel,
    operation: string,
    message: string,
    context?: LogContext
  ): string {
    const parts: string[] = [];
    
    if (this.enableTimestamp) {
      parts.push(`[${this.formatTimestamp()}]`);
    }
    
    parts.push(`${this.getLevelEmoji(level)} [${level.toUpperCase()}]`);
    parts.push(`[${operation}]`);
    parts.push(message);
    
    if (context && Object.keys(context).length > 0) {
      try {
        parts.push(JSON.stringify(context, null, this.isDevelopment ? 2 : 0));
      } catch (error) {
        parts.push('[Context serialization failed]');
      }
    }
    
    return parts.join(' ');
  }

  private safeLog(
    logFn: (...args: unknown[]) => void,
    message: string
  ): void {
    try {
      logFn(message);
    } catch (error) {
      // Fallback to console.log if the specific log function fails
      console.log(message);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    operation?: string,
    context?: LogContext
  ): void {
    if (!this.shouldLog(level)) return;

    const op = operation || this.defaultOperation;
    const formattedMessage = this.formatMessage(level, op, message, context);
    
    switch (level) {
      case 'debug':
        this.safeLog(console.debug, formattedMessage);
        break;
      case 'info':
        this.safeLog(console.info, formattedMessage);
        break;
      case 'warn':
        this.safeLog(console.warn, formattedMessage);
        break;
      case 'error':
        this.safeLog(console.error, formattedMessage);
        break;
    }
  }

  debug(message: string, operation?: string, context?: LogContext): void {
    this.log('debug', message, operation, context);
  }

  info(message: string, operation?: string, context?: LogContext): void {
    this.log('info', message, operation, context);
  }

  warn(message: string, operation?: string, context?: LogContext): void {
    this.log('warn', message, operation, context);
  }

  error(message: string, operation?: string, context?: LogContext): void {
    this.log('error', message, operation, context);
  }

  // Helper method to log errors with stack traces
  logError(error: unknown, operation?: string, additionalContext?: LogContext): void {
    const context: LogContext = {
      ...additionalContext,
    };

    if (error instanceof Error) {
      context.name = error.name;
      context.message = error.message;
      if (this.isDevelopment && error.stack) {
        context.stack = error.stack;
      }
    } else {
      context.error = String(error);
    }

    this.error('An error occurred', operation, context);
  }

  // Create a child logger with a new default operation
  child(namespace: string): Logger {
    return new Logger({
      namespace,
      minLevel: this.minLevel,
      isDevelopment: this.isDevelopment,
    });
  }

  // Enable/disable logging at runtime
  setDevelopment(isDev: boolean): void {
    this.isDevelopment = isDev;
  }

  // Update minimum log level at runtime
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// Default logger instance
export const logger = new Logger({
  namespace: 'KAZIFLOW',
  minLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  isDevelopment: process.env.NODE_ENV === 'development',
});

// Factory function to create loggers with specific namespaces
export function createLogger(
  namespace: string, 
  options: Omit<LoggerOptions, 'namespace'> = {}
): Logger {
  return new Logger({
    ...options,
    namespace,
  });
}

// Re-export types from centralized location
export type { LogLevel, LogContext, LoggerOptions } from './types'
