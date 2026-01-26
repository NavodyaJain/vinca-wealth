import { mapEntryToPhase } from "@/lib/retirementPhaseTracker";
import { useState, useEffect } from "react";

export default function PhaseSelect({ entry, onChange, currentPhase }) {
  const [phase, setPhase] = useState(entry.phase || mapEntryToPhase(entry) || currentPhase || "foundation");
  useEffect(() => {
    onChange(phase);
    // eslint-disable-next-line
  }, [phase]);
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Retirement Phase</label>
      <select
        className="border border-slate-200 rounded-lg px-2 py-1 text-base"
        value={phase}
        onChange={e => setPhase(e.target.value)}
      >
        <option value="foundation">Foundation</option>
        <option value="accumulation">Accumulation</option>
        <option value="optimization">Optimization</option>
        <option value="resilience">Resilience</option>
      </select>
      <div className="text-xs text-slate-500 mt-1">Auto-selected based on your actions. You can override if needed.</div>
    </div>
  );
}
