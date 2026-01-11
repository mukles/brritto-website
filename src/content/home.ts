export const homeContent = {
  hero: {
    badge: "Live Learning Platform - Enroll Today",
    title: "Master Your Skills with",
    brandName: "Brritto",
    subtitle:
      "Your ultimate learning platform for courses, books, and customized testing. Practice with chapter-wise tests, track your progress, and achieve excellence.",
    primaryCTA: {
      text: "Start Learning Now",
      href: "#courses",
    },
    secondaryCTA: {
      text: "Browse Courses",
      href: "#courses",
    },
    stats: [
      { value: "100+", label: "Courses" },
      { value: "50+", label: "Books" },
      { value: "300K+", label: "Learners" },
    ],
  },
  features: {
    badge: "Platform Features",
    title: "Everything You Need to",
    titleAccent: "Excel",
    subtitle:
      "Comprehensive learning tools designed for students who want to master their subjects",
  },
};

export type HomeContent = typeof homeContent;
