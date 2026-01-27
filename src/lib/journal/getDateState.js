// Pure utility to derive CalendarDateState for a given date, commitments, and entries
// Types:
// CalendarDateState = "idle" | "sip_due" | "approaching" | "executed" | "missed"
// ExecutionEntry: { date: string, status: "executed" | "partial" | "missed" }
// ChallengeCommitment: { type: "monthly" | "quarterly" | "annual", executionDates: string[] }

/**
 * @param {string} date - YYYY-MM-DD
 * @param {ChallengeCommitment[]} commitments
 * @param {ExecutionEntry[]} entries
 * @param {string} today - YYYY-MM-DD (for deterministic testing)
 * @returns {"idle" | "sip_due" | "approaching" | "executed" | "missed"}
 */
export function getDateState(date, commitments, entries, today) {
  // Check if executed
  const entry = entries.find(e => e.date === date && (e.status === "executed" || e.status === "partial"));
  if (entry) return "executed";

  // Is this a SIP due date from any challenge?
  const due = commitments.some(c => c.executionDates.includes(date));
  if (!due) return "idle";

  // Find the due date(s) for this date
  // For each commitment, check if this date is a due date
  // If so, check if it's missed or approaching
  const dateObj = new Date(date);
  const todayObj = new Date(today);
  const diffDays = Math.floor((dateObj - todayObj) / (1000 * 60 * 60 * 24));

  // Missed: Today > dueDate + 3 days AND not executed
  if (diffDays < -3) return "missed";

  // Approaching: Today ∈ [dueDate - 3 days, dueDate + 3 days]
  if (Math.abs(diffDays) <= 3) return "approaching";

  // SIP Due: exact due date, not executed
  if (diffDays === 0) return "sip_due";

  // Default: idle
  return "idle";
}
