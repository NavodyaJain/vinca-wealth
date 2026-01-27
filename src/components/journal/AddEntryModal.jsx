// AddEntryModal.jsx
import React, { useState } from "react";
export default function AddEntryModal({ open = true, date, onClose }) {
  const [status, setStatus] = useState("executed");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("automation");
  const [reflection, setReflection] = useState("");
  const [confidence, setConfidence] = useState("");
  if (!open) return null;
  const isValid = !!date;
  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    // Save logic here (call API, update state, etc.)
    if (onClose) onClose();
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Execution Entry</h3>
        <div className="text-xs text-slate-500 mb-2">For date: <span className="font-semibold">{date || "(no date)"}</span></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Status</label>
            <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="executed">executed</option>
              <option value="partial">partial</option>
              <option value="missed">missed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Amount Executed</label>
            <input type="number" className="w-full border rounded p-2" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Reason</label>
            <select className="w-full border rounded p-2" value={reason} onChange={e => setReason(e.target.value)}>
              <option value="automation">automation</option>
              <option value="salary_alignment">salary_alignment</option>
              <option value="prior_planning">prior_planning</option>
              <option value="habit">habit</option>
              <option value="forgot">forgot</option>
              <option value="emergency">emergency</option>
              <option value="cash_flow">cash_flow</option>
              <option value="deliberate_skip">deliberate_skip</option>
              <option value="other">other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Reflection (optional)</label>
            <textarea className="w-full border rounded p-2" maxLength={200} value={reflection} onChange={e => setReflection(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Confidence</label>
            <div className="flex gap-2">
              <span role="img" aria-label="low" onClick={() => setConfidence("low")} className={confidence === "low" ? "ring-2 ring-emerald-500" : ""}>😟</span>
              <span role="img" aria-label="neutral" onClick={() => setConfidence("neutral")} className={confidence === "neutral" ? "ring-2 ring-emerald-500" : ""}>😐</span>
              <span role="img" aria-label="good" onClick={() => setConfidence("good")} className={confidence === "good" ? "ring-2 ring-emerald-500" : ""}>🙂</span>
              <span role="img" aria-label="high" onClick={() => setConfidence("high")} className={confidence === "high" ? "ring-2 ring-emerald-500" : ""}>😄</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" className="flex-1 bg-slate-200 text-slate-700 py-2 rounded font-semibold" onClick={onClose}>Cancel</button>
            <button type="submit" className={`flex-1 bg-emerald-600 text-white py-2 rounded font-semibold ${!isValid ? "opacity-50 cursor-not-allowed" : ""}`} disabled={!isValid}>Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
