"use client";

import { useEffect, useState } from "react";
import { StorageService } from "@/lib/services";

export function useLocalStore() {
  const [store, setStore] = useState(() => StorageService.read());

  useEffect(() => {
    const sync = () => setStore(StorageService.read());
    window.addEventListener("storage", sync);
    window.addEventListener("vernex-store-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vernex-store-change", sync);
    };
  }, []);

  return store;
}
