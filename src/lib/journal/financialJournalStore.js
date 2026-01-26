// src/lib/journal/financialJournalStore.js
// LocalStorage CRUD for journal entries and monthly summaries

const ENTRY_KEY = 'vinca_financial_journal_entries';
const MONTHLY_KEY = 'vinca_financial_journal_monthly';

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

export function getJournalEntries() {
  return getLocalStorageSafe(ENTRY_KEY, []);
}

export function saveJournalEntry(entry) {
  // entry must have weekStart, weekEnd (YYYY-MM-DD)
  let entries = getJournalEntries();
  entries = entries.filter(e => e.weekStart !== entry.weekStart);
  entries.unshift(entry);
  setLocalStorageSafe(ENTRY_KEY, entries);
}

export function getMonthlySummaries() {
  return getLocalStorageSafe(MONTHLY_KEY, []);
}

export function saveMonthlySummary(summary) {
  let summaries = getMonthlySummaries();
  summaries = summaries.filter(s => s.month !== summary.month);
  summaries.unshift(summary);
  setLocalStorageSafe(MONTHLY_KEY, summaries);
}
