import React from "react";

export interface HeroSectionProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export default function HeroSection({
  badge = "Live Learning Platform - Enroll Today",
  title,
  subtitle,
  primaryCTA = { text: "Start Learning Now", href: "/explore" },
  secondaryCTA = { text: "Browse Courses", href: "/courses" },
  stats = [
    { value: "100+", label: "Courses" },
    { value: "50+", label: "Books" },
    { value: "300K+", label: "Learners" },
  ],
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 py-24 lg:py-40 overflow-hidden">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl" />

      {/* Geometric accent shapes */}
      <div className="absolute top-10 right-20 w-32 h-32 border-2 border-purple-200 rounded-2xl rotate-12 opacity-50" />
      <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-pink-200 rounded-full opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-8 animate-fade-in-up">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-purple-900">{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6 animate-fade-in-up animation-delay-100">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl animate-fade-in-up animation-delay-200">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-300">
            <a
              href={primaryCTA.href}
              className="
                w-full sm:w-auto inline-flex items-center justify-center gap-2
                bg-gradient-to-r from-purple-600 to-fuchsia-600
                text-white
                rounded-xl px-8 py-4 text-base font-semibold
                shadow-lg shadow-purple-600/30
                hover:shadow-purple-600/50 hover:from-purple-700 hover:to-fuchsia-700
                transition-all duration-300 ease-out
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-0
                focus:shadow-[0_0_0_4px_rgba(147,51,234,0.2)]
                min-h-[52px]
              "
            >
              <span>{primaryCTA.text}</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            <a
              href={secondaryCTA.href}
              className="
                w-full sm:w-auto inline-flex items-center justify-center gap-2
                bg-white
                border-2 border-purple-300
                text-purple-700
                rounded-xl px-8 py-4 text-base font-semibold
                hover:bg-purple-50 hover:border-purple-400
                transition-all duration-300 ease-out
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-0
                focus:shadow-[0_0_0_4px_rgba(147,51,234,0.1)]
                min-h-[52px]
              "
            >
              <span>{secondaryCTA.text}</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in-up animation-delay-400">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
