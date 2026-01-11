"use server";

import { get } from "../api-client";
import { Class, Course, CourseDetails } from "@/types/courses";
import { StandardApiResponse } from "@/types/api";

/**
 * Fetch all classes sorted by priority
 * Uses /web/classes endpoint
 */
export async function getClasses(): Promise<StandardApiResponse<Class[]>> {
  try {
    const response = await get<Class[]>("/web/classes");

    return response;
  } catch (error) {
    // Log cleaner error without stack trace for expected API failures
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch classes: ${errorMessage}`);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch classes",
      data: [],
    };
  }
}

/**
 * Fetch courses with pagination and class filter
 * Uses /web/courses endpoint
 */
export async function getCourses(
  page: number = 1,
  limit: number = 10,
  classId?: string
): Promise<StandardApiResponse<Course[]>> {
  try {
    let endpoint = `/web/courses?page=${page}&limit=${limit}`;
    if (classId) {
      endpoint += `&class=${classId}`;
    }

    // Cast the response because the user's meta structure (pagination nested in meta)
    // might slightly differ from StandardApiResponse definition if api.ts is old.
    // But logically passing Course[] is correct for data.
    const response = await get<Course[]>(endpoint);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch courses: ${errorMessage}`);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch courses",
      data: [],
    };
  }
}

/**
 * Fetch ALL courses for a class (no pagination limit)
 * Used for SSG pages to ensure all courses are indexable
 */
export async function getAllCoursesForClass(
  classId: string
): Promise<StandardApiResponse<Course[]>> {
  try {
    // Use a high limit to get all courses
    const endpoint = `/web/courses?page=1&limit=1000&class=${classId}`;
    const response = await get<Course[]>(endpoint);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch all courses for class: ${errorMessage}`);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch all courses for class",
      data: [],
    };
  }
}

/**
 * Fetch course details by ID
 * Uses /web/courses/:id endpoint
 */
export async function getCourseDetails(
  courseId: string
): Promise<StandardApiResponse<CourseDetails | null>> {
  try {
    const response = await get<CourseDetails>(`/web/courses/${courseId}`);
    return response as StandardApiResponse<CourseDetails | null>;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to fetch course details: ${errorMessage}`);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch course details",
      data: null,
    };
  }
}
