"use client";

import { usePWA } from "@/lib/usePWA";

export default function OfflineIndicator() {
  const { isOffline } = usePWA();

  // Explicitly check for true to avoid any falsy value issues
  if (isOffline !== true) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 z-50 text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
        You are currently offline. Some features may be limited.
      </div>
    </div>
  );
}
