"use client";
// ...existing code...
import { useState, useMemo } from "react";
import InvestorHubEventsTabs from "@/components/investorHub/InvestorHubEventsTabs";
import InvestorHubEventCard from "@/components/investorHub/InvestorHubEventCard";
import { useInvestorHubEventsState } from "@/hooks/useInvestorHubEventsState";
import events from "@/lib/investorHubEvents";

const GROUP_IDS = ["group1", "group2", "group3"];

export default function EventsPage() {
  const [tab, setTab] = useState("all");
  const {
    interestedEventIds,
    registeredEventIds,
    toggleInterested,
    toggleRegistered,
    hydrated,
  } = useInvestorHubEventsState();

  const now = new Date();
  const filteredEvents = useMemo(() => {
    if (!hydrated) return [];
    switch (tab) {
      case "recent":
        return events.filter(e => new Date(e.dateTimeISO) > now && new Date(e.dateTimeISO) < addDays(now, 30));
      case "past":
        return events.filter(e => new Date(e.dateTimeISO) < now);
      case "group":
        return events.filter(e => GROUP_IDS.includes(e.groupId));
      case "interested":
        return events.filter(e => interestedEventIds.includes(e.id));
      case "registered":
        return events.filter(e => registeredEventIds.includes(e.id));
      default:
        return events;
    }
  }, [tab, events, interestedEventIds, registeredEventIds, hydrated]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">Investor Hub Events</h1>
        <p className="text-slate-600 text-sm">Explore live sessions, group discussions, AMAs, and retirement planning workshops.</p>
      </div>
      <InvestorHubEventsTabs activeTab={tab} onTabChange={setTab} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center text-slate-400 py-12">No events found for this filter.</div>
        )}
        {filteredEvents.map(event => {
          const isPast = new Date(event.dateTimeISO) < now;
          // Remove groupId display from event card
          return (
            <InvestorHubEventCard
              key={event.id}
              event={{ ...event, groupId: undefined }} // Remove groupId for display
              isInterested={interestedEventIds.includes(event.id)}
              isRegistered={registeredEventIds.includes(event.id)}
              isPast={isPast}
              onInterested={() => toggleInterested(event.id)}
              onRegistered={() => toggleRegistered(event.id)}
            />
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
