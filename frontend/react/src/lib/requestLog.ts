/**
 * Tiny module-level pub/sub used to visibly demonstrate the REST-vs-GraphQL
 * "N requests" difference (Requirements.md section 19). Both the REST axios
 * client and the GraphQL Apollo link push entries here; consumers subscribe
 * via useRequestLog() (useSyncExternalStore).
 */
import { useSyncExternalStore } from 'react';

export interface RequestLogEntry {
  id: number;
  mode: 'rest' | 'graphql';
  method: string;
  target: string;
  timestamp: number;
}

let entries: RequestLogEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function logRequest(mode: 'rest' | 'graphql', method: string, target: string) {
  entries = [...entries, { id: nextId++, mode, method, target, timestamp: Date.now() }];
  notify();
}

export function clearRequestLog() {
  entries = [];
  notify();
}

export function getRequestLog(): RequestLogEntry[] {
  return entries;
}

export function subscribeRequestLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRequestLog(): RequestLogEntry[] {
  return useSyncExternalStore(subscribeRequestLog, getRequestLog);
}
