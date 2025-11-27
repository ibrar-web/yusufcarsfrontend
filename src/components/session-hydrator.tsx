"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import type { SessionState } from "@/actions/session";

type Props = {
  session: SessionState;
};

export function SessionHydrator({ session }: Props) {
  const { setIsAuthenticated, setUserRole, setUserId } = useAppStore();

  useEffect(() => {
    if (session.isAuthenticated) {
      setIsAuthenticated(true);
      setUserRole(session.role ?? null);
      setUserId(session.userId ?? null);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
    }
  }, [session, setIsAuthenticated, setUserRole, setUserId]);

  return null;
}
