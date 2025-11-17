"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import type { SessionState } from "@/actions/session";

type Props = {
  session: SessionState;
};

export function SessionHydrator({ session }: Props) {
  const { setIsAuthenticated, setUserRole } = useAppStore();

  useEffect(() => {
    if (session.isAuthenticated) {
      setIsAuthenticated(true);
      setUserRole(session.role ?? null);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [session, setIsAuthenticated, setUserRole]);

  return null;
}
