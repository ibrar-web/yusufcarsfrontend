"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { initChatSocket, teardownChatSocket } from "@/utils/chat-socket";

export function SocketManager() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      teardownChatSocket();
      return;
    }

    initChatSocket({
      userId,
      onMessageReceived: (payload) => {
        console.info("[chat] message received", payload);
      },
    });

    return () => {
      teardownChatSocket();
    };
  }, [isAuthenticated, userId]);

  return null;
}
