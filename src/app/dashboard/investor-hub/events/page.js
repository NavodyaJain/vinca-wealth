"use client";
import events from '../../../../lib/investorHubEvents';
import groups from '../../../../lib/investorHubGroups';
import { useState } from 'react';

export default function EventsPage() {
  return (
    <div>
      <div className="mb-4 text-green-700 font-medium">All Upcoming Events</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const [registered, setRegistered] = useState(false);
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col shadow-sm">
      <img src={event.imageUrl} alt={event.title} className="rounded-xl w-full h-32 object-cover mb-4" />
      <h3 className="font-bold text-lg text-green-800 mb-1">{event.title}</h3>
      <div className="text-gray-600 mb-2">{event.description}</div>
      <div className="text-xs text-gray-400 mb-4">{event.dateLabel}</div>
      {registered ? (
        <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold text-center">Registered ✅</div>
      ) : (
        <button onClick={() => setRegistered(true)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700">Register</button>
      )}
    </div>
  );
}
