"use client";

import { useEffect } from "react";
import { applyPrimaryColor } from "@/lib/theme";

const storageKey = "vernex-platform-v4-empty";

export function ThemeInitializer() {
  useEffect(() => {
    function applySavedTheme() {
      try {
        const stored = window.localStorage.getItem(storageKey);
        const color = stored ? JSON.parse(stored)?.settings?.primaryColor : undefined;
        applyPrimaryColor(color);
      } catch {
        applyPrimaryColor();
      }
    }

    applySavedTheme();
    window.addEventListener("storage", applySavedTheme);
    window.addEventListener("vernex-store-change", applySavedTheme);
    return () => {
      window.removeEventListener("storage", applySavedTheme);
      window.removeEventListener("vernex-store-change", applySavedTheme);
    };
  }, []);

  return null;
}
