"use client";

import { useEffect, useState } from "react";
import { AnalyticsService } from "@/lib/services";

export function useLocalStore() {
  const [store, setStore] = useState(() => AnalyticsService.visibleStore());

  useEffect(() => {
    const sync = () => setStore(AnalyticsService.visibleStore());
    window.addEventListener("storage", sync);
    window.addEventListener("vernex-store-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vernex-store-change", sync);
    };
  }, []);

  return store;
}
