// src/lib/readings/vincaReadingsStore.js
export const READINGS_KEY = "vincaUserReadings";

export function getVincaReadings() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(READINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setVincaReadings(partial) {
  if (typeof window === 'undefined') return;
  let current = {};
  try {
    const data = localStorage.getItem(READINGS_KEY);
    if (data) current = JSON.parse(data);
  } catch {}
  const merged = { ...current, ...partial, updatedAt: new Date().toISOString() };
  localStorage.setItem(READINGS_KEY, JSON.stringify(merged));
}

export function clearVincaReadings() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(READINGS_KEY);
}
