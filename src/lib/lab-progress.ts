export const LAB_PROGRESS_STORAGE_KEY = "dailyops-lab-progress-v1";
export const LAB_PROGRESS_EVENT = "dailyops-lab-progress-change";

export interface PathProgress {
  completedSteps: string[];
  updatedAt: number;
}

export type LabProgressStore = Record<string, PathProgress>;

export interface LabProgressStats {
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
  hasStarted: boolean;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LAB_PROGRESS_EVENT));
}

export function readLabProgressStore(): LabProgressStore {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(LAB_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LabProgressStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLabProgressStore(store: LabProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAB_PROGRESS_STORAGE_KEY, JSON.stringify(store));
  dispatchChange();
}

export function getCompletedSteps(pathSlug: string, store?: LabProgressStore): string[] {
  const data = store ?? readLabProgressStore();
  return data[pathSlug]?.completedSteps ?? [];
}

export function isStepComplete(pathSlug: string, stepId: string, store?: LabProgressStore): boolean {
  return getCompletedSteps(pathSlug, store).includes(stepId);
}

export function getLabProgressStats(
  pathSlug: string,
  totalSteps: number,
  store?: LabProgressStore
): LabProgressStats {
  const completed = getCompletedSteps(pathSlug, store).length;
  const percent = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;

  return {
    completed,
    total: totalSteps,
    percent,
    isComplete: totalSteps > 0 && completed >= totalSteps,
    hasStarted: completed > 0,
  };
}

export function toggleLabStep(pathSlug: string, stepId: string): PathProgress {
  const store = readLabProgressStore();
  const current = new Set(store[pathSlug]?.completedSteps ?? []);

  if (current.has(stepId)) {
    current.delete(stepId);
  } else {
    current.add(stepId);
  }

  const next: PathProgress = {
    completedSteps: Array.from(current),
    updatedAt: Date.now(),
  };

  if (next.completedSteps.length === 0) {
    delete store[pathSlug];
  } else {
    store[pathSlug] = next;
  }

  writeLabProgressStore(store);
  return next;
}

export function resetLabPathProgress(pathSlug: string): void {
  const store = readLabProgressStore();
  delete store[pathSlug];
  writeLabProgressStore(store);
}

export function replaceLabProgressStore(store: LabProgressStore): void {
  writeLabProgressStore(store);
}

export function mergeLabProgressStores(
  local: LabProgressStore,
  remote: LabProgressStore
): LabProgressStore {
  const merged: LabProgressStore = { ...local };

  for (const [slug, remotePath] of Object.entries(remote)) {
    const localPath = merged[slug];
    if (!localPath) {
      merged[slug] = remotePath;
      continue;
    }

    const steps = new Set([...localPath.completedSteps, ...remotePath.completedSteps]);
    merged[slug] = {
      completedSteps: Array.from(steps),
      updatedAt: Math.max(localPath.updatedAt, remotePath.updatedAt),
    };
  }

  return merged;
}