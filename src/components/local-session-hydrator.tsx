"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { getStoredAuthToken, getStoredUser } from "@/utils/auth-storage";

export function LocalSessionHydrator() {
  const { setIsAuthenticated, setUserRole, setUserId } = useAppStore();

  useEffect(() => {
    const syncSession = () => {
      const token = getStoredAuthToken();
      const user = getStoredUser();
      const isAuthed = Boolean(token && user);

      setIsAuthenticated(isAuthed);
      setUserRole(isAuthed ? user?.role ?? null : null);
      setUserId(isAuthed ? user?.id ?? null : null);
    };

    syncSession();

    const handleStorageChange = () => syncSession();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setIsAuthenticated, setUserRole, setUserId]);

  return null;
}
