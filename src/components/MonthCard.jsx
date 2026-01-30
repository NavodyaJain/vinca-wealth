// src/components/MonthCard.jsx
// Reusable month card for all sprints, with strict UX, date formatting, and single-select challenge chips

import React, { useState } from "react";
import { formatDateRange } from "@/utils/dateFormatter";

const comfortLevels = ["Comfortable", "Slightly Stretched", "Difficult"];
const challenges = ["Forgot SIP", "Emergency Expense", "Cash Flow Issue", "Market Fear", "Other"];

export default function MonthCard({
  monthLabel,
  startDate,
  endDate,
  status,
  initial,
  onSave,
  disabled,
  readOnly
}) {
  const [sipDone, setSipDone] = useState(initial?.sipDone ?? null);
  const [comfort, setComfort] = useState(initial?.comfort ?? null);
  const [challenge, setChallenge] = useState(initial?.challenge ?? null);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saved, setSaved] = useState(initial?.saved ?? false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSave() {
    if (sipDone === null || !comfort || !challenge) {
      setError("Please answer all required questions.");
      return;
    }
    setSaved(true);
    setError("");
    setSuccess("Progress saved.");
    onSave && onSave({ sipDone, comfort, challenge, notes, saved: true });
  }

  return (
    <div className={`border rounded-xl p-5 mb-4 ${saved ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-4 mb-2">
        <div className="text-lg font-semibold text-slate-900">{monthLabel} ({formatDateRange(startDate, endDate)})</div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${saved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{saved ? "Completed" : "Pending"}</span>
      </div>
      <div className="mb-2 font-medium">Have you completed your SIP for this month?</div>
      <div className="flex gap-4 mb-2">
        <button
          className={`px-4 py-2 rounded-full border ${sipDone === true ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-900 border-slate-300"}`}
          onClick={() => setSipDone(true)}
          disabled={saved || readOnly}
        >Yes</button>
        <button
          className={`px-4 py-2 rounded-full border ${sipDone === false ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-900 border-slate-300"}`}
          onClick={() => setSipDone(false)}
          disabled={saved || readOnly}
        >No</button>
      </div>
      <div className="mb-2 font-medium">How did this month feel?</div>
      <div className="flex gap-2 mb-2">
        {comfortLevels.map(level => (
          <button
            key={level}
            className={`px-3 py-1 rounded-full border text-sm ${comfort === level ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-900 border-slate-300"}`}
            onClick={() => setComfort(level)}
            disabled={saved || readOnly}
          >{level}</button>
        ))}
      </div>
      <div className="mb-2 font-medium">What was your biggest challenge?</div>
      <div className="flex gap-2 flex-wrap mb-2">
        {challenges.map(chip => (
          <button
            key={chip}
            className={`px-3 py-1 rounded-full border text-sm ${challenge === chip ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-900 border-slate-300"}`}
            onClick={() => setChallenge(chip)}
            disabled={saved || readOnly}
          >{chip}</button>
        ))}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Anything you want to remember about this month?</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg p-2 text-sm"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          disabled={saved || readOnly}
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-emerald-700 mb-2">{success}</div>}
      {!saved && !readOnly && (
        <button
          className="mt-2 px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 w-fit self-start"
          onClick={handleSave}
        >Save Progress</button>
      )}
    </div>
  );
}
