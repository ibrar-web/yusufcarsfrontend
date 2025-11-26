"use client";

import { io, type Socket } from "socket.io-client";
import type { UserRole } from "@/utils/api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let lastHeartbeatAck = true;
const HEARTBEAT_INTERVAL = 20000;
const HEARTBEAT_TIMEOUT = 10000;

export type ConnectSocketOptions = {
  role?: UserRole | null;
  authToken?: string;
};

export function connectSocket(options: ConnectSocketOptions = {}) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!SOCKET_URL) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing NEXT_PUBLIC_SOCKET_URL; socket.io client will not initialize."
      );
    }
    return null;
  }

  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    query: {
      role: options.role ?? undefined,
    },
    auth: options.authToken ? { token: options.authToken } : undefined,
  });

  socket.on("connect_error", (error) => {
    // eslint-disable-next-line no-console
    console.warn(`[socket] connection error: ${error.message}`);
  });

  socket.on("pong", () => {
    lastHeartbeatAck = true;
  });

  startHeartbeat();

  return socket;
}

function startHeartbeat() {
  if (!socket) {
    return;
  }

  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }

  heartbeatTimer = setInterval(() => {
    if (!socket) {
      return;
    }

    if (!lastHeartbeatAck) {
      socket.disconnect();
      socket.connect();
      return;
    }

    lastHeartbeatAck = false;
    socket.emit("ping");

    setTimeout(() => {
      if (!lastHeartbeatAck && socket) {
        socket.disconnect();
        socket.connect();
      }
    }, HEARTBEAT_TIMEOUT);
  }, HEARTBEAT_INTERVAL);
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  lastHeartbeatAck = true;
}

export function getSocket() {
  return socket;
}
