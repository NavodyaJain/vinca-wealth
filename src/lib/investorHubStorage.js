// src/lib/investorHubStorage.js
// Handles localStorage and helpers for Investor Hub: readings, joined status, event registration, track assignment

const STORAGE_KEYS = {
  readiness: 'vw_financialReadiness',
  lifestyle: 'vw_lifestylePlanner',
  health: 'vw_healthStress',
  joined: 'vw_investorHubJoined',
  events: 'vw_investorHubEvents',
};

// Financial Readiness
export function saveFinancialReadiness(reading) {
  localStorage.setItem(STORAGE_KEYS.readiness, JSON.stringify(reading));
}
export function getFinancialReadiness() {
  const data = localStorage.getItem(STORAGE_KEYS.readiness);
  return data ? JSON.parse(data) : null;
}

// Lifestyle Planner
export function saveLifestylePlanner(reading) {
  localStorage.setItem(STORAGE_KEYS.lifestyle, JSON.stringify(reading));
}
export function getLifestylePlanner() {
  const data = localStorage.getItem(STORAGE_KEYS.lifestyle);
  return data ? JSON.parse(data) : null;
}

// Health Stress
export function saveHealthStress(reading) {
  localStorage.setItem(STORAGE_KEYS.health, JSON.stringify(reading));
}
export function getHealthStress() {
  const data = localStorage.getItem(STORAGE_KEYS.health);
  return data ? JSON.parse(data) : null;
}

// Investor Hub Join
export function setInvestorHubJoined(joined = true) {
  localStorage.setItem(STORAGE_KEYS.joined, joined ? 'true' : 'false');
}
export function isInvestorHubJoined() {
  return localStorage.getItem(STORAGE_KEYS.joined) === 'true';
}

// Event Registration
export function registerEvent(eventId) {
  const events = getRegisteredEvents();
  if (!events.includes(eventId)) {
    events.push(eventId);
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  }
}
export function getRegisteredEvents() {
  const data = localStorage.getItem(STORAGE_KEYS.events);
  return data ? JSON.parse(data) : [];
}
export function isEventRegistered(eventId) {
  return getRegisteredEvents().includes(eventId);
}

// Check if all readings saved
export function hasAllReadings() {
  return !!(getFinancialReadiness() && getLifestylePlanner() && getHealthStress());
}

// Export all keys for use in other modules
export { STORAGE_KEYS };
