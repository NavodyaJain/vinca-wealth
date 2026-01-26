// src/lib/retirementPhaseTracker.js
// Pure logic for retirement phase progress, detection, and entry mapping

const PHASES = [
  {
    id: 'foundation',
    title: 'Foundation',
    description: 'Build basics: income, expenses, buffer, insurance',
    milestones: [
      'step1_inputs', // age, expenses, income filled
      'emergency_buffer', // emergency fund reading or months >= 3
      'insurance_done' // insurance section viewed or foundation reading
    ]
  },
  {
    id: 'accumulation',
    title: 'Accumulation',
    description: 'SIP consistency + corpus growth',
    milestones: [
      'sip_and_years', // SIP amount + years entered
      'readiness_tool', // ran Financial Readiness tool
      'readiness_saved' // saved readiness reading
    ]
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Surplus, FIRE, lifestyle planning',
    milestones: [
      'pro_unlocked_or_lever', // Pro unlocked or Smart Surplus Lever used
      'fire_reading', // saved FIRE optimized reading
      'lifestyle_reading' // ran Lifestyle Planner and saved reading
    ]
  },
  {
    id: 'resilience',
    title: 'Resilience',
    description: 'Health risks, stress tests, sustainability',
    milestones: [
      'health_stress', // ran Health Stress Test
      'health_category', // selected health category + viewed results
      'health_reading' // saved health reading
    ]
  }
];

// Helper: get phase index
function getPhaseIndex(phaseId) {
  return PHASES.findIndex(p => p.id === phaseId);
}

// Main: getPhaseProgress(profile, readings, entries)
export function getPhaseProgress(profile, readings, entries) {
  // Each phase: 3 milestones, each 33% progress
  // Return: { [phaseId]: { completedMilestones: [], percent, status } }
  const progress = {};
  // Foundation
  progress.foundation = {
    completedMilestones: [
      profile?.age && profile?.expenses && profile?.income ? 'step1_inputs' : null,
      readings?.emergencyFundMonths >= 3 || readings?.emergencyFundReading ? 'emergency_buffer' : null,
      readings?.insuranceViewed || readings?.foundationReading ? 'insurance_done' : null
    ].filter(Boolean),
    percent: 0,
    status: 'locked'
  };
  // Accumulation
  progress.accumulation = {
    completedMilestones: [
      readings?.sipAmount && readings?.investmentYears ? 'sip_and_years' : null,
      readings?.ranReadinessTool ? 'readiness_tool' : null,
      readings?.readinessSaved ? 'readiness_saved' : null
    ].filter(Boolean),
    percent: 0,
    status: 'locked'
  };
  // Optimization
  progress.optimization = {
    completedMilestones: [
      readings?.proUnlocked || readings?.usedSurplusLever ? 'pro_unlocked_or_lever' : null,
      readings?.fireReading ? 'fire_reading' : null,
      readings?.lifestyleReading ? 'lifestyle_reading' : null
    ].filter(Boolean),
    percent: 0,
    status: 'locked'
  };
  // Resilience
  progress.resilience = {
    completedMilestones: [
      readings?.ranHealthStress ? 'health_stress' : null,
      readings?.selectedHealthCategory ? 'health_category' : null,
      readings?.healthReading ? 'health_reading' : null
    ].filter(Boolean),
    percent: 0,
    status: 'locked'
  };
  // Calculate percent and status
  PHASES.forEach(phase => {
    const done = progress[phase.id].completedMilestones.length;
    progress[phase.id].percent = Math.round((done / 3) * 100);
  });
  // Status logic
  let unlocked = true;
  PHASES.forEach((phase, idx) => {
    if (progress[phase.id].percent === 100) {
      progress[phase.id].status = 'completed';
    } else if (unlocked) {
      progress[phase.id].status = 'in_progress';
      unlocked = false;
    } else {
      progress[phase.id].status = 'locked';
    }
  });
  return progress;
}

// Main: detectCurrentPhase(progress)
export function detectCurrentPhase(progress) {
  for (const phase of PHASES) {
    if (progress[phase.id].status === 'in_progress') return phase.id;
  }
  // If all completed, return last
  return PHASES[PHASES.length - 1].id;
}

// Main: mapEntryToPhase(entry)
export function mapEntryToPhase(entry) {
  // Prefer explicit phase tag
  if (entry.phase) return entry.phase;
  // Fallback: infer from actions/tags/title
  const t = (entry.title || '').toLowerCase();
  if (t.includes('emergency') || t.includes('insurance') || t.includes('foundation')) return 'foundation';
  if (t.includes('sip') || t.includes('readiness') || t.includes('accumulation')) return 'accumulation';
  if (t.includes('fire') || t.includes('lifestyle') || t.includes('optimization')) return 'optimization';
  if (t.includes('health') || t.includes('stress') || t.includes('resilience')) return 'resilience';
  // Default: current phase
  return null;
}

export { PHASES };
