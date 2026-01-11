/**
 * Server-side API Client
 *
 * Utility for making authenticated API calls to the backend
 * This runs ONLY on the server side - API endpoints are never exposed to the client
 */

import { ErrorResponse, StandardApiResponse } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL;

// ============================================================================
// API Error Class
// ============================================================================

export class ApiError extends Error {
  statusCode: number;
  code: string;
  traceId?: string;
  timestamp?: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    options?: {
      traceId?: string;
      timestamp?: string;
      details?: unknown;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.traceId = options?.traceId;
    this.timestamp = options?.timestamp;
    this.details = options?.details;
  }

  /**
   * Create ApiError from ErrorResponse
   */
  static fromErrorResponse(response: ErrorResponse): ApiError {
    return new ApiError(
      response.error.message,
      response.statusCode,
      response.error.code,
      {
        traceId: response.error.traceId,
        timestamp: response.error.timestamp,
        details: response.error.details,
      }
    );
  }
}

// ============================================================================
// Request Options
// ============================================================================

interface RequestOptions extends RequestInit {
  token?: string;
}

// ============================================================================
// API Request Function
// ============================================================================

/**
 * Make an authenticated API request
 * Returns StandardApiResponse format
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<StandardApiResponse<T>> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add existing headers if provided
  if (fetchOptions.headers) {
    const existingHeaders = new Headers(fetchOptions.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
      // Enable Next.js caching with revalidation
      next: { revalidate: 3600, ...fetchOptions.next }, // 1 hour cache
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        statusCode: response.status,
        message: "Server returned non-JSON response",
        data: undefined,
      } as StandardApiResponse<T>;
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok || data.success === false) {
      // Check if it's the new error format
      if ("error" in data && typeof data.error === "object") {
        const errorResponse = data as ErrorResponse;
        return {
          success: false,
          statusCode: errorResponse.statusCode,
          message: errorResponse.error.message,
          data: undefined,
        } as StandardApiResponse<T>;
      }

      // Fallback for legacy error format
      return {
        success: false,
        statusCode: data.statusCode || response.status,
        message: data.message || "Request failed",
        data: undefined,
      } as StandardApiResponse<T>;
    }

    return data as StandardApiResponse<T>;
    return data as StandardApiResponse<T>;
  } catch (error) {
    // Return standardized error response instead of throwing

    // Handle ApiError cases (re-thrown or created above)
    if (error instanceof ApiError) {
      return {
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message,
        data: undefined, // Type assertion needed or optional in interface
      } as StandardApiResponse<T>;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      return {
        success: false,
        statusCode: 0,
        message: "Network error - unable to reach the server",
        data: undefined,
      } as StandardApiResponse<T>;
    }

    // Handle JSON parsing or other errors
    return {
      success: false,
      statusCode: 500,
      message: "Invalid response from server",
      data: undefined,
    } as StandardApiResponse<T>;
  }
}

// ============================================================================
// HTTP Method Helpers
// ============================================================================

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<StandardApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

/**
 * GET request helper
 */
export async function get<T>(
  endpoint: string,
  token?: string
): Promise<StandardApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "GET",
    token,
  });
}

/**
 * PUT request helper
 */
export async function put<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<StandardApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

/**
 * DELETE request helper
 */
export async function del<T>(
  endpoint: string,
  token?: string
): Promise<StandardApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    token,
  });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<StandardApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}
