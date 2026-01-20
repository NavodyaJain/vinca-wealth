import React from 'react';

export default function HubTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-t-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 whitespace-nowrap font-semibold text-sm transition-all border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'border-green-600 text-green-700 bg-green-50'
              : 'border-transparent text-slate-600 hover:text-green-600 hover:bg-slate-50'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
