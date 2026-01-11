import { getClasses, getCourses } from "@/lib/server/course-service";
import CourseExplorer from "@/app/(main)/courses/_components/CourseExplorer";
import { Class, Course } from "@/types/courses";

// Type for class with pre-fetched courses
interface ClassWithCourses extends Class {
  courses: Course[];
  hasMore: boolean;
}

// Error fallback component
function CourseExplorerError() {
  return (
    <section id="courses" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Unable to load courses
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We&apos;re having trouble connecting to our servers. Please try
            refreshing the page or check back later.
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function CourseExplorerSection() {
  // 1. Fetch Classes (for tabs)
  const classesResponse = await getClasses();

  // Check if the request was successful
  if (!classesResponse.success) {
    console.error("Failed to fetch classes:", classesResponse.message);
    return <CourseExplorerError />;
  }

  const classes = classesResponse.data
    ? classesResponse.data.filter((c) => c.courseCount > 0)
    : [];

  // If no classes available, show empty state
  if (classes.length === 0) {
    return (
      <section id="courses" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Courses Coming Soon
            </h2>
            <p className="text-lg text-gray-600">
              We&apos;re working on bringing you amazing courses. Stay tuned!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 2. Pre-fetch 8 courses for EACH class at build time
  // Limit to first 5 classes to prevent timeout
  const limitedClasses = classes.slice(0, 5);

  const classesWithCourses: ClassWithCourses[] = await Promise.all(
    limitedClasses.map(async (cls) => {
      const coursesResponse = await getCourses(1, 8, cls._id);
      let courses: Course[] = [];
      let hasMore = false;

      if (coursesResponse.success && coursesResponse.data) {
        courses = coursesResponse.data;
        const meta = coursesResponse.meta;
        const totalPages = meta?.totalPages || 1;
        hasMore = totalPages > 1;
      }

      return { ...cls, courses, hasMore };
    })
  );

  // Add remaining classes without pre-fetched courses
  const remainingClasses: ClassWithCourses[] = classes.slice(5).map((cls) => ({
    ...cls,
    courses: [],
    hasMore: true,
  }));

  const allClassesWithCourses = [...classesWithCourses, ...remainingClasses];

  return <CourseExplorer classesWithCourses={allClassesWithCourses} />;
}
