"use client";
import React, { useState } from "react";

// This form is for creating or editing a weekly journal entry in the new Retirement Journey system.
// It supports step-based flow: 1) Reflection, 2) Tags, 3) Status (draft/done)

export default function JournalEntryForm({
  initialEntry = {},
  weekStart,
  weekEnd,
  onSave,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [reflection, setReflection] = useState(initialEntry.reflection || "");
  const [tags, setTags] = useState(initialEntry.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(initialEntry.status || "draft");

  function handleAddTag(e) {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function handleRemoveTag(tag) {
    setTags(tags.filter(t => t !== tag));
  }

  function handleNext() {
    setStep(step + 1);
  }

  function handleBack() {
    setStep(step - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      weekStart,
      weekEnd,
      reflection,
      tags,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <form className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6" onSubmit={handleSubmit}>
      <div className="mb-4 text-slate-700 text-sm font-semibold">
        Week: {new Date(weekStart).toLocaleDateString()} – {new Date(weekEnd).toLocaleDateString()}
      </div>
      {step === 1 && (
        <div>
          <label className="block text-slate-800 font-medium mb-2">Reflection for this week</label>
          <textarea
            className="w-full border border-slate-200 rounded-lg p-2 mb-4 min-h-[80px]"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="What did you learn, accomplish, or struggle with this week?"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-1 rounded-lg border text-slate-600" onClick={onCancel}>Cancel</button>
            <button type="button" className="px-4 py-1 rounded-lg bg-emerald-600 text-white font-semibold" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <label className="block text-slate-800 font-medium mb-2">Tags (optional)</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5 flex items-center gap-1">
                {tag}
                <button type="button" className="ml-1 text-xs text-red-500" onClick={() => handleRemoveTag(tag)}>&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 border border-slate-200 rounded-lg p-2"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Add a tag (e.g. mindset, win, challenge)"
            />
            <button className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold" onClick={handleAddTag}>Add</button>
          </div>
          <div className="flex justify-between gap-2">
            <button type="button" className="px-4 py-1 rounded-lg border text-slate-600" onClick={handleBack}>Back</button>
            <button type="button" className="px-4 py-1 rounded-lg bg-emerald-600 text-white font-semibold" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <label className="block text-slate-800 font-medium mb-2">Entry Status</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="draft" checked={status === "draft"} onChange={() => setStatus("draft")}/>
              <span className="text-slate-700">Draft</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="done" checked={status === "done"} onChange={() => setStatus("done")}/>
              <span className="text-emerald-700 font-semibold">Done</span>
            </label>
          </div>
          <div className="flex justify-between gap-2">
            <button type="button" className="px-4 py-1 rounded-lg border text-slate-600" onClick={handleBack}>Back</button>
            <button type="submit" className="px-4 py-1 rounded-lg bg-emerald-600 text-white font-semibold">Save Entry</button>
          </div>
        </div>
      )}
    </form>
  );
}
