// src/lib/journal/journalStreakStorage.js
// Journal streak logic for Vinca Wealth

const STREAK_KEY = 'vinca_journal_streak';

function getJournalStreak() {
  if (typeof window === 'undefined') return { streakCount: 0, lastSavedDateISO: null };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { streakCount: 0, lastSavedDateISO: null };
  } catch {
    localStorage.removeItem(STREAK_KEY);
    return { streakCount: 0, lastSavedDateISO: null };
  }
}

function updateJournalStreakOnSave() {
  const today = new Date().toISOString().slice(0, 10);
  const streak = getJournalStreak();
  if (!streak.lastSavedDateISO) {
    streak.streakCount = 1;
  } else {
    const last = streak.lastSavedDateISO;
    const diff = (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak.streakCount += 1;
    } else if (diff > 1) {
      streak.streakCount = 1;
    }
    // If same day, do not increment
  }
  streak.lastSavedDateISO = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak.streakCount;
}

export { getJournalStreak, updateJournalStreakOnSave };
