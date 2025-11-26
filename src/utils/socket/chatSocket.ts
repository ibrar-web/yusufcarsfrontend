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
const removeChatListeners = () => {
  if (!chatSocket) {
    return;
  }
  chatSocket.off(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED);
  chatSocket.off(CHAT_SOCKET_EVENTS.MESSAGE_DELIVERED);
};

export function initChatSocket(options: InitChatSocketOptions) {
  if (!options.isAuthenticated || !options.connectOptions?.authToken) {
    teardownChatSocket();
    return null;
  }

  const socket = connectSocket(options.connectOptions);
  if (!socket) {
    return null;
  }

  chatSocket = socket;
  removeChatListeners();

  if (options.onMessageReceived) {
    chatSocket.on(CHAT_SOCKET_EVENTS.MESSAGE_RECEIVED, options.onMessageReceived);
  }

  if (options.onMessageDelivered) {
    chatSocket.on(CHAT_SOCKET_EVENTS.MESSAGE_DELIVERED, options.onMessageDelivered);
  }

  return chatSocket;
}

export function teardownChatSocket() {
  removeChatListeners();
  chatSocket = null;
  disconnectSocket();
}

export function getChatSocket() {
  return chatSocket;
}
