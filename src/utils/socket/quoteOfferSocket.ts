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

const removeOfferListeners = () => {
  if (!quoteOfferSocket) {
    return;
  }
  quoteOfferSocket.off(QUOTE_OFFER_EVENTS.OFFER_RECEIVED);
  quoteOfferSocket.off(QUOTE_OFFER_EVENTS.OFFER_UPDATED);
};

export function initQuoteOfferSocket(options: InitQuoteOfferSocketOptions) {
  if (!options.isAuthenticated || !options.connectOptions?.authToken) {
    teardownQuoteOfferSocket();
    return null;
  }

  const socket = connectSocket(options.connectOptions);
  if (!socket) {
    return null;
  }

  quoteOfferSocket = socket;
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
  disconnectSocket();
}

export function getQuoteOfferSocket() {
  return quoteOfferSocket;
}
