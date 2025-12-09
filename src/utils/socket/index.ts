"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const HEARTBEAT_EVENT = "client:heartbeat";
const HEARTBEAT_INTERVAL_MS = 30_000;

let baseSocket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

type ConnectOptions = {
  query?: Record<string, string | undefined>;
};

function startHeartbeat() {
  if (!baseSocket || heartbeatTimer) {
    return;
  }
  heartbeatTimer = setInterval(() => {
    if (baseSocket?.connected) {
      baseSocket.emit(HEARTBEAT_EVENT);
    }
  }, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

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
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10_000,
    timeout: 20_000,
    query: options.query,
  });

  baseSocket.on("connect", () => {
    startHeartbeat();
  });

  baseSocket.on("connect_error", (error) => {
    // eslint-disable-next-line no-console
    console.warn(`[socket] connection error: ${error.message}`);
  });

  baseSocket.on("disconnect", (reason) => {
    stopHeartbeat();
    if (reason === "io server disconnect") {
      baseSocket?.connect();
    }
  });

  return baseSocket;
}

export function disconnectSocket() {
  if (!baseSocket) {
    return;
  }
  stopHeartbeat();
  baseSocket.removeAllListeners();
  baseSocket.disconnect();
  baseSocket = null;
}

export function getSocket() {
  return baseSocket;
}
