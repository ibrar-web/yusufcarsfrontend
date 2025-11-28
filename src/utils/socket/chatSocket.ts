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

  chatMessageListener = (payload: ChatMessagePayload) => {
    console.info("[chat] message received", payload);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(CHAT_MESSAGE_EVENT, { detail: payload }),
      );
    }
    options.onMessageReceived?.(payload);
  };

  socket.on(CHAT_MESSAGE_EVENT, chatMessageListener);

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
