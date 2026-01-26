// src/app/dashboard/journal/entry/[id]/page.jsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getJournalEntries } from "@/lib/journal/financialJournalStore";
import { formatWeekRange } from "@/lib/journal/dateUtils";

export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const entries = getJournalEntries();
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 px-4">
        <div className="text-xl font-bold text-red-700 mb-2">Entry not found</div>
        <button className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 mt-4" onClick={() => router.push("/dashboard/journal")}>Back to Journal</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <div className="text-2xl font-bold text-slate-900 mb-2">Weekly Entry Detail</div>
      <div className="text-base text-slate-500 mb-6">Week: {formatWeekRange(entry.weekStart, entry.weekEnd)}</div>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-1">Discipline Score</div>
            <div className="text-emerald-700 text-xl font-bold">{entry.disciplineScore ?? "—"}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">SIP Change</div>
            <div>{entry.sipChanged ? `₹${entry.sipChange} (${entry.sipChangeReason})` : "—"}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Expense Drift</div>
            <div>{entry.expenseDrift ? (entry.expenseDrift > 0 ? `+₹${entry.expenseDrift}` : entry.expenseDrift < 0 ? `-₹${Math.abs(entry.expenseDrift)}` : "₹0") : "—"}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Emergency Spend</div>
            <div>{entry.emergency ? `₹${entry.emergencyAmount} (${entry.emergencyCategory})` : "No"}</div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Actions Completed</div>
          <div className="flex flex-wrap gap-2">
            {(entry.actions || []).length ? entry.actions.map(a => <span key={a} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5">{a}</span>) : <span className="text-slate-400">—</span>}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Reflection</div>
          {entry.reflectionPrompt ? (
            <div className="text-xs text-slate-500 mb-1">{entry.reflectionPrompt}</div>
          ) : null}
          <div className="text-slate-800">{entry.reflectionText || "—"}</div>
        </div>
        {/* Impact on your plan section */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="font-semibold text-slate-800 mb-1">Impact on your plan</div>
          <div className="text-xs text-slate-500">
            {entry.sipChanged && entry.sipChange > 0 ? (
              <>If SIP stays consistent, your plan remains on-track.</>
            ) : entry.expenseDrift > 0 ? (
              <>If overspending continues for 4 weeks, buffer risk increases.</>
            ) : (
              <>No major impact detected this week.</>
            )}
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 mt-4 self-end" onClick={() => router.push("/dashboard/journal")}>Back to Journal</button>
      </div>
    </div>
  );
}
