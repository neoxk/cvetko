export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, unknown>;

type LogArgs = [string] | [string, LogContext];

let debugEnabled = false;

const buildArgs = (message: string, context?: LogContext): LogArgs =>
  context ? [message, context] : [message];

export const setDebugEnabled = (enabled: boolean): void => {
  debugEnabled = enabled;
};

export const getDebugEnabled = (): boolean => debugEnabled;

import { reportError } from './monitoring';

export const log = (level: LogLevel, message: string, context?: LogContext): void => {
  if (level === 'debug' && !debugEnabled) {
    return;
  }

  const args = buildArgs(message, context);

  switch (level) {
    case 'debug':
      console.debug(...args);
      break;
    case 'info':
      console.info(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error': {
      console.error(...args);
      const error = context?.['error'];
      if (error instanceof Error) {
        reportError(error, context);
      }
      break;
    }
  }
};

export const logger = {
  debug: (message: string, context?: LogContext): void => log('debug', message, context),
  info: (message: string, context?: LogContext): void => log('info', message, context),
  warn: (message: string, context?: LogContext): void => log('warn', message, context),
  error: (message: string, context?: LogContext): void => log('error', message, context),
};
