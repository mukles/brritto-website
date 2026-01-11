/**
 * Authentication Layout
 *
 * Centered layout with floating circle decorations - matching original design
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Brritto",
  description: "Login or create your Brritto account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] relative overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-[slideUpFadeIn_0.6s_ease-out]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Brritto
            </h1>
            <p className="text-gray-500 text-sm">
              Your Learning Journey Starts Here
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Background decoration - Original floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circle 1 - Top right */}
        <div className="absolute w-[30rem] h-[30rem] -top-40 -right-40 rounded-full bg-white/10 backdrop-blur-[20px] animate-[float_20s_ease-in-out_infinite]" />
        {/* Circle 2 - Bottom left */}
        <div className="absolute w-[25rem] h-[25rem] -bottom-32 -left-32 rounded-full bg-white/10 backdrop-blur-[20px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        {/* Circle 3 - Center */}
        <div className="absolute w-[20rem] h-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 backdrop-blur-[20px] animate-[float_30s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
