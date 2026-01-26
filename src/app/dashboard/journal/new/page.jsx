"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { saveJournalEntry, getJournalEntries } from '@/lib/journal/financialJournalStore';
const moods = [
  "🙂", // Neutral
  "😃", // Happy
  "😔", // Sad
  "😠", // Stressed
  "😎", // Confident
  "😐", // Uncertain
];
const quickAnswers = [
  "Stayed on budget",
  "Avoided impulse buys",
  "Reviewed my plan",
  "Tracked expenses",
  "Saved for emergency",
  "Discussed with family"
];

const defaultActions = [
  "Ran Financial Readiness",
  "Updated Lifestyle Planner",
  "Took Health Stress Test",
  "Watched Resources module",
  "Registered for an Event",
  "Redeemed a Perk",
  "Booked Elevate session",
  "Uploaded Portfolio Review"
];
const reflectionPrompts = [
  "Biggest financial blocker this week",
  "One improvement I made",
  "One expense I controlled",
  "A surprise I handled well"
];


export default function JournalEntryCreatePage() {
    // Hydration-safe max date for date input
    const todayISO = typeof window !== "undefined"
      ? new Date().toISOString().slice(0, 10)
      : "2026-01-26";
  // Streak calculation (hydration-safe)
  const [streakCount, setStreakCount] = useState(0);
  useEffect(() => {
    const entries = getJournalEntries();
    let count = 0;
    if (entries.length > 0) {
      const sorted = [...entries].sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
      let lastDate = new Date(sorted[0].weekStart);
      count = 1;
      for (let i = 1; i < sorted.length; i++) {
        const currentDate = new Date(sorted[i].weekStart);
        if ((lastDate - currentDate) === 7 * 24 * 60 * 60 * 1000) {
          count++;
          lastDate = currentDate;
        } else {
          break;
        }
      }
    }
    setStreakCount(count);
  }, []);
      const [saving, setSaving] = useState(false);
    // Alias for Save button
    const handleSave = handleSubmit;
  const router = useRouter();
  // Form state
  const [weekStart, setWeekStart] = useState("");
    const [tags, setTags] = useState([]);
  const [weekEnd, setWeekEnd] = useState("");
  const [sipCurrent, setSipCurrent] = useState("");
  const [sipChanged, setSipChanged] = useState(false);
  const [sipChange, setSipChange] = useState("");
  const [sipChangeReason, setSipChangeReason] = useState("");
  const [expenseDrift, setExpenseDrift] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [emergencyAmount, setEmergencyAmount] = useState("");
  const [emergencyCategory, setEmergencyCategory] = useState("");
  const [disciplineRating, setDisciplineRating] = useState(3);
  const [actions, setActions] = useState([]);
  const [reflectionPrompt, setReflectionPrompt] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [mood, setMood] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Week validation
  function handleWeekStartChange(e) {
    setWeekStart(e.target.value);
    if (e.target.value) {
      const start = new Date(e.target.value);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setWeekEnd(end.toISOString().slice(0, 10));
    } else {
      setWeekEnd("");
    }
  }

  function validateWeek() {
    if (!weekStart || !weekEnd) return false;
    const entries = getJournalEntries();
    return !entries.some(e => e.weekStart === weekStart);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    if (!weekStart || !weekEnd) {
      setError("Week period is required.");
      return;
    }
    if (!validateWeek()) {
      setError("This week already has an entry or overlaps.");
      return;
    }
    if (!sipCurrent) {
      setError("Current SIP is required.");
      return;
    }
    if (!disciplineRating) {
      setError("Discipline rating is required.");
      return;
    }
    // Save entry
    const entry = {
      id: `${weekStart}`,
      weekStart,
      weekEnd,
      sipCurrent: Number(sipCurrent),
      sipChanged,
      sipChange: sipChanged ? Number(sipChange) : 0,
      sipChangeReason: sipChanged ? sipChangeReason : "",
      expenseDrift: Number(expenseDrift),
      emergency,
      emergencyAmount: emergency ? Number(emergencyAmount) : 0,
      emergencyCategory: emergency ? emergencyCategory : "",
      disciplineScore: disciplineRating * 20,
      actions,
      reflectionPrompt,
      reflectionText,
      tags,
      createdAt: new Date().toISOString()
    };
    saveJournalEntry(entry);
    setSuccess("Weekly check-in saved");
    setTimeout(() => {
      setSaving(false);
      router.push("/dashboard/journal");
    }, 1200);
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">New Journal Entry</h1>
        <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50" onClick={() => router.replace('/dashboard/journal')}>Cancel</button>
      </div>
      <div className="px-4 sm:px-8 mb-6">
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          {/* Week Period Section */}
          <div>
            <label className="block font-semibold mb-1">Week Period</label>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 mr-2">Start</span>
                <input
                  type="date"
                  className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                  value={weekStart || ""}
                  onChange={handleWeekStartChange}
                  max={todayISO}
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 mr-2">End</span>
                <span className="font-mono text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200">{weekEnd || '--'}</span>
              </div>
            </div>
          </div>
          {/* Current SIP Field */}
          <div>
            <label className="block font-semibold mb-1">Current SIP <span className="text-red-500">*</span></label>
            <input
              type="number"
              className="border border-slate-200 rounded px-2 py-1 text-base focus:outline-none w-40"
              value={sipCurrent}
              onChange={e => setSipCurrent(e.target.value)}
              min={0}
              required
              placeholder="Enter SIP amount"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-1">
              {(tags || []).map(tag => (
                <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5 flex items-center gap-1">
                  {tag}
                  <button type="button" className="ml-1 text-xs text-red-500" onClick={() => setTags(tags.filter(t => t !== tag))}>&times;</button>
                </span>
              ))}
              <input
                className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                placeholder="Add tag"
                defaultValue=""
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    if (!tags.includes(e.target.value.trim())) {
                      setTags([...tags, e.target.value.trim()]);
                    }
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Reflection</label>
            <div className="text-xs text-slate-500 mb-2">Pick one prompt and write (optional).</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {reflectionPrompts.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${reflectionPrompt === prompt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                  onClick={() => setReflectionPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200 min-h-20"
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder={`Write your thoughts here (optional, 300 chars)...\n${reflectionPrompt}`}
              maxLength={300}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAnswers.map(ans => (
                <button
                  key={ans}
                  type="button"
                  className="px-2 py-1 rounded-full border border-emerald-200 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  onClick={() => setReflectionText(reflectionText ? reflectionText + ' ' + ans : ans)}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Mood</label>
            <div className="flex gap-2">
              {moods.map(mood => (
                <button
                  key={mood}
                  type="button"
                  className={`text-2xl px-2 py-1 rounded-lg border ${mood === mood ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}
                  onClick={() => setMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Confidence Score</label>
            <select
              className="border border-slate-200 rounded-lg px-2 py-1 text-base"
              value={confidenceScore || ""}
              onChange={e => setConfidenceScore(e.target.value)}
            >
              <option value="">Select</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Next Step</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={nextStep || ""}
              onChange={e => setNextStep(e.target.value)}
              placeholder="e.g. Review my plan next week"
              maxLength={100}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              Save Entry
            </button>
            <button
              className="px-5 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
              onClick={() => {
                clearDraftEntry();
                setTags([]);
                setWeekStart("");
                setWeekEnd("");
                setSipCurrent("");
                setSipChanged(false);
                setSipChange("");
                setSipChangeReason("");
                setExpenseDrift("");
                setEmergency(false);
                setEmergencyAmount("");
                setEmergencyCategory("");
                setDisciplineRating(3);
                setActions([]);
                setReflectionPrompt("");
                setReflectionText("");
                setMood("");
                setConfidenceScore("");
                setNextStep("");
                setError("");
                setSuccess("");
              }}
              disabled={saving}
            >
              Clear Draft
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
        <div className="mt-8 text-xs text-slate-400 text-center">
          Streak: {streakCount} days. Your journal is private.
        </div>
      </div>
    </div>
  );
}
