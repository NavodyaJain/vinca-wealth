"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllJournalEntries, getDraftEntry } from '@/lib/journal/journalStorage';
import { getJournalStreak } from '@/lib/journal/journalStreakStorage';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString();
}

export default function JournalHome() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState(null);
  const [streak, setStreak] = useState({ streakCount: 0, lastSavedDateISO: null });
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Load and refresh entries
  function loadEntries() {
    let all = getAllJournalEntries();
    all = all.filter(e => !e.isDraft);
    all.sort((a, b) => (b.createdAtISO || '').localeCompare(a.createdAtISO || ''));
    setEntries(all);
    setDraft(getDraftEntry());
    setStreak(getJournalStreak());
  }

  useEffect(() => {
    loadEntries();
    window.addEventListener('storage', loadEntries);
    return () => window.removeEventListener('storage', loadEntries);
  }, []);

  // Compute this week's entries
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekCount = entries.filter(e => new Date(e.createdAtISO) >= weekAgo).length;

  // Tag list for filter
  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || [])));

  let filtered = entries.filter(e =>
    (!search || (e.title && e.title.toLowerCase().includes(search.toLowerCase()))) &&
    (!tagFilter || (e.tags && e.tags.includes(tagFilter))) &&
    (!onlyVerified || (e.actions && e.actions.some(a => a.isVerified)))
  );

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Retirement Journal</h1>
          <p className="text-slate-600">Track progress, build clarity, and stay consistent.</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            onClick={() => router.push('/dashboard/journal/new')}
          >
            Start today’s entry
          </button>
          {draft && (
            <button
              className="px-5 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
              onClick={() => router.push('/dashboard/journal/new')}
            >
              Resume draft
            </button>
          )}
        </div>
      </div>
      {/* Streak + Momentum */}
      <div className="px-4 sm:px-8 mb-6">
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold text-emerald-700">Current streak: {streak.streakCount} days</div>
            <div className="text-xs text-slate-500">This week: {weekCount} entries saved</div>
            <div className="text-xs text-slate-400 mt-1">Your journal is private by default.</div>
          </div>
        </div>
      </div>
      {/* Quick Suggestions */}
      <div className="px-4 sm:px-8 mb-6 flex gap-3 flex-wrap">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-1 min-w-[180px] text-center cursor-pointer hover:bg-emerald-50" onClick={() => router.push('/dashboard/challenges')}>
          <div className="font-semibold text-slate-800 mb-1">Start a challenge</div>
          <div className="text-xs text-slate-500">Build momentum with guided steps</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-1 min-w-[180px] text-center cursor-pointer hover:bg-emerald-50" onClick={() => router.push('/dashboard/financial-readiness')}>
          <div className="font-semibold text-slate-800 mb-1">Run Financial Readiness</div>
          <div className="text-xs text-slate-500">Check your plan’s health</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-1 min-w-[180px] text-center cursor-pointer hover:bg-emerald-50" onClick={() => router.push('/dashboard/pricing')}>
          <div className="font-semibold text-slate-800 mb-1">Upgrade to Pro</div>
          <div className="text-xs text-slate-500">Unlock premium features</div>
        </div>
      </div>
      {/* Filters */}
      <div className="px-4 sm:px-8 mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
        >
          <option value="">All tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={e => setOnlyVerified(e.target.checked)}
            className="accent-emerald-600"
          />
          Only verified actions
        </label>
      </div>
      {/* Entries Timeline */}
      <div className="px-4 sm:px-8">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            No journal entries yet.<br />
            <button
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              onClick={() => router.push('/dashboard/journal/new')}
            >
              Start today’s entry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(entry => (
              <div
                key={entry.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-3 cursor-pointer hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/journal/${entry.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="font-semibold text-slate-900 text-base">{entry.title}</span>
                    {entry.mood && <span className="bg-slate-100 text-slate-600 text-xs rounded px-2 py-0.5">{entry.mood}</span>}
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{formatDate(entry.createdAtISO)}</div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {(entry.tags || []).map(tag => (
                      <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400">{entry.actions?.length || 0} actions</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
