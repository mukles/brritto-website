export interface Class {
  _id: string;
  className: string;
  priority: number;
  courseCount: number;
}

export interface CourseCategory {
  _id: string;
  name: string;
}

export interface Course {
  _id: string;
  courseName: string;
  courseImage: string;
  actualPrice: number;
  discountedPrice: number;
  class: {
    _id: string;
    className: string;
  };
  // Supporting both old category structure (potentially) and new one
  category?: {
    _id: string;
    name: string;
  };
  courseCategory?: {
    _id: string;
    categoryShortName: string;
  };
  // Additional fields from API
  subject?: any[];
  isFree?: boolean;

  // Legacy fields for fallback support
  thumbnail?: string;
  price?: number;
  discountPrice?: number;
}

// Full course details from /web/courses/:id endpoint
export interface CourseDetails {
  _id: string;
  courseName: string;
  courseImage: string;
  actualPrice: number;
  discountedPrice: number;
  class: {
    _id: string;
    className: string;
  };
  courseCategory?: {
    _id: string;
    categoryShortName: string;
  };
  subjects: Array<{
    _id: string;
    subjectName: string;
  }>;
  hierarchyLabelName?: string;
  courseType?: string;
  expirationDate?: string;
  primaryColour?: string;
  secondaryColour?: string;
  isFree: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetaPagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    pagination?: MetaPagination;
    timestamp?: string;
    traceId?: string;
    version?: string;
  };
}
