"use client";

import { getSocket } from "./index";

export const QUOTE_REQUEST_EVENT = "quote:request";

export type QuoteRequestPayload = Record<string, unknown>;

export type InitQuoteRequestSocketOptions = {
  onRequestReceived?: (payload: QuoteRequestPayload) => void;
};

let quoteRequestListener: ((payload: QuoteRequestPayload) => void) | null =
  null;

export function initQuoteRequestSocket(
  options: InitQuoteRequestSocketOptions = {}
) {
  const socket = getSocket();
  if (!socket) {
    return null;
  }

  if (quoteRequestListener) {
    socket.off(QUOTE_REQUEST_EVENT, quoteRequestListener);
    quoteRequestListener = null;
  }

  quoteRequestListener = (payload: QuoteRequestPayload) => {
    console.info("[quote-request] event received", payload);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(QUOTE_REQUEST_EVENT, { detail: payload })
      );
    }
    options.onRequestReceived?.(payload);
  };

  socket.on(QUOTE_REQUEST_EVENT, quoteRequestListener);

  return socket;
}

export function teardownQuoteRequestSocket() {
  const socket = getSocket();
  if (socket && quoteRequestListener) {
    socket.off(QUOTE_REQUEST_EVENT, quoteRequestListener);
  }
  quoteRequestListener = null;
}

export function getQuoteRequestSocket() {
  return getSocket();
}
