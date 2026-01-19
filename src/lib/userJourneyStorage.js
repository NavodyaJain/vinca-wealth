// src/lib/userJourneyStorage.js
// Shared helpers for user journey persistence

const STORAGE_KEY = 'vincaUserJourney';
const PROFILE_KEY = 'vincaProfile';

const getDefaultJourney = () => ({
  userInputs: {
    currentAge: null,
    retirementAge: null,
    monthlyIncome: null,
    monthlyExpenses: null,
    surplus: null,
    currentSavings: null,
    monthlySIP: null,
    expectedReturns: null,
    inflation: null,
    lifeExpectancy: null
  },
  readings: {
    financialReadiness: {
      isCompleted: false,
      surplusInvestmentStyle: null,
      sipCommitmentRatio: null,
      notes: null
    },
    earlyRetirement: {
      isCompleted: false,
      earlyRetirementAge: null,
      yearsEarly: null,
      optimizerStyle: null
    },
    lifestylePlanner: {
      isCompleted: false,
      chosenTier: null,
      targetMonthlyExpenseAtRetirement: null,
      requiredCorpusForLifestyle: null
    },
    healthStress: {
      isCompleted: false,
      chosenCategory: null,
      healthAdjustedCorpus: null,
      sustainabilityTillAge: null
    }
  },
  personalityUnlocked: false,
  personality: null,
  club: {
    recommendedClubId: null,
    joinedClubIds: []
  }
});

export const getUserProfile = () => {
  if (typeof window === 'undefined') return { name: '' };
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : { name: '' };
  } catch (error) {
    console.error('Error reading user profile:', error);
    return { name: '' };
  }
};

export const saveUserProfile = (profile) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export const getUserJourney = () => {
  if (typeof window === 'undefined') return getDefaultJourney();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...getDefaultJourney(),
        ...parsed,
        userInputs: { ...getDefaultJourney().userInputs, ...parsed.userInputs },
        readings: {
          financialReadiness: { ...getDefaultJourney().readings.financialReadiness, ...parsed.readings?.financialReadiness },
          earlyRetirement: { ...getDefaultJourney().readings.earlyRetirement, ...parsed.readings?.earlyRetirement },
          lifestylePlanner: { ...getDefaultJourney().readings.lifestylePlanner, ...parsed.readings?.lifestylePlanner },
          healthStress: { ...getDefaultJourney().readings.healthStress, ...parsed.readings?.healthStress }
        },
        club: { ...getDefaultJourney().club, ...parsed.club }
      };
    }
  } catch (error) {
    console.error('Error reading user journey:', error);
  }
  return getDefaultJourney();
};

export const setUserJourney = (data) => {
  if (typeof window === 'undefined') return;
  try {
    const merged = {
      ...getDefaultJourney(),
      ...data,
      _lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error('Error saving user journey:', error);
  }
};

export const saveUserReading = (toolKey, readingPayload) => {
  if (typeof window === 'undefined') return;
  const validKeys = ['financialReadiness', 'earlyRetirement', 'lifestylePlanner', 'healthStress'];
  if (!validKeys.includes(toolKey)) {
    console.error('Invalid tool key: ' + toolKey);
    return;
  }
  try {
    const journey = getUserJourney();
    journey.readings[toolKey] = {
      ...journey.readings[toolKey],
      ...readingPayload,
      isCompleted: true,
      _updatedAt: new Date().toISOString()
    };
    setUserJourney(journey);
  } catch (error) {
    console.error('Error saving reading for ' + toolKey + ':', error);
  }
};

export const saveUserInputs = (inputs) => {
  if (typeof window === 'undefined') return;
  try {
    const journey = getUserJourney();
    journey.userInputs = { ...journey.userInputs, ...inputs };
    setUserJourney(journey);
  } catch (error) {
    console.error('Error saving user inputs:', error);
  }
};

export const isToolCompleted = (toolKey) => {
  const journey = getUserJourney();
  return journey.readings[toolKey]?.isCompleted === true;
};

export const areAllToolsCompleted = () => {
  const journey = getUserJourney();
  return (
    journey.readings.financialReadiness?.isCompleted === true &&
    journey.readings.earlyRetirement?.isCompleted === true &&
    journey.readings.lifestylePlanner?.isCompleted === true &&
    journey.readings.healthStress?.isCompleted === true
  );
};

export const getToolsCompletionStatus = () => {
  const journey = getUserJourney();
  return {
    financialReadiness: journey.readings.financialReadiness?.isCompleted === true,
    earlyRetirement: journey.readings.earlyRetirement?.isCompleted === true,
    lifestylePlanner: journey.readings.lifestylePlanner?.isCompleted === true,
    healthStress: journey.readings.healthStress?.isCompleted === true,
    completedCount: [
      journey.readings.financialReadiness?.isCompleted,
      journey.readings.earlyRetirement?.isCompleted,
      journey.readings.lifestylePlanner?.isCompleted,
      journey.readings.healthStress?.isCompleted
    ].filter(Boolean).length
  };
};

export const unlockPersonalityIfEligible = () => {
  if (typeof window === 'undefined') return null;
  const { getRetirementPersonality, getRecommendedClub } = require('./retirementPersonalityEngine');
  const journey = getUserJourney();
  if (!areAllToolsCompleted()) return null;
  if (journey.personalityUnlocked && journey.personality) return journey.personality;
  const personality = getRetirementPersonality(journey.readings);
  const recommendedClub = getRecommendedClub(personality.key);
  journey.personalityUnlocked = true;
  journey.personality = personality;
  journey.club = { ...journey.club, recommendedClubId: recommendedClub?.id || null };
  setUserJourney(journey);
  return personality;
};

export const joinClub = (clubId) => {
  if (typeof window === 'undefined') return;
  const journey = getUserJourney();
  const joinedClubIds = journey.club?.joinedClubIds || [];
  if (!joinedClubIds.includes(clubId)) {
    journey.club = { ...journey.club, joinedClubIds: [...joinedClubIds, clubId] };
    setUserJourney(journey);
  }
};

export const leaveClub = (clubId) => {
  if (typeof window === 'undefined') return;
  const journey = getUserJourney();
  const joinedClubIds = journey.club?.joinedClubIds || [];
  journey.club = { ...journey.club, joinedClubIds: joinedClubIds.filter(id => id !== clubId) };
  setUserJourney(journey);
};

export const hasJoinedClub = (clubId) => {
  const journey = getUserJourney();
  const joinedClubIds = journey.club?.joinedClubIds || [];
  return joinedClubIds.includes(clubId) || journey.club?.joinedClubId === clubId;
};

export const getJoinedClubIds = () => {
  const journey = getUserJourney();
  const joinedClubIds = journey.club?.joinedClubIds || [];
  if (journey.club?.joinedClubId && !joinedClubIds.includes(journey.club.joinedClubId)) {
    return [...joinedClubIds, journey.club.joinedClubId];
  }
  return joinedClubIds;
};

export const resetUserJourney = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
