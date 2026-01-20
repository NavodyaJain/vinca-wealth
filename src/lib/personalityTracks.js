// src/lib/personalityTracks.js
// Maps saved readings to a deterministic track/personality for Investor Hub

const TRACKS = [
  {
    id: 'high-ambition-safety',
    name: 'High Ambition, High Safety',
    icon: '🔥🛡️',
    description: 'You aim for early retirement, premium lifestyle, and maximum health security.',
    priorities: ['Ambitious goals', 'Premium living', 'Health protection'],
    suggest: ['Trending', 'My Track', 'Events'],
    match: (readings) => {
      return readings.financial.earlyRetirementAge && readings.lifestyle.lifestyleTierAffordable === 'Premium' && readings.health.selectedHealthCategory === 'major';
    },
  },
  {
    id: 'balanced-builder',
    name: 'Balanced Builder',
    icon: '⚖️🏗️',
    description: 'You balance early retirement with a comfortable lifestyle and planned health needs.',
    priorities: ['Balance', 'Comfort', 'Planning'],
    suggest: ['Leaderboard', 'Resources', 'My Track'],
    match: (readings) => {
      return readings.financial.earlyRetirementAge && readings.lifestyle.lifestyleTierAffordable === 'Comfortable' && readings.health.selectedHealthCategory === 'planned';
    },
  },
  {
    id: 'stability-first',
    name: 'Stability First',
    icon: '🛡️🏠',
    description: 'You prioritize stability, basic lifestyle, and everyday health costs.',
    priorities: ['Stability', 'Essentials', 'Consistency'],
    suggest: ['Resources', 'Events', 'Leaderboard'],
    match: (readings) => {
      return !readings.financial.earlyRetirementAge && readings.lifestyle.lifestyleTierAffordable === 'Basic' && readings.health.selectedHealthCategory === 'everyday';
    },
  },
  {
    id: 'fire-enthusiast',
    name: 'FIRE Enthusiast',
    icon: '🔥',
    description: 'You aggressively pursue early retirement and financial independence.',
    priorities: ['Early retirement', 'Aggressive saving'],
    suggest: ['Trending', 'Discussions', 'My Track'],
    match: (readings) => {
      return readings.financial.earlyRetirementAge && readings.financial.surplusUsedPercent > 70;
    },
  },
  {
    id: 'comfort-seeker',
    name: 'Comfort Seeker',
    icon: '🛋️',
    description: 'You aim for a comfortable lifestyle and moderate health planning.',
    priorities: ['Comfort', 'Moderation'],
    suggest: ['Leaderboard', 'Events'],
    match: (readings) => {
      return readings.lifestyle.lifestyleTierAffordable === 'Comfortable' && readings.health.selectedHealthCategory === 'planned';
    },
  },
  {
    id: 'safety-planner',
    name: 'Safety Planner',
    icon: '🦺',
    description: 'You focus on health safety and essential needs.',
    priorities: ['Health safety', 'Essentials'],
    suggest: ['Resources', 'Leaderboard'],
    match: (readings) => {
      return readings.health.selectedHealthCategory === 'major';
    },
  },
  {
    id: 'steady-saver',
    name: 'Steady Saver',
    icon: '💰',
    description: 'You steadily build your corpus with a focus on long-term security.',
    priorities: ['Steady growth', 'Security'],
    suggest: ['Leaderboard', 'Resources'],
    match: (readings) => {
      return readings.financial.surplusUsedPercent <= 40 && readings.lifestyle.lifestyleTierAffordable !== 'Premium';
    },
  },
  {
    id: 'lifestyle-optimizer',
    name: 'Lifestyle Optimizer',
    icon: '🎯',
    description: 'You optimize your lifestyle within your means and plan for health.',
    priorities: ['Optimization', 'Planning'],
    suggest: ['My Track', 'Events'],
    match: (readings) => {
      return readings.lifestyle.lifestyleTierAffordable !== 'Basic' && readings.health.selectedHealthCategory !== 'major';
    },
  },
];

// Determine track from readings
export function getPersonalityTrack(readings) {
  for (const track of TRACKS) {
    if (track.match(readings)) return track;
  }
  // Default fallback
  return {
    id: 'default',
    name: 'Retirement Planner',
    icon: '📝',
    description: 'You are planning your retirement journey.',
    priorities: ['Planning'],
    suggest: ['Resources'],
  };
}

export { TRACKS };
