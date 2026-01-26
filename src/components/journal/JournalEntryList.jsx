// src/components/journal/JournalEntryList.jsx
// Professional weekly entry list/table for fintech journal
import React from "react";
import { formatWeekRange } from "@/lib/journal/dateUtils";
import { useRouter } from "next/navigation";

export default function JournalEntryList({ entries }) {
  const router = useRouter();
  return (
    <div className="w-full mt-8">
      <div className="text-lg font-bold text-slate-800 mb-3">Weekly Check-ins</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl border border-slate-200">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs">
              <th className="px-4 py-2 text-left">Week</th>
              <th className="px-4 py-2 text-left">Discipline Score</th>
              <th className="px-4 py-2 text-left">SIP Change</th>
              <th className="px-4 py-2 text-left">Expense Drift</th>
              <th className="px-4 py-2 text-left">Emergency</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.weekStart} className="border-t border-slate-100 text-sm">
                <td className="px-4 py-2 font-medium text-slate-800">{formatWeekRange(entry.weekStart, entry.weekEnd)}</td>
                <td className="px-4 py-2 text-center">{entry.disciplineScore ?? "—"}</td>
                <td className="px-4 py-2 text-center">{entry.sipChange ? `₹${entry.sipChange}` : "—"}</td>
                <td className="px-4 py-2 text-center">{entry.expenseDrift ? (entry.expenseDrift > 0 ? `+₹${entry.expenseDrift}` : entry.expenseDrift < 0 ? `-₹${Math.abs(entry.expenseDrift)}` : "₹0") : "—"}</td>
                <td className="px-4 py-2 text-center">{entry.emergency ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 text-xs"
                    onClick={() => router.push(`/dashboard/journal/entry/${entry.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
