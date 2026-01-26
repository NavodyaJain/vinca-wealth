// src/lib/journal/journalStorage.js
// Journal entry storage for Vinca Wealth

const ENTRIES_KEY = 'vinca_journal_entries';
const DRAFT_KEY = 'vinca_journal_draft';

function generateId() {
  return (
    'jrnl_' +
    Date.now().toString(36) +
    '_' +
    Math.random().toString(36).slice(2, 8)
  );
}

function getAllJournalEntries() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) throw new Error('Invalid');
    return arr;
  } catch {
    localStorage.removeItem(ENTRIES_KEY);
    return [];
  }
}

function getJournalEntryById(entryId) {
  return getAllJournalEntries().find(e => e.id === entryId) || null;
}

function saveJournalEntry(entry) {
  if (!entry || !entry.id) return null;
  const entries = getAllJournalEntries().filter(e => e.id !== entry.id);
  const saved = { ...entry, isDraft: false };
  entries.unshift(saved);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  clearDraftEntry();
  return saved;
}

function createJournalEntry(entryData) {
  const entry = {
    id: generateId(),
    createdAtISO: new Date().toISOString(),
    title: entryData.title || '',
    tags: Array.isArray(entryData.tags) ? entryData.tags : [],
    actions: Array.isArray(entryData.actions) ? entryData.actions : [],
    reflectionPrompt: entryData.reflectionPrompt || '',
    reflectionText: entryData.reflectionText || '',
    mood: entryData.mood || null,
    confidenceScore: entryData.confidenceScore || null,
    nextStep: entryData.nextStep || '',
    isDraft: false
  };
  return saveJournalEntry(entry);
}

function deleteJournalEntry(entryId) {
  const entries = getAllJournalEntries().filter(e => e.id !== entryId);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

function saveDraftEntry(draftData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draftData, isDraft: true }));
}

// Alias for compatibility
const createDraftEntry = saveDraftEntry;

function getDraftEntry() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

function clearDraftEntry() {
  localStorage.removeItem(DRAFT_KEY);
}

export {
  getAllJournalEntries,
  getJournalEntryById,
  saveJournalEntry,
  createJournalEntry,
  deleteJournalEntry,
  saveDraftEntry,
  createDraftEntry,
  getDraftEntry,
  clearDraftEntry
};
