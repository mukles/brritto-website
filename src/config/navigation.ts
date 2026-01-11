import { NavigationItem } from "@/types/navigation";

/**
 * Main navigation items for the header
 */
export const mainNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Footer quick links section
 */
export const footerQuickLinks: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Footer resources section
 */
export const footerResourceLinks: NavigationItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Help Center", href: "/help" },
  { label: "FAQs", href: "/faqs" },
];

/**
 * Legal links
 */
export const legalLinks: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

/**
 * Social media links with platform names
 */
export const socialLinks = [
  {
    platform: "Facebook",
    url: "https://facebook.com/brritto",
    icon: "facebook",
  },
  { platform: "Twitter", url: "https://twitter.com/brritto", icon: "twitter" },
  {
    platform: "Instagram",
    url: "https://instagram.com/brritto",
    icon: "instagram",
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/company/brritto",
    icon: "linkedin",
  },
] as const;
