"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { checkAuthStatus } from "@/lib/server/auth-service";
import {
  initiatePayment,
  PaymentGatewayType,
} from "@/lib/server/payment-service";
import { CourseDetails } from "@/types/courses";

interface CheckoutPageClientProps {
  course: CourseDetails;
}

type PaymentMethod = "BKASH" | "AAMARPAY" | null;

export default function CheckoutPageClient({
  course,
}: CheckoutPageClientProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      const authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Calculate final price
  const hasDiscount =
    course.discountedPrice > 0 && course.discountedPrice < course.actualPrice;
  const finalPrice = hasDiscount ? course.discountedPrice : course.actualPrice;
  const discountAmount = hasDiscount
    ? course.actualPrice - course.discountedPrice
    : 0;

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await initiatePayment(
        course._id,
        selectedPayment as PaymentGatewayType
      );

      if (result.success && result.data?.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        setError(
          result.message || "Failed to initiate payment. Please try again."
        );
        setIsProcessing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please log in to your account to enroll in this course.
            </p>

            {/* Course Preview */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6 text-left">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={course.courseImage || "/images/course-placeholder.jpg"}
                  alt={course.courseName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {course.courseName}
                </h3>
                <p className="text-lg font-bold text-purple-600">
                  ৳{finalPrice}
                </p>
              </div>
            </div>

            <Link
              href={`/login?redirect=/checkout/${course._id}`}
              className="block w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 transform hover:scale-105"
            >
              Login to Continue
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href={`/signup?redirect=/checkout/${course._id}`}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  // Authenticated - show checkout
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href={`/src/app/(main)/courses/details/${course._id}`}
            className="text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Course
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Select Payment Method
              </h1>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* bKash Option */}
                <button
                  onClick={() => setSelectedPayment("BKASH")}
                  disabled={isProcessing}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPayment === "BKASH"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                  } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-pink-600">bK</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">bKash</h3>
                    <p className="text-sm text-gray-500">
                      Pay with your bKash mobile wallet
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "BKASH"
                        ? "border-pink-500 bg-pink-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPayment === "BKASH" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Aamarpay Option */}
                <button
                  onClick={() => setSelectedPayment("AAMARPAY")}
                  disabled={isProcessing}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPayment === "AAMARPAY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-blue-600">AP</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">Aamarpay</h3>
                    <p className="text-sm text-gray-500">
                      Pay with cards, mobile banking & more
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "AAMARPAY"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPayment === "AAMARPAY" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  selectedPayment && !isProcessing
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transform hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Redirecting to payment...
                  </span>
                ) : (
                  `Pay ৳${finalPrice}`
                )}
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Course Card */}
              <div className="flex gap-4 mb-6">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={course.courseImage || "/images/course-placeholder.jpg"}
                    alt={course.courseName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.class.className}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-gray-900">৳{course.actualPrice}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-৳{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-purple-600">
                    ৳{finalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
