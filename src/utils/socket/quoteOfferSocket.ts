"use client";

import { getSocket } from "./index";

export const QUOTE_OFFER_EVENT = "quote:offer";

export type QuoteOfferPayload = Record<string, unknown>;

export type InitQuoteOfferSocketOptions = {
  onOfferReceived?: (payload: QuoteOfferPayload) => void;
};

let quoteOfferListener: ((payload: QuoteOfferPayload) => void) | null = null;

export function initQuoteOfferSocket(
  options: InitQuoteOfferSocketOptions = {}
) {
  const socket = getSocket();
  if (!socket) {
    return null;
  }

  if (quoteOfferListener) {
    socket.off(QUOTE_OFFER_EVENT, quoteOfferListener);
    quoteOfferListener = null;
  }

  quoteOfferListener = (payload: QuoteOfferPayload) => {
    console.info("[quote-offer] event received", payload);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(QUOTE_OFFER_EVENT, { detail: payload })
      );
    }
    options.onOfferReceived?.(payload);
  };

  socket.on(QUOTE_OFFER_EVENT, quoteOfferListener);

  return socket;
}

export function teardownQuoteOfferSocket() {
  const socket = getSocket();
  if (socket && quoteOfferListener) {
    socket.off(QUOTE_OFFER_EVENT, quoteOfferListener);
  }
  quoteOfferListener = null;
}

export function getQuoteOfferSocket() {
  return getSocket();
}
