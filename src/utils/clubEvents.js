// Example events for clubs
// You can later fetch from API or DB
const clubEvents = [
  {
    id: "event_001",
    clubId: "steady-builders",
    title: "Retirement Readiness AMA: Fix Your Gaps",
    description: "Live Q&A with Vinca community mods. Bring your SIP + retirement age plan.",
    coverImage: "/events/ama1.jpg",
    dateISO: "2026-01-25T19:00:00+05:30",
    durationMins: 60,
    mode: "Online",
    location: "Google Meet",
    seatsTotal: 200,
    seatsTaken: 134
  },
  {
    id: "event_002",
    clubId: "steady-builders",
    title: "Goal Planning Workshop",
    description: "Hands-on session to set your 2026 financial goals with peers.",
    coverImage: "",
    dateISO: "2026-02-10T18:00:00+05:30",
    durationMins: 90,
    mode: "Offline",
    location: "Vinca HQ, Mumbai",
    seatsTotal: 50,
    seatsTaken: 22
  },
  {
    id: "event_003",
    clubId: "wealth-accelerators",
    title: "AMA: Tax Planning for 2026",
    description: "Get your tax questions answered by experts.",
    coverImage: "/events/tax-ama.jpg",
    dateISO: "2026-01-28T20:00:00+05:30",
    durationMins: 60,
    mode: "Online",
    location: "Zoom",
    seatsTotal: 100,
    seatsTaken: 77
  }
];

export default clubEvents;
