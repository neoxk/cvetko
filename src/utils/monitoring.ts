export type ErrorReporter = (error: Error, context?: Record<string, unknown>) => void;

let reporter: ErrorReporter | null = null;

export const setErrorReporter = (next: ErrorReporter | null): void => {
  reporter = next;
};

export const reportError = (error: Error, context?: Record<string, unknown>): void => {
  if (!reporter) {
    return;
  }
  reporter(error, context);
};
