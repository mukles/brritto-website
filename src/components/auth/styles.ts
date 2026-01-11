/**
 * Auth Styles
 *
 * Shared Tailwind CSS classes for auth components
 * Centralized to maintain consistency and DRY principle
 */

export const AUTH_STYLES = {
  button:
    "w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",

  input:
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",

  inputError: "border-red-400 focus:border-red-500 focus:ring-red-500/20",

  label: "block text-sm font-semibold text-gray-700 mb-2",

  errorText: "mt-1.5 text-sm text-red-500 font-medium",

  hintText: "mt-1.5 text-sm text-gray-500",

  linkButton:
    "text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed",

  secondaryButton:
    "text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:cursor-not-allowed",

  logoutButton:
    "px-6 py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
} as const;
