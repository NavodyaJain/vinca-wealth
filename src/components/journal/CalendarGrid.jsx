// CalendarGrid.jsx
import React, { useMemo } from "react";
import { getDateState } from "@/lib/journal/getDateState";

// Dummy data for now; replace with real data from context/props
const commitments = [];
const entries = [];

function getCalendarGrid(year, month) {
  // month: 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const grid = [];
  let day = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const cellIdx = i * 7 + j;
      if (cellIdx < startDay || day > daysInMonth) {
        grid.push(null);
      } else {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().slice(0, 10);
        const state = getDateState(dateStr, commitments, entries, todayStr);
        grid.push({
          date: dateStr,
          isToday: dateStr === todayStr,
          isSelectable: state !== "idle",
          state,
          day,
        });
        day++;
      }
    }
  }
  return grid;
}

export default function CalendarGrid({ year, month, selectedDate, setSelectedDate }) {
  // Default to current month/year if not provided
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const grid = useMemo(() => getCalendarGrid(y, m), [y, m]);

  function handleCellClick(cell) {
    if (!cell || !cell.isSelectable) return;
    setSelectedDate(cell.date);
  }

  function getCellClass(cell) {
    if (!cell) return "bg-slate-100";
    let base = "h-12 w-12 flex items-center justify-center rounded font-semibold cursor-pointer ";
    if (cell.state === "executed") base += "bg-emerald-500 text-white border-emerald-600 border-2 ";
    else if (cell.state === "approaching") base += "ring-2 ring-amber-400 bg-white ";
    else if (cell.state === "missed") base += "border-2 border-red-500 bg-white ";
    else if (cell.state === "sip_due") base += "border-2 border-emerald-400 bg-white ";
    else base += "bg-white text-slate-700 ";
    if (cell.isToday) base += "shadow-lg ";
    if (selectedDate === cell.date) base += "ring-4 ring-emerald-600 ";
    if (!cell.isSelectable) base += "opacity-40 cursor-not-allowed ";
    return base;
  }

  return (
    <div className="grid grid-cols-7 gap-2 bg-slate-50 p-4 rounded-xl">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <div key={`${d}-${i}`} className="text-xs font-bold text-slate-500 text-center">{d}</div>
      ))}
      {grid.map((cell, i) => (
        <div
          key={i}
          className={getCellClass(cell)}
          onClick={() => handleCellClick(cell)}
        >
          {cell ? (
            <>
              {cell.day}
              {cell.state === "executed" && <span className="ml-1">✓</span>}
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
