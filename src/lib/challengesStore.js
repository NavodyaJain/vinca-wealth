// src/lib/challengesStore.js
// State management for cadence-based challenges (localStorage)

const STORAGE_KEY = 'vinca_challenges_state';

function getChallengesState() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveChallengesState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function joinChallenge(challengeId) {
  const state = getChallengesState();
  const now = new Date().toISOString();
  if (!state[challengeId]) {
    state[challengeId] = {
      joinedAt: now,
      lastCompletedAt: null,
      currentCycleStart: now,
      cyclesCompletedCount: 0,
      status: 'active',
      log: []
    };
    saveChallengesState(state);
  }
}

function completeChallengeCycle(challengeId) {
  const state = getChallengesState();
  if (!state[challengeId]) return;
  const now = new Date().toISOString();
  state[challengeId].lastCompletedAt = now;
  state[challengeId].cyclesCompletedCount = (state[challengeId].cyclesCompletedCount || 0) + 1;
  state[challengeId].currentCycleStart = now;
  state[challengeId].status = 'active';
  saveChallengesState(state);
}

function restartChallenge(challengeId) {
  const state = getChallengesState();
  const now = new Date().toISOString();
  if (state[challengeId]) {
    state[challengeId].joinedAt = now;
    state[challengeId].lastCompletedAt = null;
    state[challengeId].currentCycleStart = now;
    state[challengeId].cyclesCompletedCount = 0;
    state[challengeId].status = 'active';
    state[challengeId].log = [];
    saveChallengesState(state);
  }
}

function getActiveChallenge() {
  const state = getChallengesState();
  return Object.entries(state).find(([_, v]) => v.status === 'active')?.[0] || null;
}

function getChallengeProgress(challengeId) {
  const state = getChallengesState();
  return state[challengeId] || null;
}

export {
  getChallengesState,
  saveChallengesState,
  joinChallenge,
  completeChallengeCycle,
  restartChallenge,
  getActiveChallenge,
  getChallengeProgress
};
