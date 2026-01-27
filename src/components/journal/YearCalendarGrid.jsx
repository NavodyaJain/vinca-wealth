// YearCalendarGrid.jsx
import React, { useMemo } from "react";
import { getDateState } from "@/lib/journal/getDateState";

// Dummy data for now; replace with real data from context/props
const commitments = [];
const entries = [];

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
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

export default function YearCalendarGrid({ year, selectedDate, setSelectedDate }) {
  // Only render the selected year
  const months = Array.from({ length: 12 }, (_, m) => m);
  function handleCellClick(cell) {
    if (!cell || !cell.isSelectable) return;
    setSelectedDate(cell.date);
  }
  function getCellClass(cell) {
    if (!cell) return "bg-slate-100 h-4 w-4 rounded";
    let base = "h-4 w-4 rounded text-xs font-semibold flex items-center justify-center cursor-pointer ";
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
    <div className="grid grid-cols-3 gap-6">
      {months.map((m) => {
        const grid = getMonthGrid(year, m);
        return (
          <div key={m} className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2">{new Date(year, m).toLocaleString('en-IN', { month: 'long' })}</div>
            <div className="grid grid-cols-7 gap-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-[10px] font-bold text-slate-400 text-center">{d}</div>
              ))}
              {grid.map((cell, i) => (
                <div
                  key={i}
                  className={getCellClass(cell)}
                  onClick={() => handleCellClick(cell)}
                >
                  {cell ? cell.day : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
