// src/lib/challenges/challengesStorage.js
// Challenge state and progress for Vinca Wealth

const STORAGE_KEY = 'vinca_active_challenge';

function getStored() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveStored(obj) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export function getActiveChallenge() {
  return getStored();
}

export function startChallenge(challengeId, durationDays) {
  const now = new Date().toISOString();
  const obj = {
    challengeId,
    startedAtISO: now,
    currentDay: 1,
    completedDays: [],
    tasksCompletedByDay: {},
    finishedAtISO: null
  };
  saveStored(obj);
  return obj;
}

export function stopChallenge() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function completeTask(challengeId, dayNumber, taskId) {
  const data = getStored();
  if (!data || data.challengeId !== challengeId) return;
  const dayKey = String(dayNumber);
  if (!data.tasksCompletedByDay[dayKey]) data.tasksCompletedByDay[dayKey] = [];
  if (!data.tasksCompletedByDay[dayKey].includes(taskId)) {
    data.tasksCompletedByDay[dayKey].push(taskId);
  }
  saveStored(data);
}

export function uncompleteTask(challengeId, dayNumber, taskId) {
  const data = getStored();
  if (!data || data.challengeId !== challengeId) return;
  const dayKey = String(dayNumber);
  if (!data.tasksCompletedByDay[dayKey]) return;
  data.tasksCompletedByDay[dayKey] = data.tasksCompletedByDay[dayKey].filter((id) => id !== taskId);
  saveStored(data);
}

export function completeDay(challengeId, dayNumber, nonOptionalTaskIds, durationDays) {
  const data = getStored();
  if (!data || data.challengeId !== challengeId) return;
  const dayKey = String(dayNumber);
  // Only complete if all non-optional tasks are done
  const completed = data.tasksCompletedByDay[dayKey] || [];
  const allDone = nonOptionalTaskIds.every((id) => completed.includes(id));
  if (!allDone) return;
  if (!data.completedDays.includes(dayNumber)) data.completedDays.push(dayNumber);
  // Advance day or finish
  if (dayNumber < durationDays) {
    data.currentDay = dayNumber + 1;
  } else {
    data.finishedAtISO = new Date().toISOString();
    data.currentDay = durationDays;
  }
  saveStored(data);
}

export function getChallengeProgress(challengeId) {
  const data = getStored();
  if (!data || data.challengeId !== challengeId) return null;
  return {
    currentDay: data.currentDay,
    completedDays: data.completedDays,
    tasksCompletedByDay: data.tasksCompletedByDay,
    finishedAtISO: data.finishedAtISO,
    startedAtISO: data.startedAtISO
  };
}
