// src/hooks/useLearningProgress.js
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'financialMaturity';

const DEFAULT_PROGRESS = {
  completedSeriesByLevel: {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  },
  completedSeries: [] // Array of completed series IDs for deduplication
};

function getInitialProgress() {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROGRESS;
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

  // Mark series as completed by difficulty level
  const markSeriesCompleted = useCallback((difficulty, seriesId) => {
    setProgress((prev) => {
      // Check if this series was already completed (avoid duplicates)
      if (prev.completedSeries.includes(seriesId)) {
        return prev; // Already counted, don't increment again
      }

      const normalizedDifficulty = difficulty.toLowerCase();
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      
      if (!validLevels.includes(normalizedDifficulty)) {
        return prev;
      }

      return {
        completedSeriesByLevel: {
          ...prev.completedSeriesByLevel,
          [normalizedDifficulty]: prev.completedSeriesByLevel[normalizedDifficulty] + 1
        },
        completedSeries: [...prev.completedSeries, seriesId]
      };
    });
  }, []);

  // Get the number of completed series at each level
  const getCompletedSeriesByLevel = useCallback(() => {
    return progress.completedSeriesByLevel;
  }, [progress.completedSeriesByLevel]);

  // Get financial maturity level based on completed series
  const getMaturityLevel = () => {
    const { completedSeriesByLevel } = progress;
    const { beginner, intermediate, advanced } = completedSeriesByLevel;

    // Level 4: Readiness Mature - all three levels completed
    if (beginner >= 1 && intermediate >= 1 && advanced >= 1) {
      return 'Readiness Mature';
    }
    
    // Level 3: Strategy Confident - multiple intermediate OR any advanced
    if ((intermediate >= 2) || (advanced >= 1)) {
      return 'Strategy Confident';
    }
    
    // Level 2: Decision Ready - beginner + intermediate
    if (beginner >= 1 && intermediate >= 1) {
      return 'Decision Ready';
    }
    
    // Level 1: Awareness Builder - at least one beginner
    if (beginner >= 1) {
      return 'Awareness Builder';
    }
    
    // No series completed yet
    return 'Getting Started';
  };

  // Get maturity level index for progression indicator (0-4)
  const getMaturityLevelIndex = () => {
    const level = getMaturityLevel();
    const levels = ['Getting Started', 'Awareness Builder', 'Decision Ready', 'Strategy Confident', 'Readiness Mature'];
    return levels.indexOf(level);
  };

  // Get maturity description based on level
  const getMaturityDescription = () => {
    const level = getMaturityLevel();
    const descriptions = {
      'Getting Started': 'You haven\'t started your financial learning journey yet. Complete your first series to begin understanding the fundamentals of retirement and financial planning.',
      'Awareness Builder': 'You understand the fundamentals of retirement and financial planning. You are building the right foundation before taking action.',
      'Decision Ready': 'You can now evaluate options with clarity and avoid common financial mistakes.',
      'Strategy Confident': 'You are capable of structuring long-term decisions with confidence.',
      'Readiness Mature': 'You have developed a well-rounded financial understanding across scenarios.'
    };
    return descriptions[level] || descriptions['Getting Started'];
  };

  // Calculate achievements based on completion counts
  const getAchievements = () => {
    const { beginner, intermediate, advanced } = progress.completedSeriesByLevel;
    const totalCompleted = beginner + intermediate + advanced;
    const achievements = [];

    // Bronze Achievement: Complete 1 beginner series
    if (beginner >= 1) {
      achievements.push({
        id: 'bronze-learner',
        name: 'Bronze Learner',
        emoji: '🥉',
        description: 'Completed your first financial learning series',
        unlockedAt: 'beginner >= 1'
      });
    }

    // Silver Achievement: Complete 2 intermediate series
    if (intermediate >= 2) {
      achievements.push({
        id: 'silver-scholar',
        name: 'Silver Scholar',
        emoji: '🥈',
        description: 'Mastered 2 intermediate financial topics',
        unlockedAt: 'intermediate >= 2'
      });
    }

    // Gold Achievement: Complete 3 advanced series
    if (advanced >= 3) {
      achievements.push({
        id: 'gold-expert',
        name: 'Gold Expert',
        emoji: '🥇',
        description: 'Achieved expertise in 3 advanced financial strategies',
        unlockedAt: 'advanced >= 3'
      });
    }

    // Comprehensive Master: All levels with 2+ each
    if (beginner >= 2 && intermediate >= 2 && advanced >= 2) {
      achievements.push({
        id: 'comprehensive-master',
        name: 'Comprehensive Master',
        emoji: '🏅',
        description: 'Mastered multiple topics across all difficulty levels',
        unlockedAt: 'beginner >= 2 && intermediate >= 2 && advanced >= 2'
      });
    }

    // Lifetime Learner: 5+ total series
    if (totalCompleted >= 5) {
      achievements.push({
        id: 'lifetime-learner',
        name: 'Lifetime Learner',
        emoji: '⭐',
        description: 'Completed 5+ financial learning series',
        unlockedAt: 'totalCompleted >= 5'
      });
    }

    // Advanced Pioneer: 3+ advanced series
    if (advanced >= 3) {
      achievements.push({
        id: 'advanced-pioneer',
        name: 'Advanced Pioneer',
        emoji: '🚀',
        description: 'Ventured deep into advanced financial planning',
        unlockedAt: 'advanced >= 3'
      });
    }

    // Knowledge Guardian: 10+ total series
    if (totalCompleted >= 10) {
      achievements.push({
        id: 'knowledge-guardian',
        name: 'Knowledge Guardian',
        emoji: '👑',
        description: 'Completed 10+ financial learning series - you are a financial expert',
        unlockedAt: 'totalCompleted >= 10'
      });
    }

    return achievements;
  };

  return {
    progress,
    markSeriesCompleted,
    getCompletedSeriesByLevel,
    getMaturityLevel,
    getMaturityLevelIndex,
    getMaturityDescription,
    getAchievements
  };
}
