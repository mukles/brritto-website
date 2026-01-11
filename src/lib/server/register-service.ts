/**
 * Institution Service
 *
 * Server Actions for institution and class API calls
 * Used for searching and fetching institutions/classes
 */

"use server";

import { get } from "../api-client";
import { getSession } from "../session";

// ============================================================================
// Types
// ============================================================================

export interface Institution {
  _id: string;
  name: string;
  institutionShortName: string;
}

interface InstitutionListResponse {
  data: Institution[];
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

interface ServiceResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

// ============================================================================
// Institution Operations
// ============================================================================

/**
 * Search institutions with pagination
 * Uses /api/v1/students/institution endpoint
 */
export async function searchInstitutions(
  query?: string,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResult<Institution[]>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    // Build endpoint with pagination and optional search
    let endpoint = `/students/institution?page=${page}&limit=${limit}`;
    if (query) {
      endpoint += `&term=${encodeURIComponent(query)}`;
    }

    const response = await get<InstitutionListResponse>(
      endpoint,
      session.accessToken
    );

    // Handle response format: { data: [...], pagination: {...} }
    const institutions = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    return {
      success: true,
      message: "Institutions fetched successfully",
      data: institutions,
    };
  } catch (error) {
    console.error("Failed to fetch institutions:", error);
    return {
      success: false,
      message: "Failed to fetch institutions",
      data: [],
    };
  }
}

/**
 * Get a single institution by ID
 */
export async function getInstitutionById(
  id: string
): Promise<ServiceResult<Institution>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    const response = await get<Institution>(
      `/api/v1/institutions/${id}`,
      session.accessToken
    );

    return {
      success: true,
      message: "Institution fetched successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Failed to fetch institution:", error);
    return {
      success: false,
      message: "Failed to fetch institution",
    };
  }
}

// ============================================================================
// Class Types
// ============================================================================

export interface ClassOption {
  _id: string;
  className: string;
}

// ============================================================================
// Class Operations
// ============================================================================

/**
 * Get all classes
 * Uses /api/v1/web/classes endpoint
 */
export async function getClasses(): Promise<ServiceResult<ClassOption[]>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    const response = await get<ClassOption[]>(
      "/web/classes",
      session.accessToken
    );

    // Response format: { success, data: [...], ... }
    const classes = Array.isArray(response.data) ? response.data : [];

    return {
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    };
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return {
      success: false,
      message: "Failed to fetch classes",
      data: [],
    };
  }
}

// ============================================================================
// District Types
// ============================================================================

export interface District {
  _id: string;
  name: string;
}

interface DistrictListResponse {
  data: District[];
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

// ============================================================================
// District Operations
// ============================================================================

/**
 * Search districts with pagination
 * Uses /api/v1/districts endpoint
 */
export async function searchDistricts(
  query?: string,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResult<District[]>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    // Build endpoint with pagination and optional search
    let endpoint = `/districts?page=${page}&limit=${limit}`;
    if (query) {
      endpoint += `&term=${encodeURIComponent(query)}`;
    }

    const response = await get<DistrictListResponse>(
      endpoint,
      session.accessToken
    );

    // Handle response format: { data: [...], pagination: {...} }
    const districts = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    return {
      success: true,
      message: "Districts fetched successfully",
      data: districts,
    };
  } catch (error) {
    console.error("Failed to fetch districts:", error);
    return {
      success: false,
      message: "Failed to fetch districts",
      data: [],
    };
  }
}
