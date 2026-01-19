// Event helpers for filtering, sorting, and formatting

export function filterUpcomingEvents(events, clubId) {
  const now = new Date();
  return (events || [])
    .filter(e => e.clubId === clubId && new Date(e.dateISO) >= now)
    .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));
}

export function formatEventDate(dateISO) {
  const date = new Date(dateISO);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEventTime(dateISO) {
  const date = new Date(dateISO);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).replace(/:00\s/, " ").replace("IST", "IST");
}
