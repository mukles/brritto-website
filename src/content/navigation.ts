export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Books", href: "/books" },
  { label: "Explore app", href: "/explore" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Books", href: "/books" },
  { label: "Explore app", href: "/explore" },
  { label: "Contact", href: "/contact" },
];

export const legalLinks: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
