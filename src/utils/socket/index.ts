"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let baseSocket: Socket | null = null;

type ConnectOptions = {
  query?: Record<string, string | undefined>;
};

export function connectSocket(options: ConnectOptions = {}) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!SOCKET_URL) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing NEXT_PUBLIC_SOCKET_URL; socket.io client will not initialize.",
      );
    }
    return null;
  }

  if (baseSocket) {
    return baseSocket;
  }

  baseSocket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    withCredentials: false,
    query: options.query,
  });

  baseSocket.on("connect_error", (error) => {
    // eslint-disable-next-line no-console
    console.warn(`[socket] connection error: ${error.message}`);
  });

  return baseSocket;
}

export function disconnectSocket() {
  if (!baseSocket) {
    return;
  }
  baseSocket.removeAllListeners();
  baseSocket.disconnect();
  baseSocket = null;
}

export function getSocket() {
  return baseSocket;
}

