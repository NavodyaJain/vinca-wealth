// src/lib/weeklyJournalStore.js
// Handles localStorage CRUD for weekly journal entries, streak, and missed weeks

const KEY = 'vinca_weekly_journal_entries';

function getLocalStorageSafe(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorageSafe(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getWeeklyEntries() {
  return getLocalStorageSafe(KEY, []);
}

export function saveWeeklyEntry(entry) {
  let entries = getWeeklyEntries();
  // Remove any for this week
  entries = entries.filter(e => e.weekStart !== entry.weekStart);
  entries.unshift(entry);
  setLocalStorageSafe(KEY, entries);
}

export function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { weekStart: monday.toISOString(), weekEnd: sunday.toISOString() };
}

export function getWeeklyStreak(entries) {
  // entries must be sorted by weekStart desc
  let streak = 0;
  let lastWeek = null;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!e.status || e.status === 'missed') break;
    if (lastWeek && (new Date(lastWeek) - new Date(e.weekStart)) > 8 * 24 * 60 * 60 * 1000) break;
    streak++;
    lastWeek = e.weekStart;
  }
  return streak;
}

export function getLastCheckin(entries) {
  if (!entries.length) return null;
  const done = entries.find(e => e.status === 'done');
  if (!done) return null;
  return new Date(done.weekEnd).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getLastNWeeksStatus(entries, n = 6) {
  // Returns array of 'done' | 'missed' | 'draft' for last n weeks
  const today = new Date();
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const week = new Date(today);
    week.setDate(today.getDate() - i * 7);
    const { weekStart, weekEnd } = getCurrentWeekRangeForDate(week);
    const entry = entries.find(e => e.weekStart === weekStart);
    result.push(entry ? entry.status : 'missed');
  }
  return result;
}

function getCurrentWeekRangeForDate(date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { weekStart: monday.toISOString(), weekEnd: sunday.toISOString() };
}
