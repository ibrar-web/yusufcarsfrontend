"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { initChatSocket, teardownChatSocket } from "@/utils/socket/chatSocket";
import {
  initQuoteRequestSocket,
  teardownQuoteRequestSocket,
} from "@/utils/socket/quoteRequestSocket";
import {
  initQuoteOfferSocket,
  teardownQuoteOfferSocket,
} from "@/utils/socket/quoteOfferSocket";
import { connectSocket, disconnectSocket } from "@/utils/socket";

export function SocketManager() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      teardownChatSocket();
      teardownQuoteRequestSocket();
      teardownQuoteOfferSocket();
      disconnectSocket();
      return;
    }
    const socket = connectSocket({
      query: { userId },
    });

    if (!socket) {
      return () => {
        teardownChatSocket();
        teardownQuoteRequestSocket();
        teardownQuoteOfferSocket();
        disconnectSocket();
      };
    }
    console.log("socket connect", "userId :", userId);
    initChatSocket();
    initQuoteRequestSocket();
    initQuoteOfferSocket();

    return () => {
      teardownChatSocket();
      teardownQuoteRequestSocket();
      teardownQuoteOfferSocket();
      disconnectSocket();
    };
  }, [isAuthenticated, userId]);

  return null;
}
