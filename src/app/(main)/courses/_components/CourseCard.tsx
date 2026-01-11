"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/types/courses";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const {
    _id,
    courseName,
    courseImage,
    thumbnail, // Fallback support
    actualPrice,
    price, // Fallback support
    discountedPrice,
    discountPrice, // Fallback support
    class: courseClass,
    category,
    courseCategory,
  } = course;

  // Handle field mapping from potentially different API versions
  const finalPrice = actualPrice ?? price ?? 0;
  const finalDiscountPrice = discountedPrice ?? discountPrice ?? 0;
  const finalThumbnail =
    courseImage || thumbnail || "/images/course-placeholder.jpg";
  const categoryName =
    courseCategory?.categoryShortName || category?.name || "Course";

  // State for image source to handle fallback on error
  const [imgSrc, setImgSrc] = useState(finalThumbnail);

  // Determine if there is a discount
  const hasDiscount = finalDiscountPrice > 0 && finalDiscountPrice < finalPrice;
  const displayPrice = hasDiscount ? finalDiscountPrice : finalPrice;

  return (
    <Link
      href={`/src/app/(main)/courses/details/${_id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={courseName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgSrc("/images/course-placeholder.jpg")}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-700 shadow-sm">
          {categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
            {courseClass?.className}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
          {courseName}
        </h3>

        {/* Spacer to push pricing to bottom */}
        <div className="flex-1"></div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ৳{finalPrice}
              </span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-gray-900">
                ৳{displayPrice}
              </span>
            </div>
          </div>

          <span className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-purple-600/30">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
