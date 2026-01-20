// LocalStorage helpers for group membership
const STORAGE_KEY = 'investorHubJoinedGroups';

export function getJoinedGroups() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function joinGroup(groupId) {
  if (typeof window === 'undefined') return;
  const joined = getJoinedGroups();
  if (!joined.includes(groupId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...joined, groupId]));
  }
}

export function leaveGroup(groupId) {
  if (typeof window === 'undefined') return;
  const joined = getJoinedGroups().filter(id => id !== groupId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(joined));
}

export function isGroupJoined(groupId) {
  return getJoinedGroups().includes(groupId);
}
