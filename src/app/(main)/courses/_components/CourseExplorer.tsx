"use client";

import { useState } from "react";
import Link from "next/link";
import { Class, Course } from "@/types/courses";
import ClassTabs from "./ClassTabs";
import CourseCard from "./CourseCard";

// Type for class with pre-fetched courses
interface ClassWithCourses extends Class {
  courses: Course[];
  hasMore: boolean;
}

interface CourseExplorerProps {
  classesWithCourses: ClassWithCourses[];
}

export default function CourseExplorer({
  classesWithCourses,
}: CourseExplorerProps) {
  // If no classes, nothing to show
  if (!classesWithCourses || classesWithCourses.length === 0) {
    return null;
  }

  // State - just track selected class ID
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classesWithCourses[0]._id
  );

  // Get current class data from pre-fetched props
  const currentClass =
    classesWithCourses.find((c) => c._id === selectedClassId) ||
    classesWithCourses[0];
  const courses = currentClass.courses;
  const hasMore = currentClass.hasMore;

  // Simple tab switch - no API call needed!
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  // Generate class slug for View All link
  const classSlug = currentClass.className.toLowerCase().replace(/\s+/g, "-");

  return (
    <section id="courses" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Our <span className="text-purple-600">Courses</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect course for your academic journey. Select your class
            to get started.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <ClassTabs
            classes={classesWithCourses}
            selectedClassId={selectedClassId}
            onSelect={handleClassSelect}
          />
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
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
            </div>
            <h3 className="text-xl font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-2 text-gray-500">
              We currently don&apos;t have any courses listed for this class.
            </p>
          </div>
        )}

        {/* View All Courses Button */}
        {hasMore && courses.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href={`/src/app/(main)/courses/${classSlug}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              View All Courses →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
