"use client";

import { io, type Socket } from "socket.io-client";

const CHAT_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export type ChatMessagePayload = Record<string, unknown>;

export type InitChatSocketOptions = {
  userId: string;
  onMessageReceived?: (payload: ChatMessagePayload) => void;
};

let chatSocket: Socket | null = null;

export function initChatSocket(options: InitChatSocketOptions) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!CHAT_SOCKET_URL) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing NEXT_PUBLIC_SOCKET_URL; chat socket will not initialize.",
      );
    }
    return null;
  }

  if (chatSocket) {
    registerHandlers(chatSocket, options);
    return chatSocket;
  }

  chatSocket = io(CHAT_SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: false,
    autoConnect: true,
    query: {
      userId: options.userId,
    },
  });

  chatSocket.on("connect_error", (error) => {
    // eslint-disable-next-line no-console
    console.warn(`[chatSocket] connection error: ${error.message}`);
  });

  registerHandlers(chatSocket, options);

  return chatSocket;
}

function registerHandlers(socket: Socket, options: InitChatSocketOptions) {
  socket.off("chat:message");
  if (options.onMessageReceived) {
    socket.on("chat:message", options.onMessageReceived);
  }
}

export function teardownChatSocket() {
  if (chatSocket) {
    chatSocket.removeAllListeners();
    chatSocket.disconnect();
    chatSocket = null;
  }
}

export function getChatSocket() {
  return chatSocket;
}

