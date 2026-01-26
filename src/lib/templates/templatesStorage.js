// src/lib/templates/templatesStorage.js
// LocalStorage helpers for active template state

const ACTIVE_TEMPLATE_KEY = 'activeTemplateId';
const ACTIVE_TEMPLATE_DATE_KEY = 'activeTemplateStarted';

export function getActiveTemplateId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_TEMPLATE_KEY);
}

export function setActiveTemplateId(id) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_TEMPLATE_KEY, id);
  localStorage.setItem(ACTIVE_TEMPLATE_DATE_KEY, new Date().toISOString());
}

export function clearActiveTemplate() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_TEMPLATE_KEY);
  localStorage.removeItem(ACTIVE_TEMPLATE_DATE_KEY);
}

export function getActiveTemplateStarted() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_TEMPLATE_DATE_KEY);
}

// Optionally, re-export getTemplateById for convenience
export { getTemplateById } from './templatesData';
