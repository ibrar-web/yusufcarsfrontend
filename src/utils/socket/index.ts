"use client";

import { io, type Socket } from "socket.io-client";
import { environment } from "@/utils/environment";

const SOCKET_URL = environment.socketUrl;
const HEARTBEAT_EVENT = "client:heartbeat";
const HEARTBEAT_INTERVAL_MS = 30_000;

let baseSocket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

type ConnectOptions = {
  query?: Record<string, string | undefined>;
};

function startHeartbeat() {
  stopHeartbeat(); // ensure no duplicate timers

  if (!baseSocket) return;

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
  if (typeof window === "undefined") return null;

  if (!SOCKET_URL) {
    console.warn("Missing NEXT_PUBLIC_SOCKET_URL");
    return null;
  }

  if (baseSocket) return baseSocket;

  baseSocket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10_000,
    timeout: 20_000,
    query: options.query,
  });

  // main connect
  baseSocket.on("connect", () => {
    startHeartbeat();
  });

  // handle reconnects
  baseSocket.io.on("reconnect", () => {
    startHeartbeat();
  });

  baseSocket.io.on("reconnect_attempt", () => {
    stopHeartbeat();
  });

  baseSocket.io.on("reconnect_failed", () => {
    stopHeartbeat();
    baseSocket?.disconnect();
    baseSocket = null;
    connectSocket(options);
  });

  // connection errors
  baseSocket.on("connect_error", (error) => {
    console.warn("[socket] error:", error.message);
  });

  // handle disconnect
  baseSocket.on("disconnect", (reason) => {
    stopHeartbeat();
    if (reason === "io server disconnect" || reason === "transport close") {
      setTimeout(() => {
        if (!baseSocket?.connected) {
          baseSocket?.connect();
        }
      }, 1000);
    }
  });

  return baseSocket;
}

export function disconnectSocket() {
  if (!baseSocket) return;

  stopHeartbeat();
  baseSocket.removeAllListeners();
  baseSocket.disconnect();
  baseSocket = null;
}

export function getSocket() {
  return baseSocket;
}
