"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import {
  CHAT_MESSAGE_EVENT,
  initChatSocket,
  teardownChatSocket,
} from "@/utils/socket/chatSocket";
import { disconnectSocket } from "@/utils/socket";

export function SocketManager() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      teardownChatSocket();
      disconnectSocket();
      return;
    }

    initChatSocket({
      userId,
      onMessageReceived: (payload) => {
        console.info("[chat] message received", payload);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(CHAT_MESSAGE_EVENT, { detail: payload }),
          );
        }
      },
    });

    return () => {
      teardownChatSocket();
      disconnectSocket();
    };
  }, [isAuthenticated, userId]);

  return null;
}
