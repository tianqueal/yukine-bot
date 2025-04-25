/**
 * Utilities for error handling
 */

/**
 * Extracts a readable error message from any type of error.
 * @param error - The error caught (of type unknown)
 * @returns An error message as string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Error desconocido';
}
