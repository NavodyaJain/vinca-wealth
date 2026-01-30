// src/utils/dateFormatter.js
// Shared date range formatter for all sprints

export function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  // Ensure start is before end
  if (s > e) return formatDateRange(end, start);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(s)} – ${fmt(e)}`;
}
