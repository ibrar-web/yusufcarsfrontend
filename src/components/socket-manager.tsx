"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import {
  CHAT_MESSAGE_EVENT,
  initChatSocket,
  teardownChatSocket,
} from "@/utils/socket/chatSocket";
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

    initChatSocket({
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
