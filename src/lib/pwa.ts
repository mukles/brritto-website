/**
 * PWA utilities for installation and offline status management
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

/**
 * Check if the app is running in standalone mode (installed as PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

/**
 * Check if the device is currently offline
 */
export function isOffline(): boolean {
  if (typeof window === "undefined") return false;
  return !window.navigator.onLine;
}

/**
 * Show PWA installation prompt if available
 */
export async function showInstallPrompt(
  installPrompt: BeforeInstallPromptEvent | null
): Promise<boolean> {
  if (!installPrompt) return false;

  try {
    await installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    return choiceResult.outcome === "accepted";
  } catch (error) {
    console.error("Error showing install prompt:", error);
    return false;
  }
}

/**
 * Get cache storage usage information
 */
export async function getCacheStorageUsage(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if (typeof navigator === "undefined" || !("storage" in navigator)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  } catch (error) {
    console.error("Error getting storage estimate:", error);
    return null;
  }
}

/**
 * Clear PWA cache storage
 */
export async function clearPWACache(): Promise<boolean> {
  if (typeof caches === "undefined") return false;

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    return true;
  } catch (error) {
    console.error("Error clearing cache:", error);
    return false;
  }
}
