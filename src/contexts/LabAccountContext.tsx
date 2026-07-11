"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  mergeLabProgressStores,
  readLabProgressStore,
  replaceLabProgressStore,
  type LabProgressStore,
} from "@/lib/lab-progress";

export type LabSyncState = "idle" | "syncing" | "synced" | "offline" | "error";

interface LabAccountContextValue {
  configured: boolean;
  authenticated: boolean;
  email: string | null;
  syncState: LabSyncState;
  requestMagicLink: (email: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
  refreshSession: () => Promise<void>;
  queueSync: () => void;
}

const LabAccountContext = createContext<LabAccountContextValue | null>(null);

const SYNC_DEBOUNCE_MS = 900;

export function LabAccountProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [configured, setConfigured] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<LabSyncState>("idle");
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncingRef = useRef(false);

  const applyMergedStore = useCallback((remote: LabProgressStore) => {
    const local = readLabProgressStore();
    const merged = mergeLabProgressStores(local, remote);
    replaceLabProgressStore(merged);
    return merged;
  }, []);

  const pushProgress = useCallback(async () => {
    if (!authenticated || syncingRef.current) return;

    syncingRef.current = true;
    setSyncState("syncing");

    try {
      const res = await fetch("/api/labs/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store: readLabProgressStore() }),
      });

      if (!res.ok) throw new Error("sync failed");

      const data = await res.json();
      if (data.store) {
        replaceLabProgressStore(data.store);
      }
      setSyncState("synced");
    } catch {
      setSyncState("error");
    } finally {
      syncingRef.current = false;
    }
  }, [authenticated]);

  const pullProgress = useCallback(async () => {
    const res = await fetch("/api/labs/progress");
    if (!res.ok) return null;
    const data = await res.json();
    return (data.store ?? {}) as LabProgressStore;
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/labs/auth/session");
      const data = await res.json();
      setConfigured(Boolean(data.configured));
      setAuthenticated(Boolean(data.authenticated));
      setEmail(data.email ?? null);

      if (data.configured && data.authenticated) {
        const remote = await pullProgress();
        if (remote) {
          applyMergedStore(remote);
          setSyncState("synced");
        }
      } else if (!data.configured) {
        setSyncState("offline");
      }
    } catch {
      setSyncState("error");
    }
  }, [applyMergedStore, pullProgress]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const queueSync = useCallback(() => {
    if (!authenticated) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void pushProgress();
    }, SYNC_DEBOUNCE_MS);
  }, [authenticated, pushProgress]);

  const syncNow = useCallback(async () => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    await pushProgress();
  }, [pushProgress]);

  const requestMagicLink = useCallback(
    async (rawEmail: string) => {
      try {
        const res = await fetch("/api/labs/auth/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: rawEmail, lang }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error ?? "Request failed" };
        }
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error" };
      }
    },
    [lang]
  );

  const logout = useCallback(async () => {
    await fetch("/api/labs/auth/session", { method: "DELETE" });
    setAuthenticated(false);
    setEmail(null);
    setSyncState(configured ? "idle" : "offline");
  }, [configured]);

  const value = useMemo(
    () => ({
      configured,
      authenticated,
      email,
      syncState,
      requestMagicLink,
      logout,
      syncNow,
      refreshSession,
      queueSync,
    }),
    [configured, authenticated, email, syncState, requestMagicLink, logout, syncNow, refreshSession, queueSync]
  );

  return <LabAccountContext.Provider value={value}>{children}</LabAccountContext.Provider>;
}

export function useLabAccount() {
  const ctx = useContext(LabAccountContext);
  if (!ctx) {
    throw new Error("useLabAccount must be used within LabAccountProvider");
  }
  return ctx;
}

export function useLabAccountOptional() {
  return useContext(LabAccountContext);
}