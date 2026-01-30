// src/lib/retirementSprintEngine.js
// Single source of truth for Retirement Sprints

// Sprint types
const SPRINT_TYPES = ['monthly', 'quarterly', 'annual'];

// LocalStorage key
const KEY = 'vinca_retirement_sprints_v1';

function getDefaultState() {
  return {
    activeSprint: null, // { type, startDate, endDate, status }
    sprintHistory: [], // [{ type, startDate, endDate, status, completedAt }]
  };
}

function loadState() {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || {};
    return { ...getDefaultState(), ...raw };
  } catch {
    return getDefaultState();
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

// --- API ---
export function getActiveSprint() {
  const state = loadState();
  return state.activeSprint;
}

export function getSprintKPIs(user) {
  // user: { currentAge, retirementAge, requiredCorpus, currentCorpus, monthlySIP }
  const state = loadState();
  const completedMonths = state.sprintHistory.reduce((acc, s) => {
    if (s.status === 'completed') {
      if (s.type === 'monthly') return acc + 1;
      if (s.type === 'quarterly') return acc + 3;
      if (s.type === 'annual') return acc + 12;
    }
    return acc;
  }, 0);
  const totalMonths = Math.max(1, (user.retirementAge - user.currentAge) * 12);
  const journeyCompleted = Math.min(100, Math.round((completedMonths / totalMonths) * 100));
  const corpusProgress = Math.min(100, Math.round((user.currentCorpus / user.requiredCorpus) * 100));
  // Delta: compare to last sprint
  let delta = 0;
  if (state.sprintHistory.length > 1) {
    const prev = state.sprintHistory[state.sprintHistory.length - 2];
    const prevCompleted = state.sprintHistory.slice(0, -1).reduce((acc, s) => {
      if (s.status === 'completed') {
        if (s.type === 'monthly') return acc + 1;
        if (s.type === 'quarterly') return acc + 3;
        if (s.type === 'annual') return acc + 12;
      }
      return acc;
    }, 0);
    const prevJourney = Math.round((prevCompleted / totalMonths) * 100);
    delta = journeyCompleted - prevJourney;
  }
  return {
    journeyCompleted,
    corpusProgress,
    delta,
    activeSprint: state.activeSprint,
  };
}

export function startSprint(type, user) {
  // Only one active sprint allowed
  const state = loadState();
  if (state.activeSprint) {
    return { error: 'You’re already enrolled in a sprint. Complete it before switching.' };
  }
  if (!SPRINT_TYPES.includes(type)) return { error: 'Invalid sprint type.' };
  // Set start/end dates
  const now = new Date();
  let endDate = new Date(now);
  if (type === 'monthly') endDate.setMonth(now.getMonth() + 1);
  if (type === 'quarterly') endDate.setMonth(now.getMonth() + 3);
  if (type === 'annual') endDate.setFullYear(now.getFullYear() + 1);
  state.activeSprint = {
    type,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    status: 'in_progress',
  };
  saveState(state);
  return { success: true };
}

export function completeSprint() {
  const state = loadState();
  if (!state.activeSprint) return { error: 'No active sprint.' };
  const now = new Date();
  state.activeSprint.status = 'completed';
  state.activeSprint.completedAt = now.toISOString();
  state.sprintHistory.push({ ...state.activeSprint });
  state.activeSprint = null;
  saveState(state);
  return { success: true };
}

export function getSprintHistory() {
  const state = loadState();
  return state.sprintHistory;
}
