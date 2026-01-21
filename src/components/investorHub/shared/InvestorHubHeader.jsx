import React from "react";
import GroupDiscussionNotifications from "../groups/GroupDiscussionNotifications";

export default function InvestorHubHeader({ onNotificationClick }) {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-green-700">Investor Hub</span>
      </div>
      <div className="flex items-center gap-3">
        <GroupDiscussionNotifications onNotificationClick={onNotificationClick} />
      </div>
    </div>
  );
}
