"use client";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "./index";
import type { ConnectSocketOptions } from "./index";

export const CHAT_SOCKET_EVENTS = {
  MESSAGE_RECEIVED: "chat:message",
  MESSAGE_DELIVERED: "chat:delivered",
} as const;

export type ChatSocketEventPayload = Record<string, unknown>;

export type InitChatSocketOptions = {
  isAuthenticated: boolean;
  connectOptions: ConnectSocketOptions;
  onMessageReceived?: (payload: ChatSocketEventPayload) => void;
  onMessageDelivered?: (payload: ChatSocketEventPayload) => void;
};

let chatSocket: Socket | null = null;
const CHAT_NAMESPACE =
  process.env.NEXT_PUBLIC_CHAT_SOCKET_NAMESPACE ?? "/chat";

const removeChatListeners = () => {
  if (!chatSocket) {
    return;
  }
  chatSocket.off(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED);
  chatSocket.off(CHAT_SOCKET_EVENTS.MESSAGE_DELIVERED);
};

export function initChatSocket(options: InitChatSocketOptions) {
  console.info("chat socket connection setup");
  if (!options.isAuthenticated) {
    teardownChatSocket();
    return null;
  }

  const socket = connectSocket({
    ...options.connectOptions,
    namespace: CHAT_NAMESPACE,
  });
  if (!socket) {
    return null;
  }

  chatSocket = socket;
  // eslint-disable-next-line no-console
  console.info("[chatSocket] connected");
  removeChatListeners();

  if (options.onMessageReceived) {
    console.log("chat message received");
    chatSocket.on(
      CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED,
      options.onMessageReceived
    );
  }

  if (options.onMessageDelivered) {
    chatSocket.on(
      CHAT_SOCKET_EVENTS.MESSAGE_DELIVERED,
      options.onMessageDelivered
    );
  }

  return chatSocket;
}

export function teardownChatSocket() {
  removeChatListeners();
  chatSocket = null;
  disconnectSocket(CHAT_NAMESPACE);
  // eslint-disable-next-line no-console
  console.info("[chatSocket] disconnected");
}

export function getChatSocket() {
  return chatSocket;
}
