"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getJournalEntryById, deleteJournalEntry } from '@/lib/journal/journalStorage';
import { getJournalStreak } from '@/lib/journal/journalStreakStorage';

export default function JournalEntryDetail() {
  const router = useRouter();
  const params = useParams();
  const { entryId } = params;
  const [entry, setEntry] = useState(null);
  const [streak, setStreak] = useState({ streakCount: 0, lastSavedDateISO: null });
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setEntry(getJournalEntryById(entryId));
    setStreak(getJournalStreak());
  }, [entryId]);

  if (!entry) return (
    <div className="p-8 text-center text-slate-500">
      Entry not found.<br />
      <button className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700" onClick={() => router.replace('/dashboard/journal')}>Back to Journal</button>
    </div>
  );

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{entry.title}</h1>
          <div className="text-xs text-slate-500 mb-1">{new Date(entry.createdAtISO).toLocaleDateString()}</div>
        </div>
        <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50" onClick={() => router.replace('/dashboard/journal')}>Back to Journal</button>
      </div>
      <div className="px-4 sm:px-8 mb-6">
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-4 mb-4">
          <div className="font-semibold text-emerald-700 mb-1">Streak: {streak.streakCount} days</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(entry.tags || []).map(tag => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5">{tag}</span>
            ))}
          </div>
          <div className="mb-2">
            <div className="font-semibold text-slate-800 mb-1">Actions Completed</div>
            <ul className="list-disc pl-6 text-slate-700">
              {(entry.actions || []).map(a => (
                <li key={a.id} className="mb-1 flex items-center gap-2">
                  {a.label}
                  {a.isVerified && <span className="bg-emerald-100 text-emerald-700 text-xs rounded px-2 py-0.5">Verified</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <div className="font-semibold text-slate-800 mb-1">Reflection</div>
            <div className="text-slate-700 mb-1">{entry.reflectionPrompt}</div>
            <div className="text-slate-600 text-sm mb-1">{entry.reflectionText}</div>
          </div>
          <div className="mb-2 flex gap-4">
            {entry.mood && <span className="bg-slate-100 text-slate-600 text-xs rounded px-2 py-0.5">Mood: {entry.mood}</span>}
            {entry.confidenceScore && <span className="bg-blue-100 text-blue-700 text-xs rounded px-2 py-0.5">Confidence: {entry.confidenceScore}/5</span>}
          </div>
          <div className="mb-2">
            <div className="font-semibold text-slate-800 mb-1">Next Step</div>
            <div className="text-slate-700 text-sm">{entry.nextStep}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-red-500 text-red-700 font-semibold hover:bg-red-50" onClick={() => setShowConfirm(true)}>Delete entry</button>
        </div>
        {showConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            <div className="mb-2">Are you sure you want to delete this entry?</div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700" onClick={() => { deleteJournalEntry(entry.id); router.replace('/dashboard/journal'); }}>Delete</button>
              <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="mt-8 text-xs text-slate-400 text-center">
          This journal is private. This is educational and not investment advice.
        </div>
      </div>
    </div>
  );
}
