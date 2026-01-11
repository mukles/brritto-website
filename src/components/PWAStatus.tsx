"use client";

import { usePWA } from "@/lib/usePWA";

export default function PWAStatus() {
  const { isInstalled, isOffline } = usePWA();

  // Explicitly check for true values to avoid any falsy value issues
  const shouldShowInstalled = isInstalled === true;
  const shouldShowOffline = isOffline === true;

  if (!shouldShowInstalled && !shouldShowOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {shouldShowInstalled && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            App Installed
          </div>
        </div>
      )}

      {shouldShowOffline && (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Offline Mode
          </div>
        </div>
      )}
    </div>
  );
}
