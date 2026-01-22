"use client";
import { useState, useMemo, useEffect } from "react";
import { events as EVENTS } from "@/data/investorHub/eventsData";

const TABS = [
  { key: "all", label: "All Events" },
  { key: "recent", label: "Recent Events" },
  { key: "past", label: "Past Events" },
  { key: "interested", label: "Interested" },
  { key: "registered", label: "Registered" },
  { key: "group1", label: "Group 1" },
  { key: "group2", label: "Group 2" },
  { key: "group3", label: "Group 3" },
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
  const [interested, setInterested] = useState(() => getLocal("vinca_events_interested", []));
  const [registered, setRegistered] = useState(() => getLocal("vinca_events_registered", []));

  useEffect(() => { setLocal("vinca_events_interested", interested); }, [interested]);
  useEffect(() => { setLocal("vinca_events_registered", registered); }, [registered]);

  const now = new Date();
  const filteredEvents = useMemo(() => {
    switch (tab) {
      case "recent":
        return EVENTS.filter(e => new Date(e.dateTimeISO) > now && new Date(e.dateTimeISO) < addDays(now, 30));
      case "past":
        return EVENTS.filter(e => new Date(e.dateTimeISO) < now);
      case "interested":
        return EVENTS.filter(e => interested.includes(e.id));
      case "registered":
        return EVENTS.filter(e => registered.includes(e.id));
      case "group1":
      case "group2":
      case "group3":
        return EVENTS.filter(e => e.groupId === tab);
      default:
        return EVENTS;
    }
  }, [tab, interested, registered]);

  const handleInterested = (id) => {
    setInterested((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleRegistered = (id) => {
    setRegistered((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-lg md:text-2xl font-bold text-emerald-900 mb-6">Events</h1>
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-150 whitespace-nowrap ${tab === t.key ? 'border-emerald-600 text-emerald-800 bg-emerald-50' : 'border-transparent text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-400 py-12">No events found for this filter.</div>
        )}
        {filteredEvents.map(event => {
          const isPast = new Date(event.dateTimeISO) < now;
          return (
            <div key={event.id} className={`flex flex-col md:flex-row bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-hidden border ${isPast ? 'opacity-60' : ''}`}>
              <img src={event.banner} alt={event.title} className="w-full md:w-56 h-40 md:h-auto object-cover rounded-xl md:rounded-none md:rounded-l-xl" />
              <div className="flex-1 flex flex-col p-4 gap-2">
                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                  <span>{new Date(event.dateTimeISO).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <span>•</span>
                  <span>{event.platform}</span>
                  <span>•</span>
                  <span className="capitalize">{event.groupId.replace('group', 'Group ')}</span>
                </div>
                <div className="font-semibold text-lg text-emerald-800">{event.title}</div>
                <div className="text-gray-700 text-sm mb-2">{event.description}</div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className={`px-4 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs ${interested.includes(event.id) ? 'bg-emerald-100 border-emerald-400' : ''}`}
                    onClick={() => handleInterested(event.id)}
                  >
                    {interested.includes(event.id) ? 'Interested ✓' : 'Interested'}
                  </button>
                  <button
                    className={`px-4 py-1 rounded bg-emerald-600 text-white font-semibold text-xs ${isPast ? 'opacity-50 cursor-not-allowed' : ''} ${registered.includes(event.id) ? 'bg-emerald-800' : ''}`}
                    onClick={() => !isPast && handleRegistered(event.id)}
                    disabled={isPast}
                  >
                    {registered.includes(event.id) ? 'Registered' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
