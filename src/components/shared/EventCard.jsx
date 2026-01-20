import React from 'react';

export default function EventCard({ event, registered, onRegister }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="h-32 w-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden mb-2">
        {/* Placeholder image */}
        <img src={event.image || '/event-placeholder.jpg'} alt={event.title} className="object-cover w-full h-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold text-slate-900">{event.title}</div>
        <div className="text-xs text-slate-500">{event.date} • {event.time} • {event.duration}</div>
        <div className="text-xs text-slate-500">Host: {event.host}</div>
      </div>
      <button
        className={`mt-2 w-full h-10 rounded-xl font-semibold text-sm transition-colors ${
          registered
            ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
        onClick={() => !registered && onRegister(event.id)}
        disabled={registered}
      >
        {registered ? 'Registered ✅' : 'Register'}
      </button>
    </div>
  );
}
