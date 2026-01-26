// src/lib/challenges/streakStorage.js
// Streak logic for Vinca Wealth challenges

const STREAK_KEY = 'vinca_streak';

function getStored() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(STREAK_KEY);
    return null;
  }
}

function saveStored(obj) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STREAK_KEY, JSON.stringify(obj));
}

export function getStreak() {
  return getStored() || { streakCount: 0, lastCompletedDateISO: null };
}

export function updateStreakOnDayComplete() {
  const today = new Date().toISOString().slice(0, 10);
  const streak = getStored() || { streakCount: 0, lastCompletedDateISO: null };
  if (!streak.lastCompletedDateISO) {
    streak.streakCount = 1;
  } else {
    const last = streak.lastCompletedDateISO.slice(0, 10);
    const diff = (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak.streakCount += 1;
    } else if (diff > 1) {
      streak.streakCount = 1;
    }
    // If same day, do not increment
  }
  streak.lastCompletedDateISO = today;
  saveStored(streak);
  return streak.streakCount;
}
