
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JournalKpiRing from "@/components/journal/JournalKpiRing";
import JournalSignals from "@/components/journal/JournalSignals";
import JournalEntryList from "@/components/journal/JournalEntryList";
import MonthlySummaryCards from "@/components/journal/MonthlySummaryCards";
import { getJournalEntries, getMonthlySummaries } from "@/lib/journal/financialJournalStore";
import { computeJourneyCompletion, computePlanHealthScore, computeDisciplineScore, computeSignals } from "@/lib/journal/financialJournalEngine";

export default function JournalDashboardPage() {
	const router = useRouter();
	const [entries, setEntries] = useState([]);
	const [monthlySummaries, setMonthlySummaries] = useState([]);
	// TODO: Replace with real readings from user profile/tools
	const readings = {
		requiredCorpus: 10000000,
		expectedCorpus: 8500000,
		sustainabilityFlag: true,
		sipRequired: 25000,
		sipCurrent: 20000,
		healthStressResult: "risk"
	};
	const journey = {
		journeyStartDate: "2022-01-01",
		retirementDate: "2052-01-01"
	};

	useEffect(() => {
		setEntries(getJournalEntries());
		setMonthlySummaries(getMonthlySummaries());
	}, []);

	// KPIs
	const journeyCompletion = computeJourneyCompletion(journey);

	// Retirement Corpus Generated KPI
	const corpusPercent = readings.expectedCorpus && readings.requiredCorpus
		? Math.max(0, Math.min(100, Math.round((readings.expectedCorpus / readings.requiredCorpus) * 100)))
		: 0;
	function formatINR(num) {
		if (!num && num !== 0) return "₹0";
		return `₹${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
	}
	const corpusText = `${corpusPercent}% of corpus generated`;
	const corpusSubtext = `${formatINR(readings.expectedCorpus)} of ${formatINR(readings.requiredCorpus)} goal`;


	// Monthly SIP Goal KPI
	// Assume readings.sipRequired is the current monthly SIP goal
	// Assume readings.sipIncreaseRate is the % increase rate per month (from initial setup)
	const sipGoal = readings.sipRequired || 0;
	const sipIncreaseRate = readings.sipIncreaseRate || 0.05; // default 5% monthly
	const sipGoalText = `Monthly SIP Goal`;
	const sipGoalSubtext = `₹${sipGoal.toLocaleString()} (↑ ${Math.round(sipIncreaseRate * 100)}%/mo)`;

	return (
		<div className="w-full px-0 sm:px-6 py-8">
			{/* Header Section */}
			<div className="flex flex-row items-center justify-between mb-8">
				<div>
					<div className="text-2xl font-bold text-slate-900">Financial Journal</div>
					<div className="text-base text-slate-500">Weekly check-ins to track discipline + retirement progress.</div>
				</div>
				<div className="flex items-center gap-3">
					{/* Bell icon placeholder */}
					<button className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-emerald-700">
						<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
					</button>
					<button
						className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow hover:bg-emerald-700"
						onClick={() => router.push("/dashboard/journal/new")}
					>
						+ Add New Entry
					</button>
				</div>
			</div>

			{/* KPI Dashboard */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
				<JournalKpiRing
					value={journeyCompletion}
					label="Journey Completion"
					subtext={`Time left: 26 years, 0 months`}
				/>
				<JournalKpiRing
					value={corpusPercent}
					label={corpusText}
					subtext={corpusSubtext}
				/>
				<div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 min-w-[180px] justify-center">
					<div className="text-lg font-semibold text-slate-800 mb-1">This Month's SIP Goal</div>
					<div className="text-3xl font-bold text-emerald-700 mb-2">₹{sipGoal.toLocaleString()}</div>
					<div className="text-xs text-slate-500">{sipGoalSubtext}</div>
				</div>
			</div>



			{/* Weekly Entry List */}
			<JournalEntryList entries={entries} />

			{/* Monthly Summary Section */}
			<MonthlySummaryCards summaries={monthlySummaries} />
		</div>
	);
}
