"use client";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "./index";
import type { ConnectSocketOptions } from "./index";

export const QUOTE_OFFER_EVENTS = {
  OFFER_RECEIVED: "quote:offer:received",
  OFFER_UPDATED: "quote:offer:updated",
} as const;

export type QuoteOfferEventPayload = Record<string, unknown>;

export type InitQuoteOfferSocketOptions = {
  isAuthenticated: boolean;
  connectOptions: ConnectSocketOptions;
  onOfferReceived?: (payload: QuoteOfferEventPayload) => void;
  onOfferUpdated?: (payload: QuoteOfferEventPayload) => void;
};

let quoteOfferSocket: Socket | null = null;
const QUOTE_OFFER_NAMESPACE =
  process.env.NEXT_PUBLIC_QUOTE_OFFER_SOCKET_NAMESPACE ?? "/quote-offers";

const removeOfferListeners = () => {
  if (!quoteOfferSocket) {
    return;
  }
  quoteOfferSocket.off(QUOTE_OFFER_EVENTS.OFFER_RECEIVED);
  quoteOfferSocket.off(QUOTE_OFFER_EVENTS.OFFER_UPDATED);
};

export function initQuoteOfferSocket(options: InitQuoteOfferSocketOptions) {
  if (!options.isAuthenticated) {
    teardownQuoteOfferSocket();
    return null;
  }

  const socket = connectSocket({
    ...options.connectOptions,
    namespace: QUOTE_OFFER_NAMESPACE,
  });
  if (!socket) {
    return null;
  }

  quoteOfferSocket = socket;
  // eslint-disable-next-line no-console
  console.info("[quoteOfferSocket] connected");
  removeOfferListeners();

  if (options.onOfferReceived) {
    quoteOfferSocket.on(
      QUOTE_OFFER_EVENTS.OFFER_RECEIVED,
      options.onOfferReceived,
    );
  }

  if (options.onOfferUpdated) {
    quoteOfferSocket.on(
      QUOTE_OFFER_EVENTS.OFFER_UPDATED,
      options.onOfferUpdated,
    );
  }

  return quoteOfferSocket;
}

export function teardownQuoteOfferSocket() {
  removeOfferListeners();
  quoteOfferSocket = null;
  disconnectSocket(QUOTE_OFFER_NAMESPACE);
  // eslint-disable-next-line no-console
  console.info("[quoteOfferSocket] disconnected");
}

export function getQuoteOfferSocket() {
  return quoteOfferSocket;
}
