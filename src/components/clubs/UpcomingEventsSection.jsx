import React from "react";
import PropTypes from "prop-types";
import EventCard from "./EventCard";

function UpcomingEventsSection({ clubId, events, registeredMap, onRegister, onCancel, loading }) {
  // Filter: only events for this club, future events
  const now = new Date();
  const filtered = (events || [])
    .filter(e => e.clubId === clubId && new Date(e.dateISO) >= now)
    .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));

  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl shadow border border-slate-200 px-6 py-5 mb-2">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <p className="text-gray-500 text-sm">Workshops, AMA sessions, and planning meetups for this club</p>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="animate-pulse flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="sm:w-48 w-full h-40 sm:h-auto bg-gray-200" />
              <div className="flex-1 p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded w-1/4 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center">
          <span className="text-4xl mb-2">🎉</span>
          <div className="font-semibold text-lg mb-1">No upcoming events yet</div>
          <div className="text-gray-500 text-sm">New sessions will appear here soon.</div>
        </div>
      ) : (
        <div className="flex flex-row gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {filtered.map(event => (
            <div className="min-w-[320px] max-w-[340px] w-full flex-shrink-0" key={event.id}>
              <EventCard
                event={event}
                isRegistered={!!registeredMap[event.id]}
                onRegister={onRegister}
                onCancel={onCancel}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

UpcomingEventsSection.propTypes = {
  clubId: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  registeredMap: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default UpcomingEventsSection;
