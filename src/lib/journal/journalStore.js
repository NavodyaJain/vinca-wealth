// src/lib/journal/journalStore.js
const JOURNAL_KEY = "vinca_journal_entries_v1";

export function getJournalEntries() {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveJournalEntries(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export function addJournalEntry(entry) {
  const entries = getJournalEntries();
  // If entry has no phase, try to map it (for tool-generated entries)
  if (!entry.phase && typeof window !== 'undefined') {
    try {
      const { mapEntryToPhase } = require('@/lib/retirementPhaseTracker');
      entry.phase = mapEntryToPhase(entry) || 'foundation';
    } catch {}
  }
  if (!entries.find(e => e.id === entry.id)) {
    entries.unshift(entry);
    saveJournalEntries(entries);
  }
}

export function hasChallengeCompletionEntry(challengeId) {
  const entries = getJournalEntries();
  return entries.some(e => e.type === 'challenge_completion' && e.meta && e.meta.challengeId === challengeId);
}

export function createChallengeCompletionEntry({ challenge, phase }) {
  return {
    id: `jrnl_${challenge.id}_${Date.now()}`,
    type: "challenge_completion",
    createdAt: new Date().toISOString(),
    title: `Completed: ${challenge.title}`,
    summary: "Challenge completed successfully.",
    tags: ["Challenge", challenge.cadence],
    actions: Array.isArray(challenge.tasks) ? challenge.tasks.map(t => ({ label: t.title, verified: true })) : [],
    meta: { challengeId: challenge.id },
    phase: phase || 'foundation'
  };
}
