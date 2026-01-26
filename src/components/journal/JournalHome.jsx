"use client";
import React, { useState, useEffect } from "react";
import { getRetirementJourneyData } from "@/lib/retirementJourneyTracker";
import { getWeeklyEntries, getWeeklyStreak, getLastCheckin, getLastNWeeksStatus } from "@/lib/weeklyJournalStore";

import RetirementJourneyTrackerCard from "./RetirementJourneyTrackerCard";
import WeeklyCheckinCard from "./WeeklyCheckinCard";
import JournalTimeline from "./JournalTimeline";
import JournalEntryForm from "./JournalEntryForm";

export default function JournalHome() {
  // Get user data (replace with real profile/readings if available)
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [journey, setJourney] = useState(null);
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    // TODO: Replace with real profile/reading data if available
    setCurrentAge(30);
    setRetirementAge(60);
    setWeeklyEntries(getWeeklyEntries());
    setJourney(getRetirementJourneyData({ currentAge: 30, retirementAge: 60 }));
  }, []);

  const streak = getWeeklyStreak(weeklyEntries);
  const lastCheckin = getLastCheckin(weeklyEntries);
  const weekStatus = getLastNWeeksStatus(weeklyEntries, 6);

  function handleAddEntry() {
    setEditingEntry(null);
    setShowEntryForm(true);
  }

  function handleViewEntry(entry) {
    setEditingEntry(entry);
    setShowEntryForm(true);
  }

  function handleSaveEntry(entry) {
    // Save to localStorage
    const { saveWeeklyEntry, getWeeklyEntries } = require("@/lib/weeklyJournalStore");
    saveWeeklyEntry(entry);
    setWeeklyEntries(getWeeklyEntries());
    setShowEntryForm(false);
    setEditingEntry(null);
  }

  function handleCancelEntry() {
    setShowEntryForm(false);
    setEditingEntry(null);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-6">
      {journey && <RetirementJourneyTrackerCard journey={{ ...journey, currentAge, retirementAge }} />}
      <WeeklyCheckinCard
        streak={streak}
        lastCheckin={lastCheckin}
        weekStatus={weekStatus}
        onAddEntry={handleAddEntry}
      />
      <JournalTimeline
        weeklyEntries={weeklyEntries}
        onViewEntry={handleViewEntry}
      />
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-xl mx-auto">
            <JournalEntryForm
              initialEntry={editingEntry || {}}
              weekStart={editingEntry?.weekStart}
              weekEnd={editingEntry?.weekEnd}
              onSave={handleSaveEntry}
              onCancel={handleCancelEntry}
            />
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-2xl font-bold"
              onClick={handleCancelEntry}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
