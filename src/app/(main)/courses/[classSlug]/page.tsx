import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "../_components/CourseCard";
import { getClasses, getAllCoursesForClass } from "@/lib/server/course-service";
import { Class } from "@/types/courses";

interface PageProps {
  params: Promise<{ classSlug: string }>;
}

// Generate static params for all classes at build time
export async function generateStaticParams() {
  const classesResponse = await getClasses();
  const classes =
    classesResponse.success && classesResponse.data
      ? classesResponse.data.filter((c) => c.courseCount > 0)
      : [];

  return classes.map((cls) => ({
    classSlug: cls.className.toLowerCase().replace(/\s+/g, "-"),
  }));
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { classSlug } = await params;
  const className = classSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${className} Courses`,
    description: `Browse all ${className} courses available on Brritto`,
  };
}

// Helper to find class by slug
async function getClassBySlug(slug: string): Promise<Class | null> {
  const classesResponse = await getClasses();
  if (!classesResponse.success || !classesResponse.data) return null;

  return (
    classesResponse.data.find(
      (cls) => cls.className.toLowerCase().replace(/\s+/g, "-") === slug
    ) || null
  );
}

export default async function ClassCoursesPage({ params }: PageProps) {
  const { classSlug } = await params;

  // Find the class
  const classData = await getClassBySlug(classSlug);
  if (!classData) {
    notFound();
  }

  // Fetch all courses for this class
  const coursesResponse = await getAllCoursesForClass(classData._id);
  const courses =
    coursesResponse.success && coursesResponse.data ? coursesResponse.data : [];

  return (
    <>
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              {classData.className}{" "}
              <span className="text-purple-600">Courses</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
              available
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">
                No courses available for this class yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
