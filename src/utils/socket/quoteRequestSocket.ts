"use client";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "./index";
import type { ConnectSocketOptions } from "./index";

export const QUOTE_REQUEST_EVENTS = {
  REQUEST_CREATED: "quote:request:created",
  REQUEST_UPDATED: "quote:request:updated",
} as const;

export type QuoteRequestEventPayload = Record<string, unknown>;

export type InitQuoteRequestSocketOptions = {
  isAuthenticated: boolean;
  connectOptions: ConnectSocketOptions;
  onRequestCreated?: (payload: QuoteRequestEventPayload) => void;
  onRequestUpdated?: (payload: QuoteRequestEventPayload) => void;
};

let quoteRequestSocket: Socket | null = null;
const QUOTE_REQUEST_NAMESPACE =
  process.env.NEXT_PUBLIC_QUOTE_REQUEST_SOCKET_NAMESPACE ?? "/quote-requests";

const removeRequestListeners = () => {
  if (!quoteRequestSocket) {
    return;
  }
  quoteRequestSocket.off(QUOTE_REQUEST_EVENTS.REQUEST_CREATED);
  quoteRequestSocket.off(QUOTE_REQUEST_EVENTS.REQUEST_UPDATED);
};

export function initQuoteRequestSocket(
  options: InitQuoteRequestSocketOptions,
) {
  if (!options.isAuthenticated) {
    teardownQuoteRequestSocket();
    return null;
  }

  const socket = connectSocket({
    ...options.connectOptions,
    namespace: QUOTE_REQUEST_NAMESPACE,
  });
  if (!socket) {
    return null;
  }

  quoteRequestSocket = socket;
  // eslint-disable-next-line no-console
  console.info("[quoteRequestSocket] connected");
  removeRequestListeners();

  if (options.onRequestCreated) {
    quoteRequestSocket.on(
      QUOTE_REQUEST_EVENTS.REQUEST_CREATED,
      options.onRequestCreated,
    );
  }

  if (options.onRequestUpdated) {
    quoteRequestSocket.on(
      QUOTE_REQUEST_EVENTS.REQUEST_UPDATED,
      options.onRequestUpdated,
    );
  }

  return quoteRequestSocket;
}

export function teardownQuoteRequestSocket() {
  removeRequestListeners();
  quoteRequestSocket = null;
  disconnectSocket(QUOTE_REQUEST_NAMESPACE);
  // eslint-disable-next-line no-console
  console.info("[quoteRequestSocket] disconnected");
}

export function getQuoteRequestSocket() {
  return quoteRequestSocket;
}
