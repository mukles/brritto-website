/**
 * Navigation item interface
 */
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Header component props interface
 */
export interface HeaderProps {
  className?: string;
}

/**
 * Footer component props interface
 */
export interface FooterProps {
  className?: string;
}

/**
 * Contact section component props interface
 */
export interface ContactSectionProps {
  className?: string;
}
