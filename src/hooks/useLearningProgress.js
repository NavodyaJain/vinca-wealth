// src/hooks/useLearningProgress.js
import { useCallback, useEffect, useState } from 'react';
import {
  getPointsForDifficulty,
  getAchievementsForPoints,
  getLatestAchievementForPoints,
  getNextAchievementForPoints,
  getProgressToNextAchievement
} from '@/lib/learningPointsConfig';
import { videoSeries } from '@/data/investorHub/resourcesData';

const STORAGE_KEY = 'financialMaturity';

const DEFAULT_PROGRESS = {
  totalLearningPoints: 0,
  completedSeries: [] // Array of { seriesId, difficulty, pointsEarned }
};

function getInitialProgress() {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : DEFAULT_PROGRESS;
    
    // Ensure the new points-based structure
    if (!('totalLearningPoints' in parsed)) {
      // Migrate from old structure if needed
      return DEFAULT_PROGRESS;
    }
    
    return parsed;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function useLearningProgress() {
  const [progress, setProgress] = useState(() => getInitialProgress());

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  /**
   * Mark a series as completed and add points
   * Points are awarded once per series (deduplication)
   * @param {string} seriesId - Unique series identifier
   * @param {string} difficulty - 'beginner', 'intermediate', or 'advanced'
   * @returns {object|null} Newly unlocked achievement if any, null otherwise
   */
  const markSeriesCompleted = useCallback((seriesId, difficulty) => {
    let newlyUnlockedAchievement = null;
    
    setProgress((prev) => {
      // Check if this series was already completed
      const alreadyCompleted = prev.completedSeries.some(item => 
        typeof item === 'string' ? item === seriesId : item.seriesId === seriesId
      );
      
      if (alreadyCompleted) {
        return prev; // Already counted, don't add points again
      }

      const pointsEarned = getPointsForDifficulty(difficulty);
      const newTotalPoints = prev.totalLearningPoints + pointsEarned;
      
      // Get current and new achievement status
      const oldLatestAchievement = getLatestAchievementForPoints(prev.totalLearningPoints);
      const newLatestAchievement = getLatestAchievementForPoints(newTotalPoints);
      
      // Check if a new achievement was unlocked
      if (newLatestAchievement && (!oldLatestAchievement || newLatestAchievement.id !== oldLatestAchievement.id)) {
        newlyUnlockedAchievement = newLatestAchievement;
      }

      return {
        totalLearningPoints: newTotalPoints,
        completedSeries: [
          ...prev.completedSeries,
          {
            seriesId,
            difficulty,
            pointsEarned
          }
        ]
      };
    });
    
    return newlyUnlockedAchievement;
  }, []);

  /**
   * Get total learning points earned
   */
  const getMaturityScore = useCallback(() => {
    return progress.totalLearningPoints;
  }, [progress.totalLearningPoints]);

  /**
   * Get all unlocked achievements for current points
   */
  const getAchievements = useCallback(() => {
    return getAchievementsForPoints(progress.totalLearningPoints);
  }, [progress.totalLearningPoints]);

  /**
   * Get the most recently unlocked achievement
   */
  const getLatestAchievement = useCallback(() => {
    return getLatestAchievementForPoints(progress.totalLearningPoints);
  }, [progress.totalLearningPoints]);

  /**
   * Get the next achievement to unlock
   */
  const getNextAchievementToUnlock = useCallback(() => {
    return getNextAchievementForPoints(progress.totalLearningPoints);
  }, [progress.totalLearningPoints]);

  /**
   * Get progress toward next achievement
   */
  const getProgressToNextAchievementValue = useCallback(() => {
    return getProgressToNextAchievement(progress.totalLearningPoints);
  }, [progress.totalLearningPoints]);

  /**
   * Get maturity level name (named bucket based on achievement level)
   * For display purposes - show the current achievement level name
   */
  const getMaturityLevel = useCallback(() => {
    const latestAchievement = getLatestAchievementForPoints(progress.totalLearningPoints);
    return latestAchievement ? latestAchievement.name : 'Beginner';
  }, [progress.totalLearningPoints]);

  /**
   * Get the series data with difficulty for a given series ID
   */
  const getSeriesDifficulty = useCallback((seriesId) => {
    const series = videoSeries.find(s => s.id === seriesId);
    return series ? series.difficulty : null;
  }, []);

  /**
   * Check if a series has been completed
   */
  const isSeriesCompleted = useCallback((seriesId) => {
    return progress.completedSeries.some(item =>
      typeof item === 'string' ? item === seriesId : item.seriesId === seriesId
    );
  }, [progress.completedSeries]);

  /**
   * Get count of completed series by difficulty level
   * (For backward compatibility or display purposes)
   */
  const getCompletedSeriesByLevel = useCallback(() => {
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    
    progress.completedSeries.forEach(item => {
      const difficulty = typeof item === 'string' 
        ? getSeriesDifficulty(item)?.toLowerCase() 
        : item.difficulty?.toLowerCase();
      
      if (difficulty && counts[difficulty] !== undefined) {
        counts[difficulty]++;
      }
    });
    
    return counts;
  }, [progress.completedSeries, getSeriesDifficulty]);

  return {
    progress,
    markSeriesCompleted,
    getMaturityScore,
    getMaturityLevel,
    getAchievements,
    getLatestAchievement,
    getNextAchievementToUnlock,
    getProgressToNextAchievementValue,
    getCompletedSeriesByLevel,
    getSeriesDifficulty,
    isSeriesCompleted
  };
}
