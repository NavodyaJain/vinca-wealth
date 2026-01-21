import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import useGroupDiscussionState from "../../../hooks/useGroupDiscussionState";

const currentUser = { id: "me", name: "You" };

export default function GroupDiscussionNotifications({ onNotificationClick }) {
  const { notifications, markNotificationsRead } = useGroupDiscussionState(null, currentUser);
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (open) markNotificationsRead();
  }, [open, markNotificationsRead]);

  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative p-2 rounded-full hover:bg-green-100 transition-all"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell className="text-green-700" size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 animate-fadeIn">
          <div className="p-3 border-b font-semibold text-green-700 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="text-gray-400 text-sm p-4 text-center">No notifications yet.</div>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                className={`block w-full text-left px-4 py-3 border-b last:border-b-0 text-sm hover:bg-green-50 transition-all ${n.isRead ? "" : "bg-green-50"}`}
                onClick={() => {
                  setOpen(false);
                  onNotificationClick && onNotificationClick(n);
                }}
              >
                <div className="font-medium text-gray-800 mb-0.5">{n.message}</div>
                <div className="text-xs text-gray-400">{timeAgo(n.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)} min ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} hr ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}
