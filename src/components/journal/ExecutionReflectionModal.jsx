// src/components/journal/ExecutionReflectionModal.jsx
// Modal for logging execution reflection (not diary)
import React, { useState } from "react";

const CHALLENGE_REASONS = [
  "Forgot SIP date",
  "Emergency expense",
  "Salary delay",
  "Lifestyle overspend",
  "Market fear",
  "No issues"
];
const HANDLING_OPTIONS = [
  "SIP executed as planned",
  "SIP reduced",
  "SIP delayed",
  "SIP skipped",
  "Took help / adjusted plan"
];
const EMOJIS = ["😟", "😐", "🙂", "😄", "😎"];

export default function ExecutionReflectionModal({ open, onClose, onSave, periodLabel }) {
  const [reason, setReason] = useState("");
  const [handling, setHandling] = useState("");
  const [note, setNote] = useState("");
  const [confidence, setConfidence] = useState(2);
  const [saving, setSaving] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    onSave({ reason, handling, note, confidence });
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 500);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="text-xl font-bold text-slate-900 mb-2">Log Execution Reflection</div>
        <div className="text-xs text-slate-500 mb-2">Period: <span className="font-semibold">{periodLabel}</span></div>
        <div>
          <label className="block font-semibold mb-1">What challenged execution this period?</label>
          <div className="flex flex-wrap gap-2">
            {CHALLENGE_REASONS.map(r => (
              <button type="button" key={r} className={`px-3 py-1 rounded-full border text-xs font-medium ${reason === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`} onClick={() => setReason(r)}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">How did you handle it?</label>
          <div className="flex flex-wrap gap-2">
            {HANDLING_OPTIONS.map(h => (
              <button type="button" key={h} className={`px-3 py-1 rounded-full border text-xs font-medium ${handling === h ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`} onClick={() => setHandling(h)}>{h}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Optional note</label>
          <textarea className="w-full border border-slate-200 rounded-lg p-2 mb-1 min-h-[60px]" maxLength={150} value={note} onChange={e => setNote(e.target.value)} placeholder="Anything worth noting about this period?" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Confidence Pulse</label>
          <div className="flex gap-2 mt-1">
            {EMOJIS.map((emoji, idx) => (
              <button type="button" key={emoji} className={`text-2xl px-2 py-1 rounded-lg border ${confidence === idx ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`} onClick={() => setConfidence(idx)}>{emoji}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60" disabled={saving || !reason || !handling}>Save Reflection</button>
          <button type="button" className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50" onClick={onClose} disabled={saving}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
