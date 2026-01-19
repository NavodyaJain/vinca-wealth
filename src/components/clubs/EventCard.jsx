import React from "react";
import PropTypes from "prop-types";

// Utility for date formatting
function formatEventDate(dateISO) {
  const date = new Date(dateISO);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(dateISO) {
  const date = new Date(dateISO);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).replace(/:00\s/, " ").replace("IST", "IST");
}

const fallbackGradients = [
  "from-blue-200 to-blue-400",
  "from-green-200 to-green-400",
  "from-purple-200 to-purple-400",
  "from-pink-200 to-pink-400",
];

function EventCard({ event, isRegistered, onRegister, onCancel }) {
  const {
    title,
    description,
    coverImage,
    dateISO,
    mode,
    seatsTotal,
    seatsTaken,
    clubId,
    location,
  } = event;
  const date = formatEventDate(dateISO);
  const time = formatEventTime(dateISO);
  const modeColor = mode === "Online" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700";
  const fallbackIdx = (title?.charCodeAt(0) || 0) % fallbackGradients.length;

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden mb-0 transition-transform hover:scale-[1.02] w-full">
      {/* Cover Image or Fallback */}
      {/* Blueish banner with icon (no image) */}
      <div className="w-full h-28 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-2xl flex items-center justify-center">
        <span className="text-white text-4xl opacity-90">📅</span>
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg truncate flex-1" title={title}>{title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{date}</span>
          <span>•</span>
          <span>{time}</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${modeColor}`}>{mode}</span>
          {location && <span>• {location}</span>}
        </div>
        <div className="text-gray-700 text-sm line-clamp-2 mb-2">{description}</div>
        {typeof seatsTaken === "number" && typeof seatsTotal === "number" && (
          <div className="text-xs text-gray-400 mb-2">{seatsTaken}/{seatsTotal} seats filled</div>
        )}
        <div className="mt-auto flex items-center gap-2">
          {!isRegistered ? (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
              onClick={() => onRegister(event.id)}
            >
              Register
            </button>
          ) : (
            <>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Registered</span>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl border border-gray-300 transition-colors"
                onClick={() => onCancel(event.id)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  isRegistered: PropTypes.bool,
  onRegister: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EventCard;
