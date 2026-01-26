// src/lib/journal/dateUtils.js
// Utility for safe date parsing and formatting

export function safeParse(dateString) {
  if (!dateString) return null;
  // Accept YYYY-MM-DD or ISO
  const d = new Date(dateString);
  return isNaN(d) ? null : d;
}

export function formatWeekRange(weekStart, weekEnd) {
  const start = safeParse(weekStart);
  const end = safeParse(weekEnd);
  if (!start || !end) return "—";
  const opts = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString(undefined, opts)} → ${end.toLocaleDateString(undefined, opts)}`;
}

export function formatMonthYear(dateString) {
  const d = safeParse(dateString);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
