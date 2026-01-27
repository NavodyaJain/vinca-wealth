
"use client";
import JourneyCompletionCard from "@/components/journal/JourneyCompletionCard";
import CorpusGeneratedCard from "@/components/journal/CorpusGeneratedCard";
import CalendarHeader from "@/components/journal/CalendarHeader";
import CalendarGrid from "@/components/journal/CalendarGrid";
import AddEntryModal from "@/components/journal/AddEntryModal";
import YearSelector from "@/components/journal/YearSelector";
import YearCalendarGrid from "@/components/journal/YearCalendarGrid";
import React, { useState } from "react";
import JourneySummaryTabs from "@/components/journal/JourneySummaryTabs";

export default function JournalDashboardPage() {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const [selectedDate, setSelectedDate] = useState(null);
	const [addEntryOpen, setAddEntryOpen] = useState(false);
	const [selectedYear, setSelectedYear] = useState(currentYear);

	// Only show Add Entry if a valid, actionable date is selected (not idle/null)
	function handleAddEntry() {
		if (selectedDate) setAddEntryOpen(true);
	}

	// Helper to check if selectedDate is actionable (not idle/null)
	function isDateActionable(date) {
		if (!date) return false;
		// Use getDateState to check if the selected date is actionable
		// Dummy data for now; replace with real data from context/props
		const commitments = [];
		const entries = [];
		const todayStr = new Date().toISOString().slice(0, 10);
		const state = require("@/lib/journal/getDateState").getDateState(date, commitments, entries, todayStr);
		return state !== "idle";
	}

	// Only one year visible at a time
	const years = [currentYear - 1, currentYear, currentYear + 1];

	return (
		<div className="w-full px-0 sm:px-6 py-8 max-w-5xl mx-auto">
			{/* 1️⃣ PAGE HEADER */}
			<div className="journal-header mb-8">
				<h1 className="text-3xl font-bold text-slate-900">Retirement Execution Journal</h1>
			</div>

			{/* 2️⃣ KPI STRIP */}
			<div className="journal-kpis grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
				<JourneyCompletionCard />
				<CorpusGeneratedCard />
			</div>

			{/* 3️⃣ CURRENT MONTH EXECUTION CALENDAR */}
			<div className="execution-calendar mb-12">
				<CalendarHeader />
				<CalendarGrid
					year={currentYear}
					month={currentMonth}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<div className="flex justify-end mt-4">
					<button
						className={`px-4 py-2 rounded font-semibold transition-colors ${isDateActionable(selectedDate) ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
						onClick={isDateActionable(selectedDate) ? handleAddEntry : undefined}
						disabled={!isDateActionable(selectedDate)}
					>
						Add Entry
					</button>
				</div>
			</div>

			{/* 4️⃣ ADD ENTRY MODAL/SECTION */}
			<AddEntryModal open={addEntryOpen} date={selectedDate} onClose={() => setAddEntryOpen(false)} />

			{/* 5️⃣ YEAR SELECTOR + HISTORICAL CALENDARS */}
			<div className="calendar-history mb-12">
				<YearSelector
					years={years}
					selected={selectedYear}
					onSelect={setSelectedYear}
				/>
				<YearCalendarGrid
					year={selectedYear}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
			</div>

			{/* 6️⃣ JOURNEY SUMMARY TABS */}
			<div className="journey-summary">
				<JourneySummaryTabs />
			</div>
		</div>
	);
}
