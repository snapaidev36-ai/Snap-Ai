import type { GenerationRecoveryRecord } from './types';

const STORAGE_KEY = 'snap-ai.dashboard.prompt-composer.generation';

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readGenerationRecoveryRecord() {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as GenerationRecoveryRecord;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writeGenerationRecoveryRecord(
  record: GenerationRecoveryRecord,
) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function clearGenerationRecoveryRecord() {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
}
