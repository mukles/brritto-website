import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    orderId?: string;
    transactionId?: string;
    message?: string;
    courseId?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Your payment status",
};

type PaymentStatus = "success" | "failed" | "cancelled";

const statusConfig: Record<
  PaymentStatus,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    bgColor: string;
    iconBgColor: string;
    iconColor: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
  }
> = {
  success: {
    title: "Payment Successful!",
    description:
      "Your payment has been processed successfully. You can now access your course.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    bgColor: "from-green-50 to-emerald-50",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    primaryAction: { label: "Go to My Courses", href: "/my-courses" },
    secondaryAction: { label: "Browse More Courses", href: "/courses" },
  },
  failed: {
    title: "Payment Failed",
    description:
      "Unfortunately, your payment could not be processed. Please try again or use a different payment method.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    bgColor: "from-red-50 to-pink-50",
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
    primaryAction: { label: "Try Again", href: "/courses" },
    secondaryAction: { label: "Contact Support", href: "/contact" },
  },
  cancelled: {
    title: "Payment Cancelled",
    description:
      "Your payment was cancelled. You can try again whenever you're ready.",
    icon: (
      <svg
        className="w-12 h-12"
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
    ),
    bgColor: "from-amber-50 to-orange-50",
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    primaryAction: { label: "Browse Courses", href: "/courses" },
    secondaryAction: { label: "Go Home", href: "/" },
  },
};

export default async function PaymentStatusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawStatus = params.status?.toLowerCase() || "failed";
  const status: PaymentStatus =
    rawStatus === "success" ||
    rawStatus === "failed" ||
    rawStatus === "cancelled"
      ? rawStatus
      : "failed";
  const orderId = params.orderId;
  const transactionId = params.transactionId;
  const message = params.message;
  const courseId = params.courseId;

  // Get status configuration
  const config = statusConfig[status];

  // Update primary action href if courseId is provided for retry
  const primaryAction =
    courseId && status === "failed"
      ? {
          ...config.primaryAction,
          href: `/checkout/${courseId}`,
          label: "Try Again",
        }
      : config.primaryAction;

  return (
    <>
      <section className={`py-16 lg:py-24 bg-gradient-to-br ${config.bgColor}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 text-center">
            {/* Status Icon */}
            <div
              className={`w-24 h-24 ${config.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-8`}
            >
              <span className={config.iconColor}>{config.icon}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {config.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {message || config.description}
            </p>

            {/* Transaction Details */}
            {(orderId || transactionId) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left max-w-sm mx-auto">
                {orderId && (
                  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">Order ID</span>
                    <span className="text-gray-900 font-medium text-sm">
                      {orderId}
                    </span>
                  </div>
                )}
                {transactionId && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-sm">
                      Transaction ID
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {transactionId}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={primaryAction.href}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  status === "success"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30 hover:shadow-green-500/50"
                    : status === "failed"
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-purple-600/30 hover:shadow-purple-600/50"
                      : status === "cancelled"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 hover:shadow-amber-500/50"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30 hover:shadow-blue-500/50"
                }`}
              >
                {primaryAction.label}
              </Link>

              {config.secondaryAction && (
                <Link
                  href={config.secondaryAction.href}
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  {config.secondaryAction.label}
                </Link>
              )}
            </div>

            {/* Help Text */}
            {status === "failed" && (
              <p className="mt-8 text-sm text-gray-500">
                Having trouble?{" "}
                <Link
                  href="/contact"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Contact our support team
                </Link>
              </p>
            )}

            {status === "success" && (
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm text-green-700">
                  🎉 Thank you for your purchase! Your course is now ready to
                  access.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
