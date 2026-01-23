"use client";
import { useState, useMemo, useEffect } from "react";
import { events as EVENTS } from "@/data/investorHub/eventsData";
import { Bell, Search } from 'lucide-react';

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "interested", label: "Interested" },
  { key: "registered", label: "Registered" },
];

function getLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}
function setLocal(key, value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}


export default function EventsPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [interested, setInterested] = useState(() => getLocal("vinca_events_interested", []));
  const [registered, setRegistered] = useState(() => getLocal("vinca_events_registered", []));

  useEffect(() => { setLocal("vinca_events_interested", interested); }, [interested]);
  useEffect(() => { setLocal("vinca_events_registered", registered); }, [registered]);

  const now = new Date();
  const filteredEvents = useMemo(() => {
    let events = EVENTS;
    // Tab filtering
    switch (tab) {
      case "upcoming":
        events = events.filter(e => new Date(e.dateTimeISO) > now);
        break;
      case "past":
        events = events.filter(e => new Date(e.dateTimeISO) < now);
        break;
      case "interested":
        events = events.filter(e => interested.includes(e.id));
        break;
      case "registered":
        events = events.filter(e => registered.includes(e.id));
        break;
      // Removed group tabs
      default:
        break;
    }
    // Search filtering
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.groupId && e.groupId.toLowerCase().includes(q)) ||
        (e.platform && e.platform.toLowerCase().includes(q))
      );
    }
    return events;
  }, [tab, interested, registered, search]);

  const handleInterested = (id) => {
    setInterested((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleRegistered = (id) => {
    setRegistered((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8 py-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl">
        {/* Search bar removed as requested */}
        {/* Tabs: Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all min-w-[110px] focus:outline-none
                ${tab === t.key
                  ? "bg-emerald-600 text-white border-emerald-600 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"}
              `}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Events Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No events found. Try another keyword.</div>
          ) : (
            filteredEvents.map(event => {
              const isPast = new Date(event.dateTimeISO) < now;
              const isInterested = interested.includes(event.id);
              const isRegistered = registered.includes(event.id);
              return (
                <div
                  key={event.id}
                  className={`flex flex-col bg-white border rounded-2xl shadow-sm h-full transition-opacity duration-200 ${isPast ? "opacity-70" : "hover:shadow-md"}`}
                >
                  {/* Banner */}
                  {event.banner ? (
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="w-full h-32 rounded-t-2xl bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-lg">Event</span>
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 flex flex-col p-4 gap-2">
                    <div className="font-bold text-lg text-emerald-800 line-clamp-2">{event.title}</div>
                    <div className="text-slate-600 text-sm line-clamp-2 min-h-[40px]">{event.description}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{new Date(event.dateTimeISO).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      <span>•</span>
                      <span>{event.platform}</span>
                      <span>•</span>
                      <span className="capitalize">{event.groupId.replace('group', 'Group ')}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold transition-all
                          ${isInterested ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-emerald-50"}
                        `}
                        onClick={() => handleInterested(event.id)}
                        disabled={isPast}
                        type="button"
                      >
                        {isInterested ? "Interested ✓" : "Interested"}
                      </button>
                      <button
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold transition-all
                          ${isRegistered ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-emerald-50"}
                          ${isPast ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => !isPast && handleRegistered(event.id)}
                        disabled={isPast}
                        type="button"
                      >
                        {isRegistered ? "Registered" : "Register"}
                      </button>
                    </div>
                    {isPast && (
                      <div className="mt-2 text-xs text-slate-400 text-center">Past</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Hide horizontal scrollbar for category tabs only */}
        <style jsx global>{`
          .no-scrollbar {
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
