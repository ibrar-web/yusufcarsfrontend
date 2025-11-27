"use client";

import { useEffect, useState } from "react";
import type { QuoteNotificationsPayload } from "@/stores/app-store";
import { useAppStore } from "@/stores/app-store";
import type { ConnectSocketOptions } from "@/utils/socket";
import {
  initQuoteRequestSocket,
  teardownQuoteRequestSocket,
} from "@/utils/socket/quoteRequestSocket";
import {
  initQuoteOfferSocket,
  teardownQuoteOfferSocket,
} from "@/utils/socket/quoteOfferSocket";
import {
  initChatSocket,
  teardownChatSocket,
} from "@/utils/socket/chatSocket";

const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "access_token";

const getAuthTokenFromCookie = () => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${AUTH_COOKIE_NAME}=`;
  const entry = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
};

const isQuoteNotificationsPayload = (
  payload: unknown,
): payload is QuoteNotificationsPayload => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<QuoteNotificationsPayload>;
  return (
    typeof candidate.productName === "string" &&
    typeof candidate.productImage === "string" &&
    Array.isArray(candidate.quotes)
  );
};

const teardownAllSockets = () => {
  teardownQuoteRequestSocket();
  teardownQuoteOfferSocket();
  teardownChatSocket();
};

export function SocketManager() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userRole = useAppStore((state) => state.userRole);
  const setQuoteNotifications = useAppStore(
    (state) => state.setQuoteNotifications,
  );
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthToken(null);
      return;
    }

    setAuthToken(getAuthTokenFromCookie());
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      teardownAllSockets();
      return;
    }

    const connectOptions: ConnectSocketOptions = {
      role: userRole ?? undefined,
      authToken: authToken ?? undefined,
    };

    const handleQuotePayload = (payload: Record<string, unknown>) => {
      if (isQuoteNotificationsPayload(payload)) {
        setQuoteNotifications(payload);
        return;
      }

      console.info(
        "[SocketManager] Received quote payload with unexpected shape",
        payload,
      );
    };

    initQuoteRequestSocket({
      isAuthenticated,
      connectOptions,
      onRequestCreated: handleQuotePayload,
      onRequestUpdated: handleQuotePayload,
    });

    initQuoteOfferSocket({
      isAuthenticated,
      connectOptions,
      onOfferReceived: handleQuotePayload,
      onOfferUpdated: handleQuotePayload,
    });

    initChatSocket({
      isAuthenticated,
      connectOptions,
      onMessageReceived: (payload) => {
        console.info("[chat] message received", payload);
      },
      onMessageDelivered: (payload) => {
        console.info("[chat] message delivered", payload);
      },
    });

    return () => {
      teardownAllSockets();
    };
  }, [authToken, isAuthenticated, setQuoteNotifications, userRole]);

  return null;
}
