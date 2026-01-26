// src/lib/retirementJourneyTracker.js
// Calculates time-based retirement journey progress for the Journal

function getLocalStorageSafe(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorageSafe(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

function formatDuration(years, months) {
  let str = '';
  if (years > 0) str += `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) str += (str ? ', ' : '') + `${months} month${months > 1 ? 's' : ''}`;
  return str || '0 months';
}

export function getRetirementJourneyData({ currentAge, retirementAge, journeyStartDate }) {
  // Fallbacks
  const today = new Date();
  currentAge = currentAge || 30;
  retirementAge = retirementAge || 60;
  // Journey start
  let startDate = parseDate(journeyStartDate) || parseDate(getLocalStorageSafe('vinca_retirement_journey_start_date', null));
  if (!startDate) {
    // Default: today
    startDate = today;
    setLocalStorageSafe('vinca_retirement_journey_start_date', startDate.toISOString());
  }
  // Estimate birth year
  const birthYear = today.getFullYear() - currentAge;
  const birthDate = new Date(birthYear, 0, 1); // Jan 1
  // Retirement date
  const retirementDate = new Date(birthYear + retirementAge, 0, 1);
  // Durations
  const totalMs = retirementDate - startDate;
  const passedMs = today - startDate;
  const leftMs = retirementDate - today;
  // Clamp
  const percent = Math.max(0, Math.min(100, Math.round((passedMs / totalMs) * 100)));
  // Format durations
  function msToYrsMonths(ms) {
    if (ms <= 0) return { years: 0, months: 0 };
    const totalMonths = Math.floor(ms / (1000 * 60 * 60 * 24 * 30.44));
    return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
  }
  const timePassed = msToYrsMonths(passedMs);
  const timeLeft = msToYrsMonths(leftMs);
  return {
    journeyStartDate: startDate,
    retirementDate,
    timePassed,
    timeLeft,
    percentComplete: percent,
    formatted: {
      start: startDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
      retirement: retirementDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
      timePassed: formatDuration(timePassed.years, timePassed.months),
      timeLeft: formatDuration(timeLeft.years, timeLeft.months)
    }
  };
}
