"use client";

import { mainNavigation } from "@/config/navigation";
import { checkAuthStatus, logout } from "@/lib/server/auth-service";
import { HeaderProps } from "@/types";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

export default function Header({ className = "" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 10;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

  // Check authentication status and get user profile on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);

      // Get user name from localStorage
      if (authenticated) {
        try {
          const profileStr = localStorage.getItem("studentProfile");
          if (profileStr) {
            const profile = JSON.parse(profileStr);
            setUserName(profile.name || null);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      // Clear localStorage profile on logout
      localStorage.removeItem("studentProfile");
      await logout();
      // Update local state to show Login button
      setIsAuthenticated(false);
      setUserName(null);
      // Redirect to home page
      window.location.href = "/";
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerVariants = {
    top: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      backdropFilter: "blur(0px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0)",
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(229, 231, 235, 1)",
    },
  };

  return (
    <motion.header
      initial="top"
      animate={isScrolled ? "scrolled" : isMobileMenuOpen ? "scrolled" : "top"} // Force scrolled style if mobile menu is open for readability
      variants={headerVariants}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        !isScrolled && !isMobileMenuOpen
          ? "bg-gradient-to-r from-purple-700 to-indigo-700"
          : "bg-white shadow-lg"
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center transition-all duration-300 hover:opacity-80 min-h-[44px] min-w-[44px] justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Brritto Logo"
                  width={120}
                  height={40}
                  priority
                  className={`h-8 w-auto transition-all duration-300 ${
                    isScrolled || isMobileMenuOpen ? "" : "brightness-0 invert"
                  }`}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative transition-colors duration-300 font-medium text-sm group py-2 ${
                  isScrolled || isMobileMenuOpen
                    ? "text-gray-700 hover:text-purple-600"
                    : "text-white hover:text-emerald-300"
                }`}
                {...(item.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full ${
                    isScrolled || isMobileMenuOpen
                      ? "bg-gradient-to-r from-purple-600 to-pink-500"
                      : "bg-emerald-400"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Right side - User Name & Login/Logout */}
          <div className="flex items-center space-x-3">
            {/* User Name & Logout Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Name */}
                {userName && (
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`hidden sm:inline-block text-sm font-semibold truncate max-w-[150px] ${
                      isScrolled || isMobileMenuOpen
                        ? "text-gray-700"
                        : "text-white"
                    }`}
                  >
                    {userName}
                  </motion.span>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isPending}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] flex items-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    isScrolled || isMobileMenuOpen
                      ? "bg-gray-100 text-black border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 focus:ring-gray-300 shadow-gray-300/20"
                      : "bg-white text-black border-2 border-white hover:bg-gray-50 hover:border-gray-50 focus:ring-white shadow-white/30"
                  }`}
                >
                  {isPending ? "Logging out..." : "Logout"}
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className={`rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] flex items-center ${
                    isScrolled || isMobileMenuOpen
                      ? "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 focus:ring-purple-600 shadow-purple-600/20"
                      : "bg-white text-purple-700 border-2 border-white hover:bg-purple-100 hover:border-purple-100 focus:ring-white shadow-white/30"
                  }`}
                >
                  Login
                </Link>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2 transition-all duration-300 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isScrolled || isMobileMenuOpen
                  ? "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                  : "text-white hover:text-emerald-300 hover:bg-white/10"
              }`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  variants={{
                    closed: { d: "M4 6h16M4 12h16M4 18h16", rotate: 0 },
                    open: { d: "M6 18L18 6M6 6l12 12", rotate: 90 },
                  }}
                  transition={{ duration: 0.3 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-sm rounded-2xl my-2 shadow-xl border border-purple-100">
                {mainNavigation.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 font-medium rounded-xl min-h-[44px] flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                      {...(item.external && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
