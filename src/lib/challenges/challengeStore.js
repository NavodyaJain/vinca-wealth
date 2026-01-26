// src/lib/challenges/challengeStore.js
const KEY = "vinca_challenges_state_v1";

function getChallengeState() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveChallengeState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function startChallenge(challengeId) {
  const state = getChallengeState();
  if (!state.activeChallengeId) {
    state.activeChallengeId = challengeId;
    state.progress = state.progress || {};
    state.progress[challengeId] = {
      startedAt: new Date().toISOString(),
      completedAt: null,
      tasks: {},
      status: "active"
    };
    saveChallengeState(state);
  }
}

function toggleTask(challengeId, taskId, isComplete) {
  const state = getChallengeState();
  if (!state.progress || !state.progress[challengeId]) return;
  state.progress[challengeId].tasks[taskId] = isComplete;
  saveChallengeState(state);
}

function completeChallenge(challengeId) {
  const state = getChallengeState();
  if (!state.progress || !state.progress[challengeId]) return;
  state.progress[challengeId].completedAt = new Date().toISOString();
  state.progress[challengeId].status = "completed";
  state.activeChallengeId = null;
  saveChallengeState(state);
}

function getChallengeProgress(challengeId, challenge) {
  const state = getChallengeState();
  const progress = state.progress && state.progress[challengeId];
  if (!progress || !challenge) return { completedCount: 0, totalCount: 0, percent: 0 };
  const totalCount = challenge.tasks.length;
  const completedCount = challenge.tasks.filter(t => progress.tasks[t.id]).length;
  return {
    completedCount,
    totalCount,
    percent: totalCount ? Math.round((completedCount / totalCount) * 100) : 0
  };
}

export {
  getChallengeState,
  saveChallengeState,
  startChallenge,
  toggleTask,
  completeChallenge,
  getChallengeProgress
};
