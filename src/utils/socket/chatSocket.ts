"use client";

import { getSocket } from "./index";

export const CHAT_MESSAGE_EVENT = "chat:message";

export type ChatMessagePayload = Record<string, unknown>;

export type InitChatSocketOptions = {
  onMessageReceived?: (payload: ChatMessagePayload) => void;
};

let chatMessageListener: ((payload: ChatMessagePayload) => void) | null = null;

export function initChatSocket(options: InitChatSocketOptions = {}) {
  const socket = getSocket();
  if (!socket) {
    return null;
  }

  if (chatMessageListener) {
    socket.off(CHAT_MESSAGE_EVENT, chatMessageListener);
    chatMessageListener = null;
  }

  if (options.onMessageReceived) {
    chatMessageListener = options.onMessageReceived;
    socket.on(CHAT_MESSAGE_EVENT, chatMessageListener);
  }

  return socket;
}

export function teardownChatSocket() {
  const socket = getSocket();
  if (socket && chatMessageListener) {
    socket.off(CHAT_MESSAGE_EVENT, chatMessageListener);
  }
  chatMessageListener = null;
}

export function getChatSocket() {
  return getSocket();
}
