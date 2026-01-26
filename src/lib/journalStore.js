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

export function createJournalEntry(entry) {
  const entries = getJournalEntries();
  const updated = [entry, ...entries];
  saveJournalEntries(updated);
  return updated;
}

export function createChallengeCompletionEntry({ challenge, challengeId }) {
  const now = new Date();
  return {
    id: `jrnl_${challengeId}_${now.getTime()}`,
    type: "challenge_completion",
    createdAt: now.toISOString(),
    title: `Completed: ${challenge.title}`,
    summary: `Challenge completed successfully. Logged from your retirement dashboard.`,
    tags: ["Challenge", "Retirement", "Discipline"],
    actions: [
      { label: "Challenge completed", value: challenge.title, verified: true }
    ],
    reflectionPrompt: "What did you learn from this challenge?",
    reflectionText: "",
    meta: {
      challengeId: String(challengeId),
      cadence: challenge.cadence || null
    }
  };
}
