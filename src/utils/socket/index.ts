"use client";

import { io, type Socket } from "socket.io-client";
import type { UserRole } from "@/utils/api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket: Socket | null = null;

type ConnectSocketOptions = {
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

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
