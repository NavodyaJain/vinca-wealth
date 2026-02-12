// src/lib/learningMaturityEngine.js
// [DEPRECATED] This file is kept for reference but is superseded by learningPointsConfig.js
// New learning system uses points-based progression instead of topic/difficulty mapping
//
// Points-based system (active):
// - Beginner series: +10 points
// - Intermediate series: +20 points  
// - Advanced series: +30 points
// - 10 achievement levels unlock at defined point thresholds
// - See learningPointsConfig.js for current implementation

import { videoSeries } from '@/data/investorHub/resourcesData';

/**
 * Get all available series organized by difficulty
 */
export function getSeriesByDifficulty() {
  const grouped = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  videoSeries.forEach(series => {
    const difficulty = series.difficulty.toLowerCase();
    if (grouped[difficulty]) {
      grouped[difficulty].push(series);
    }
  });

  return grouped;
}

/**
 * Get total number of series available
 */
export function getTotalSeriesCount() {
  return videoSeries.length;
}
  }

  // Level 4: Readiness Mature - all three levels completed (if they exist)
  const hasAllLevels = 
    (seriesByDifficulty.beginner.length > 0 ? beginner >= 1 : true) &&
    (seriesByDifficulty.intermediate.length > 0 ? intermediate >= 1 : true) &&
    (seriesByDifficulty.advanced.length > 0 ? advanced >= 1 : true);

  if (hasAllLevels && completedTotal >= 1) {
    return 'Readiness Mature';
  }

  return 'Getting Started';
}

/**
 * Calculate all achievements with dynamic thresholds
 * Rules adapt automatically as new series are added
 */
export function getAchievementsWithProgress(completedSeriesByLevel) {
  const seriesByDifficulty = getSeriesByDifficulty();
  const totalSeries = getTotalSeriesCount();
  const { beginner, intermediate, advanced } = completedSeriesByLevel;
  const completedTotal = beginner + intermediate + advanced;

  // Dynamic achieve thresholds based on available content
  const meaningfulPercentage = Math.ceil(totalSeries * 0.5); // 50% of all series
  const hasAllDifficulties = 
    (seriesByDifficulty.beginner.length > 0 ? beginner >= 1 : true) &&
    (seriesByDifficulty.intermediate.length > 0 ? intermediate >= 1 : true) &&
    (seriesByDifficulty.advanced.length > 0 ? advanced >= 1 : true);

  const achievements = [
    {
      id: 'first-step-taken',
      name: 'First Step Taken',
      description: 'Complete any 1 series',
      isUnlocked: completedTotal >= 1,
      progress: completedTotal,
      target: 1,
      metric: 'completedSeriesCount',
      displayProgress: true
    },
    {
      id: 'bronze-learner',
      name: 'Bronze Learner',
      description: `Complete ${meaningfulPercentage} series (${Math.round((meaningfulPercentage / totalSeries) * 100)}% of available)`,
      isUnlocked: completedTotal >= meaningfulPercentage,
      progress: completedTotal,
      target: meaningfulPercentage,
      metric: 'completedSeriesCount',
      displayProgress: true
    },
    {
      id: 'depth-explorer',
      name: 'Depth Explorer',
      description: 'Complete at least 1 Advanced series',
      isUnlocked: advanced >= 1,
      progress: advanced,
      target: seriesByDifficulty.advanced.length > 0 ? 1 : 0,
      metric: 'advancedSeriesCompleted',
      displayProgress: seriesByDifficulty.advanced.length > 0
    },
    {
      id: 'balanced-learner',
      name: 'Balanced Learner',
      description: 'Complete series across all available difficulty levels',
      isUnlocked: hasAllDifficulties && completedTotal >= 1,
      progress: (beginner >= 1 ? 1 : 0) + (intermediate >= 1 ? 1 : 0) + (advanced >= 1 ? 1 : 0),
      target: (seriesByDifficulty.beginner.length > 0 ? 1 : 0) + 
              (seriesByDifficulty.intermediate.length > 0 ? 1 : 0) + 
              (seriesByDifficulty.advanced.length > 0 ? 1 : 0),
      metric: 'difficultyCoverage',
      displayProgress: true,
      details: {
        beginner: beginner >= 1,
        intermediate: intermediate >= 1,
        advanced: advanced >= 1
      }
    }
  ];

  return achievements;
}

/**
 * Get the next closest locked achievement
 * Returns null if all achievements are unlocked
 */
export function getNextAchievementToUnlock(completedSeriesByLevel) {
  const achievements = getAchievementsWithProgress(completedSeriesByLevel);
  
  // Find first locked achievement
  const nextLocked = achievements.find(a => !a.isUnlocked && a.target > 0);
  
  return nextLocked || null;
}

/**
 * Calculate progress percentage toward next achievement
 * Returns 0-100 (will show on circular KPI)
 */
export function getProgressToNextAchievement(completedSeriesByLevel) {
  const nextAchievement = getNextAchievementToUnlock(completedSeriesByLevel);
  
  if (!nextAchievement) {
    // All achievements unlocked
    return 100;
  }

  if (nextAchievement.target === 0) {
    // Achievement not applicable (no series of that type)
    return 0;
  }

  const progress = Math.min((nextAchievement.progress / nextAchievement.target) * 100, 100);
  return Math.round(progress);
}

/**
 * Get the most recently unlocked achievement
 * Used for KPI 2 (Recent Achievement Unlocked)
 */
export function getLatestUnlockedAchievement(completedSeriesByLevel) {
  const achievements = getAchievementsWithProgress(completedSeriesByLevel);
  
  // Return achievements in unlock order
  const unlocked = achievements.filter(a => a.isUnlocked).reverse();
  
  return unlocked.length > 0 ? unlocked[0] : null;
}

/**
 * Get maturity description based on level
 */
export function getMaturityDescription(maturityLevel) {
  const descriptions = {
    'Getting Started': 'You haven\'t started your financial learning journey yet. Complete your first series to begin.',
    'Awareness Builder': 'You understand the fundamentals. Building the right foundation for your financial planning.',
    'Decision Ready': 'You can now evaluate options with clarity. Ready to make informed financial decisions.',
    'Strategy Confident': 'You\'re capable of structuring long-term financial decisions with confidence.',
    'Readiness Mature': 'You\'ve developed well-rounded financial understanding across key areas.'
  };

  return descriptions[maturityLevel] || descriptions['Getting Started'];
}
