import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCourseDetails } from "@/lib/server/course-service";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const response = await getCourseDetails(courseId);

  if (!response.success || !response.data) {
    return { title: "Course Not Found" };
  }

  return {
    title: response.data.courseName,
    description: `${response.data.courseName} - ${response.data.class.className} course on Brritto`,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { courseId } = await params;

  const response = await getCourseDetails(courseId);

  if (!response.success || !response.data) {
    notFound();
  }

  const course = response.data;

  // Calculate discount percentage
  const discountPercent =
    course.actualPrice > 0
      ? Math.round(
          ((course.actualPrice - course.discountedPrice) / course.actualPrice) *
            100
        )
      : 0;

  const hasDiscount =
    course.discountedPrice > 0 && course.discountedPrice < course.actualPrice;

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-12 lg:py-16"
        style={{
          background: course.primaryColour
            ? `linear-gradient(135deg, ${course.primaryColour}20, ${course.secondaryColour || course.primaryColour}10)`
            : "linear-gradient(135deg, #f3e8ff, #fce7f3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={course.courseImage || "/images/course-placeholder.jpg"}
                alt={course.courseName}
                fill
                className="object-cover"
                priority
              />
              {course.courseCategory && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-purple-700 shadow-sm">
                  {course.courseCategory.categoryShortName}
                </div>
              )}
            </div>

            {/* Course Info */}
            <div>
              <div className="text-sm font-medium text-purple-600 mb-2">
                {course.class.className}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {course.courseName}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                {course.isFree ? (
                  <span className="text-3xl font-bold text-green-600">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ৳
                      {hasDiscount
                        ? course.discountedPrice
                        : course.actualPrice}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ৳{course.actualPrice}
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>
                    {course.subjects?.length || 0}{" "}
                    {(course.subjects?.length || 0) === 1
                      ? "Subject"
                      : "Subjects"}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={`/src/app/(main)/checkout/${course._id}`}
                className="inline-block w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      {course.subjects && course.subjects.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Course Content
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {course.subjects.map((subject, index) => (
                <div
                  key={subject._id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {subject.subjectName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
