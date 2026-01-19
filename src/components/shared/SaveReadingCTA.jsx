'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';

/**
 * Simple Save button that becomes "Saved" when clicked
 */
export default function SaveReadingCTA({ 
  onSave, 
  isSaved = false
}) {
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async () => {
    if (isSaved || justSaved) return;
    setSaving(true);
    try {
      await onSave?.();
      setJustSaved(true);
    } catch (error) {
      console.error('Error saving reading:', error);
    } finally {
      setSaving(false);
    }
  };

  const isComplete = isSaved || justSaved;

  if (isComplete) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium text-sm cursor-default"
      >
        <Check className="w-4 h-4" />
        Saved
      </button>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Save
        </>
      )}
    </button>
  );
}
