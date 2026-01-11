"use client";

import { useState, useEffect } from "react";
import { BeforeInstallPromptEvent, isPWAInstalled, isOffline } from "./pwa";

export interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  promptInstall: () => Promise<boolean>;
}

/**
 * React hook for PWA installation and offline status management
 */
export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => isPWAInstalled());
  const [offline, setOffline] = useState(() => isOffline());
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error prompting install:", error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline: offline,
    installPrompt,
    promptInstall,
  };
}
