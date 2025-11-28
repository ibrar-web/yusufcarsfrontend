"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { initChatSocket, teardownChatSocket } from "@/utils/socket/chatSocket";
import { connectSocket, disconnectSocket } from "@/utils/socket";

export function SocketManager() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      teardownChatSocket();
      disconnectSocket();
      return;
    }

    const socket = connectSocket({
      query: { userId },
    });

    if (!socket) {
      return () => {
        teardownChatSocket();
        disconnectSocket();
      };
    }

    initChatSocket();

    return () => {
      teardownChatSocket();
      disconnectSocket();
    };
  }, [isAuthenticated, userId]);

  return null;
}
