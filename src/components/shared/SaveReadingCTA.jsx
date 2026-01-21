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
        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-100 text-emerald-700 font-medium text-base cursor-default w-full sm:w-auto min-h-[44px]"
      >
        <Check className="w-5 h-5" />
        Saved
      </button>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium text-base hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto min-h-[44px]"
    >
      {saving ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          Save
        </>
      )}
    </button>
  );
}
