/**
 * Standard API Response Types
 *
 * Centralized types for API responses following the standard format
 */

// ============================================================================
// Response Meta
// ============================================================================

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// ============================================================================
// Standard API Response
// ============================================================================

export interface StandardApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: ResponseMeta;
}

// ============================================================================
// Error Response
// ============================================================================

export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: unknown;
  traceId: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  error: ApiErrorDetails;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: StandardApiResponse<unknown> | ErrorResponse
): response is ErrorResponse {
  return response.success === false && "error" in response;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: StandardApiResponse<T> | ErrorResponse
): response is StandardApiResponse<T> & { success: true } {
  return response.success === true;
}
