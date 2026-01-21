import React from "react";
import { CheckCircle, Star, Calendar, Clock } from "lucide-react";

const PLATFORM_LABELS = {
  Zoom: "Zoom",
  GoogleMeet: "Google Meet",
  YouTube: "YouTube Live",
  Offline: "In-person"
};

export default function InvestorHubEventCard({ event, isInterested, isRegistered, isPast, onInterested, onRegistered }) {
  return (
    <div
      className={`flex flex-col bg-white border rounded-2xl shadow-sm h-full transition-opacity duration-200 ${
        isPast ? "opacity-60 pointer-events-none" : "hover:shadow-md"
      }`}
    >
      {/* Banner */}
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-32 object-cover rounded-t-2xl"
        />
      ) : (
        <div className="w-full h-32 rounded-t-2xl bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
          <Calendar className="text-green-600" size={32} />
        </div>
      )}
      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-2">
        <div className="font-bold text-lg text-green-800 line-clamp-2">{event.title}</div>
        <div className="text-slate-600 text-sm line-clamp-2 min-h-[40px]">{event.description}</div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <Clock size={14} />
          <span>{formatDate(event.dateTimeISO)} • {formatTime(event.dateTimeISO)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
            {PLATFORM_LABELS[event.platform] || event.platform}
          </span>
          {/* Removed groupId display */}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold transition-all
              ${isInterested ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-slate-200 text-slate-600 hover:bg-green-50"}
            `}
            onClick={onInterested}
            disabled={isPast}
            type="button"
          >
            <Star size={14} className={isInterested ? "text-green-600" : "text-slate-400"} /> Interested
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold transition-all
              ${isRegistered ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-green-50"}
            `}
            onClick={onRegistered}
            disabled={isPast}
            type="button"
          >
            {isRegistered ? <CheckCircle size={14} className="text-white" /> : <CheckCircle size={14} className="text-slate-400" />} Registered
          </button>
        </div>
        {isPast && (
          <div className="mt-2 text-xs text-slate-400 text-center">Event ended</div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
}
