import React from "react";
import GroupDiscussionNotifications from "../groups/GroupDiscussionNotifications";
import { Search } from 'lucide-react';

export default function InvestorHubHeader({ onNotificationClick, search, setSearch }) {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 relative max-w-xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all shadow-sm"
          placeholder="Search perks (tax, books, health, credit card...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Notifications */}
      <div className="flex items-center gap-3 ml-4">
        <GroupDiscussionNotifications onNotificationClick={onNotificationClick} />
      </div>
    </div>
  );
}
