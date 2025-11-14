/**
 * Error message formatting utilities
 */

import { ZodError } from 'zod';

/**
 * Type for field-level validation errors
 */
export type FieldErrors = Record<string, string[] | undefined>;

/**
 * Type for action result with potential errors
 */
export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string | FieldErrors };

/**
 * Formats Zod validation errors into a user-friendly message
 * @param error - Zod error object
 * @returns Formatted error message string
 */
export function formatZodError(error: ZodError): string {
  const fieldErrors = error.flatten().fieldErrors;
  const messages: string[] = [];

  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (Array.isArray(errors) && errors.length > 0) {
      messages.push(`${field}: ${errors.join(', ')}`);
    }
  }

  return messages.length > 0 ? messages.join('; ') : 'Validation failed';
}

/**
 * Formats field errors into a single error message string
 * @param fieldErrors - Object containing field-level errors
 * @returns Formatted error message string
 */
export function formatFieldErrors(fieldErrors: FieldErrors): string {
  const messages: string[] = [];

  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (Array.isArray(errors) && errors.length > 0) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      messages.push(`${fieldName}: ${errors.join(', ')}`);
    }
  }

  return messages.length > 0 ? messages.join('; ') : 'Validation failed';
}

/**
 * Checks if an error is a field errors object
 * @param error - Error value to check
 * @returns True if error is a field errors object
 */
export function isFieldErrors(error: unknown): error is FieldErrors {
  return (
    typeof error === 'object' &&
    error !== null &&
    !Array.isArray(error) &&
    Object.values(error).every((val) => Array.isArray(val) || val === undefined)
  );
}

/**
 * Gets a user-friendly error message from various error types
 * @param error - Error value (string, FieldErrors, or Error object)
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (isFieldErrors(error)) {
    return formatFieldErrors(error);
  }

  if (error instanceof ZodError) {
    return formatZodError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Creates a standardized error result for server actions
 * @param error - Error message or field errors
 * @returns ActionResult with error
 */
export function createErrorResult(error: string | FieldErrors): ActionResult {
  return {
    success: false,
    error,
  };
}

/**
 * Creates a standardized success result for server actions
 * @param data - Optional data to include in result
 * @param message - Optional success message
 * @returns ActionResult with success
 */
export function createSuccessResult<T>(data?: T, message?: string): ActionResult<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  };
}

/**
 * Formats database error messages into user-friendly text
 * @param error - Database error object
 * @returns User-friendly error message
 */
export function formatDatabaseError(error: { code?: string; message?: string }): string {
  // Common PostgreSQL error codes
  const errorMessages: Record<string, string> = {
    '23505': 'A record with this information already exists.',
    '23503': 'This operation references data that does not exist.',
    '23502': 'Required information is missing.',
    '42501': 'You do not have permission to perform this action.',
    '42P01': 'The requested resource could not be found.',
  };

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  return 'A database error occurred. Please try again.';
}
