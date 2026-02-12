// src/lib/learningPointsConfig.js
// Configuration for points-based learning progression system
// All point rules and achievement thresholds defined here

/**
 * Points awarded per series by difficulty level
 * These values are fixed and apply to all series regardless of catalog size
 */
export const POINTS_PER_DIFFICULTY = {
  beginner: 10,
  intermediate: 20,
  advanced: 30
};

/**
 * Achievement levels - 10 progressive milestones based on total points
 * Achievement unlocks when totalLearningPoints >= threshold
 * Achievements are permanent (never expire or lock)
 * Users progress through these as they accumulate points
 */
export const ACHIEVEMENT_LEVELS = [
  {
    level: 1,
    id: 'first-step',
    name: 'First Step',
    pointsRequired: 10,
    description: 'Begin your learning journey'
  },
  {
    level: 2,
    id: 'learning-starter',
    name: 'Learning Starter',
    pointsRequired: 25,
    description: 'Build initial momentum'
  },
  {
    level: 3,
    id: 'consistent-learner',
    name: 'Consistent Learner',
    pointsRequired: 50,
    description: 'Demonstrate learning consistency'
  },
  {
    level: 4,
    id: 'knowledge-builder',
    name: 'Knowledge Builder',
    pointsRequired: 75,
    description: 'Expand your financial knowledge'
  },
  {
    level: 5,
    id: 'awareness-strong',
    name: 'Awareness Strong',
    pointsRequired: 100,
    description: 'Develop strong financial awareness'
  },
  {
    level: 6,
    id: 'discipline-formed',
    name: 'Discipline Formed',
    pointsRequired: 150,
    description: 'Apply disciplined learning approach'
  },
  {
    level: 7,
    id: 'strategy-mindset',
    name: 'Strategy Mindset',
    pointsRequired: 200,
    description: 'Think strategically about finances'
  },
  {
    level: 8,
    id: 'financial-explorer',
    name: 'Financial Explorer',
    pointsRequired: 275,
    description: 'Explore advanced financial topics'
  },
  {
    level: 9,
    id: 'advanced-learner',
    name: 'Advanced Learner',
    pointsRequired: 350,
    description: 'Master advanced concepts'
  },
  {
    level: 10,
    id: 'financially-mature',
    name: 'Financially Mature',
    pointsRequired: 450,
    description: 'Achieve comprehensive financial maturity'
  }
];

/**
 * Get points for a given difficulty level
 * @param {string} difficulty - 'beginner', 'intermediate', or 'advanced'
 * @returns {number} Points awarded for that difficulty
 */
export function getPointsForDifficulty(difficulty) {
  const normalized = difficulty?.toLowerCase() || '';
  return POINTS_PER_DIFFICULTY[normalized] || 0;
}

/**
 * Get all achievements (unlocked and locked) for a given point total
 * @param {number} totalPoints - User's current total learning points
 * @returns {array} Array of achievement objects with unlock status
 */
export function getAchievementsForPoints(totalPoints) {
  return ACHIEVEMENT_LEVELS.map((achievement) => ({
    ...achievement,
    isUnlocked: totalPoints >= achievement.pointsRequired,
    pointsEarned: totalPoints
  }));
}

/**
 * Get the highest achievement unlocked at the given point total
 * @param {number} totalPoints - User's current total learning points
 * @returns {object|null} Latest unlocked achievement or null if none
 */
export function getLatestAchievementForPoints(totalPoints) {
  const achievements = getAchievementsForPoints(totalPoints);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  
  if (unlockedAchievements.length === 0) {
    return null;
  }
  
  // Return the highest achievement unlocked
  return unlockedAchievements[unlockedAchievements.length - 1];
}

/**
 * Get the next achievement to unlock at the given point total
 * @param {number} totalPoints - User's current total learning points
 * @returns {object|null} Next achievement or null if all are unlocked
 */
export function getNextAchievementForPoints(totalPoints) {
  const achievements = getAchievementsForPoints(totalPoints);
  const nextLocked = achievements.find(a => !a.isUnlocked);
  
  if (!nextLocked) {
    return null; // All achievements unlocked
  }
  
  return nextLocked;
}

/**
 * Calculate progress to next achievement
 * @param {number} totalPoints - User's current total learning points
 * @returns {object} Progress info { current, target, pointsNeeded, percentage }
 */
export function getProgressToNextAchievement(totalPoints) {
  const nextAchievement = getNextAchievementForPoints(totalPoints);
  
  if (!nextAchievement) {
    // All achievements unlocked
    return {
      current: totalPoints,
      target: ACHIEVEMENT_LEVELS[ACHIEVEMENT_LEVELS.length - 1].pointsRequired,
      pointsNeeded: 0,
      percentage: 100,
      allUnlocked: true
    };
  }
  
  const pointsNeeded = Math.max(0, nextAchievement.pointsRequired - totalPoints);
  const previousAchievementPoints = nextAchievement.level > 1 
    ? ACHIEVEMENT_LEVELS[nextAchievement.level - 2].pointsRequired 
    : 0;
  const pointsInThisRange = nextAchievement.pointsRequired - previousAchievementPoints;
  const pointsEarnedInThisRange = totalPoints - previousAchievementPoints;
  const percentage = Math.round((pointsEarnedInThisRange / pointsInThisRange) * 100);
  
  return {
    current: totalPoints,
    target: nextAchievement.pointsRequired,
    pointsNeeded,
    nextAchievementName: nextAchievement.name,
    percentage: Math.min(percentage, 99), // Cap at 99% until actually unlocked
    allUnlocked: false
  };
}
