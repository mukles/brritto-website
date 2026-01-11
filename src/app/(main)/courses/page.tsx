import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "./_components/CourseCard";
import { getClasses, getAllCoursesForClass } from "@/lib/server/course-service";
import { Class, Course } from "@/types/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse all our courses organized by class",
};

// Type for class with its courses
interface ClassWithCourses extends Class {
  courses: Course[];
}

export default async function CoursesIndexPage() {
  // 1. Fetch all classes
  const classesResponse = await getClasses();
  const classes =
    classesResponse.success && classesResponse.data
      ? classesResponse.data.filter((c) => c.courseCount > 0)
      : [];

  // 2. Fetch courses for each class
  const classesWithCourses: ClassWithCourses[] = await Promise.all(
    classes.map(async (cls) => {
      const coursesResponse = await getAllCoursesForClass(cls._id);
      const courses =
        coursesResponse.success && coursesResponse.data
          ? coursesResponse.data
          : [];
      return { ...cls, courses };
    })
  );

  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Browse <span className="text-purple-600">Courses</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all our courses organized by class
          </p>
        </div>
      </section>

      {/* Grouped Courses */}
      {classesWithCourses.map((cls) => (
        <section
          key={cls._id}
          className="py-12 border-b border-gray-100 last:border-b-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Class Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {cls.className}
                </h2>
                <p className="mt-1 text-gray-500">
                  {cls.courses.length}{" "}
                  {cls.courses.length === 1 ? "course" : "courses"}
                </p>
              </div>
              <Link
                href={`/src/app/(main)/courses/${cls.className.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
              >
                View All →
              </Link>
            </div>

            {/* Courses Grid - Show only first row (4 courses) */}
            {cls.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cls.courses.slice(0, 4).map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No courses available yet.
              </p>
            )}

            {/* View All button if more than 4 courses */}
            {cls.courses.length > 4 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/src/app/(main)/courses/${cls.className.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/30"
                >
                  View All {cls.courses.length} Courses →
                </Link>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
