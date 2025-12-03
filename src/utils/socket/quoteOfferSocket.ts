"use client";

import { getSocket } from "./index";

export const QUOTE_OFFER_EVENT = "quote:offer";
export const QUOTE_OFFER_ACCEPTED_EVENT = "quote:offer:accept";

export type QuoteOfferPayload = Record<string, unknown>;
export type QuoteOfferAcceptedPayload = Record<string, unknown>;

export type InitQuoteOfferSocketOptions = {
  onOfferReceived?: (payload: QuoteOfferPayload) => void;
};

let quoteOfferListener: ((payload: QuoteOfferPayload) => void) | null = null;
let quoteOfferAcceptedListener:
  | ((payload: QuoteOfferAcceptedPayload) => void)
  | null = null;

export function initQuoteOfferSocket() {
  const socket = getSocket();
  if (!socket) {
    return null;
  }
  if (quoteOfferAcceptedListener) {
    socket.off(QUOTE_OFFER_ACCEPTED_EVENT, quoteOfferAcceptedListener);
    quoteOfferAcceptedListener = null;
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
  };

  socket.on(QUOTE_OFFER_EVENT, quoteOfferListener);
  quoteOfferAcceptedListener = (payload: QuoteOfferAcceptedPayload) => {
    console.info("[quote-offer-accepted] event received", payload);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(QUOTE_OFFER_ACCEPTED_EVENT, { detail: payload })
      );
    }
  };
  socket.on(QUOTE_OFFER_ACCEPTED_EVENT, quoteOfferAcceptedListener);

  return socket;
}

export function teardownQuoteOfferSocket() {
  const socket = getSocket();
  if (socket) {
    if (quoteOfferListener) {
      socket.off(QUOTE_OFFER_EVENT, quoteOfferListener);
    }
    if (quoteOfferAcceptedListener) {
      socket.off(QUOTE_OFFER_ACCEPTED_EVENT, quoteOfferAcceptedListener);
    }
  }
  quoteOfferListener = null;
  quoteOfferAcceptedListener = null;
}

export function getQuoteOfferSocket() {
  return getSocket();
}
