"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  saveJournalEntry,
  createJournalEntry,
  getDraftEntry,
  saveDraftEntry,
  clearDraftEntry
} from '@/lib/journal/journalStorage';
import { getChallengeById } from '@/lib/challenges/challengesData';
import { getJournalStreak } from '@/lib/journal/journalStreakStorage';

const moods = ["😀", "🙂", "😐", "😕", "😢"];
const reflectionPrompts = [
  "What went well today?",
  "What confused you today?",
  "What’s blocking you right now?",
  "What do you want to do next?"
];
const quickAnswers = [
  "Feeling confident",
  "Need clarity",
  "Too many options",
  "Plan feels unrealistic"
];

export default function NewJournalEntry({ searchParams }) {
  const router = useRouter();
  const prefillChallengeId = searchParams?.challengeId || null;
  const prefillDay = searchParams?.day || null;

  const [entry, setEntry] = useState({
    title: '',
    tags: [],
    actions: [],
    reflectionPrompt: reflectionPrompts[0],
    reflectionText: '',
    mood: '',
    confidenceScore: '',
    nextStep: '',
  });
  const [selectedPrompt, setSelectedPrompt] = useState(reflectionPrompts[0]);
  const [streak, setStreak] = useState({ streakCount: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Prefill from challenge or draft
  useEffect(() => {
    if (prefillChallengeId && prefillDay) {
      // Inline prefill logic from challenge data
      const challenge = getChallengeById(prefillChallengeId);
      const dayIdx = parseInt(prefillDay, 10) - 1;
      let prefill = {};
      if (challenge && challenge.dailyTasks && challenge.dailyTasks[dayIdx]) {
        const tasks = challenge.dailyTasks[dayIdx];
        prefill = {
          title: `${challenge.title} - Day ${parseInt(prefillDay, 10)}`,
          tags: [challenge.title],
          actions: tasks.map(t => ({
            id: t.id,
            label: t.title,
            isVerified: false
          })),
          reflectionPrompt: tasks.find(t => t.type === 'reflection')?.description || reflectionPrompts[0],
          reflectionText: '',
          mood: '',
          confidenceScore: '',
          nextStep: ''
        };
      }
      setEntry(e => ({ ...e, ...prefill }));
      setSelectedPrompt(prefill.reflectionPrompt || reflectionPrompts[0]);
    } else {
      const draft = getDraftEntry();
      if (draft) {
        setEntry(draft);
        setSelectedPrompt(draft.reflectionPrompt || reflectionPrompts[0]);
      }
    }
    setStreak(getJournalStreak());
  }, [prefillChallengeId, prefillDay]);

  // Draft autosave
  useEffect(() => {
    saveDraftEntry(entry);
  }, [entry]);

  function handleChange(field, value) {
    setEntry(e => ({ ...e, [field]: value }));
    if (field === 'reflectionPrompt') setSelectedPrompt(value);
  }

  function handleTagInput(e) {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setEntry(prev => ({ ...prev, tags: [...(prev.tags || []), e.target.value.trim()] }));
      e.target.value = '';
    }
  }

  function removeTag(tag) {
    setEntry(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    // Minimal validation: at least a prompt or actions
    if (!selectedPrompt && (!entry.actions || entry.actions.length === 0)) {
      setError('Please select a reflection prompt or add an action.');
      setSaving(false);
      return;
    }
    // Auto title
    let title = entry.title;
    if (!title) {
      const today = new Date();
      const isChallenge = (entry.tags || []).includes('Challenge');
      if (isChallenge) title = 'Challenge progress saved';
      else title = `Journal entry — ${today.toLocaleDateString()}`;
    }
    // Auto tags
    let tags = Array.isArray(entry.tags) ? [...entry.tags] : [];
    if (entry.actions && entry.actions.some(a => (a.label || '').toLowerCase().includes('challenge'))) {
      if (!tags.includes('Challenge')) tags.push('Challenge');
    } else if (entry.actions && entry.actions.some(a => (a.label || '').toLowerCase().includes('readiness'))) {
      if (!tags.includes('Readiness')) tags.push('Readiness');
    } else if (!tags.includes('Journal')) {
      tags.push('Journal');
    }
    const entryToSave = {
      ...entry,
      title,
      tags,
      reflectionPrompt: selectedPrompt,
      isDraft: false
    };
    try {
      createJournalEntry(entryToSave);
      clearDraftEntry();
      router.replace('/dashboard/journal?saved=1');
    } catch (e) {
      setError('Failed to save entry.');
    }
    setSaving(false);
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">New Journal Entry</h1>
        <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50" onClick={() => router.replace('/dashboard/journal')}>Cancel</button>
      </div>
      <div className="px-4 sm:px-8 mb-6">
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={entry.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. My Retirement Progress"
              maxLength={60}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-1">
              {(entry.tags || []).map(tag => (
                <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5 flex items-center gap-1">
                  {tag}
                  <button type="button" className="ml-1 text-xs text-red-500" onClick={() => removeTag(tag)}>&times;</button>
                </span>
              ))}
              <input
                className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                placeholder="Add tag"
                onKeyDown={handleTagInput}
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
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${selectedPrompt === prompt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                  onClick={() => handleChange('reflectionPrompt', prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200 min-h-20"
              value={entry.reflectionText}
              onChange={e => handleChange('reflectionText', e.target.value)}
              placeholder={`Write your thoughts here (optional, 300 chars)...\n${selectedPrompt}`}
              maxLength={300}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAnswers.map(ans => (
                <button
                  key={ans}
                  type="button"
                  className="px-2 py-1 rounded-full border border-emerald-200 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  onClick={() => setEntry(e => ({ ...e, reflectionText: (e.reflectionText ? e.reflectionText + ' ' : '') + ans }))}
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
                  className={`text-2xl px-2 py-1 rounded-lg border ${entry.mood === mood ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}
                  onClick={() => handleChange('mood', mood)}
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
              value={entry.confidenceScore}
              onChange={e => handleChange('confidenceScore', e.target.value)}
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
              value={entry.nextStep}
              onChange={e => handleChange('nextStep', e.target.value)}
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
              onClick={() => { clearDraftEntry(); setEntry({ title: '', tags: [], actions: [], reflectionPrompt: '', reflectionText: '', mood: '', confidenceScore: '', nextStep: '' }); }}
              disabled={saving}
            >
              Clear Draft
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
        <div className="mt-8 text-xs text-slate-400 text-center">
          Streak: {streak.streakCount} days. Your journal is private.
        </div>
      </div>
    </div>
  );
}
