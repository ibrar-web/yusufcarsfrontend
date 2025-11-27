"use client";

import { io, type Socket } from "socket.io-client";
import type { UserRole } from "@/utils/api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const DEFAULT_NAMESPACE = "/";
const HEARTBEAT_INTERVAL = 20000;
const HEARTBEAT_TIMEOUT = 10000;

export type ConnectSocketOptions = {
  role?: UserRole | null;
  authToken?: string;
  namespace?: string;
};

type SocketEntry = {
  socket: Socket;
  heartbeatTimer: ReturnType<typeof setInterval> | null;
  lastHeartbeatAck: boolean;
};

const socketRegistry = new Map<string, SocketEntry>();

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

  const namespace = normalizeNamespace(options.namespace);
  const existingEntry = socketRegistry.get(namespace);
  if (existingEntry) {
    return existingEntry.socket;
  }

  const socket = io(buildNamespaceUrl(namespace), {
    transports: ["websocket"],
    autoConnect: true,
    withCredentials: true,
    query: {
      role: options.role ?? undefined,
    },
    auth: options.authToken ? { token: options.authToken } : undefined,
  });

  const entry: SocketEntry = {
    socket,
    heartbeatTimer: null,
    lastHeartbeatAck: true,
  };
  socketRegistry.set(namespace, entry);

  socket.on("connect_error", (error) => {
    // eslint-disable-next-line no-console
    console.warn(`[socket${namespace}] connection error: ${error.message}`);
  });

  socket.on("pong", () => {
    entry.lastHeartbeatAck = true;
  });

  startHeartbeat(entry);

  return entry.socket;
}

function normalizeNamespace(namespace?: string | null) {
  if (!namespace || namespace === "/" || namespace === "") {
    return DEFAULT_NAMESPACE;
  }
  return namespace.startsWith("/") ? namespace : `/${namespace}`;
}

function buildNamespaceUrl(namespace: string) {
  if (namespace === DEFAULT_NAMESPACE) {
    return SOCKET_URL!;
  }
  return `${SOCKET_URL}${namespace}`;
}

function startHeartbeat(entry: SocketEntry) {
  if (entry.heartbeatTimer) {
    clearInterval(entry.heartbeatTimer);
  }

  entry.heartbeatTimer = setInterval(() => {
    if (!entry.socket) {
      return;
    }

    if (!entry.lastHeartbeatAck) {
      entry.socket.disconnect();
      entry.socket.connect();
      return;
    }

    entry.lastHeartbeatAck = false;
    entry.socket.emit("ping");

    setTimeout(() => {
      if (!entry.lastHeartbeatAck) {
        entry.socket.disconnect();
        entry.socket.connect();
      }
    }, HEARTBEAT_TIMEOUT);
  }, HEARTBEAT_INTERVAL);
}

function cleanupEntry(namespace: string) {
  const entry = socketRegistry.get(namespace);
  if (!entry) {
    return;
  }

  entry.socket.removeAllListeners();
  entry.socket.disconnect();
  if (entry.heartbeatTimer) {
    clearInterval(entry.heartbeatTimer);
  }
  socketRegistry.delete(namespace);
}

export function disconnectSocket(namespace?: string) {
  if (namespace) {
    cleanupEntry(normalizeNamespace(namespace));
    return;
  }

  for (const ns of socketRegistry.keys()) {
    cleanupEntry(ns);
  }
}

export function getSocket(namespace?: string) {
  const key = normalizeNamespace(namespace);
  return socketRegistry.get(key)?.socket ?? null;
}
