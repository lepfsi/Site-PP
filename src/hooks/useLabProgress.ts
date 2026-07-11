"use client";

import { useCallback, useEffect, useState } from "react";
import { useLabAccountOptional } from "@/contexts/LabAccountContext";
import {
  getLabProgressStats,
  isStepComplete,
  readLabProgressStore,
  resetLabPathProgress,
  toggleLabStep,
  LAB_PROGRESS_EVENT,
  type LabProgressStats,
  type LabProgressStore,
} from "@/lib/lab-progress";

export function useLabProgress() {
  const account = useLabAccountOptional();
  const [store, setStore] = useState<LabProgressStore>({});
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setStore(readLabProgressStore());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const onChange = () => refresh();
    window.addEventListener(LAB_PROGRESS_EVENT, onChange);
    window.addEventListener("storage", onChange);

    return () => {
      window.removeEventListener(LAB_PROGRESS_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const getStats = useCallback(
    (pathSlug: string, totalSteps: number): LabProgressStats =>
      getLabProgressStats(pathSlug, totalSteps, store),
    [store]
  );

  const stepDone = useCallback(
    (pathSlug: string, stepId: string) => isStepComplete(pathSlug, stepId, store),
    [store]
  );

  const toggleStep = useCallback((pathSlug: string, stepId: string) => {
    toggleLabStep(pathSlug, stepId);
    refresh();
    account?.queueSync();
  }, [refresh, account]);

  const resetPath = useCallback((pathSlug: string) => {
    resetLabPathProgress(pathSlug);
    refresh();
    account?.queueSync();
  }, [refresh, account]);

  return {
    hydrated,
    store,
    getStats,
    stepDone,
    toggleStep,
    resetPath,
    syncState: account?.syncState ?? "idle",
    authenticated: account?.authenticated ?? false,
  };
}