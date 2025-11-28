"use client";

import { io, type Socket } from "socket.io-client";

const CHAT_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const CHAT_MESSAGE_EVENT = "chat:message";

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
  socket.off(CHAT_MESSAGE_EVENT);
  if (options.onMessageReceived) {
    socket.on(CHAT_MESSAGE_EVENT, options.onMessageReceived);
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
