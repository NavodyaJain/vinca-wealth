// src/lib/eligibility/getMembershipFit.js
import { membershipBenefits } from './membershipBenefits';

// Helper for formatting rupee
function formatRupee(val) {
  if (val == null || isNaN(val)) return '—';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function getMembershipFit(readings) {
  // Defensive
  if (!readings || typeof readings !== 'object') {
    return {
      verdict: 'Run tools first',
      title: 'Use all tools to unlock your membership fit',
      subtitle: 'We need your readings to recommend what helps you most.',
      reasons: [],
      recommendedBenefits: [],
      optionalBenefits: [],
      nextBestActionCTA: { label: 'Use Tools First', href: '/dashboard/financial-readiness' }
    };
  }
  const { readiness, fire, lifestyle, health } = readings;
  let missingCount = 0;
  if (!readiness) missingCount++;
  if (!lifestyle) missingCount++;
  if (!health) missingCount++;
  // Case 6: Not enough readings
  if (missingCount >= 2) {
    return {
      verdict: 'Run tools first',
      title: 'Use all tools to unlock your membership fit',
      subtitle: 'We need your readings to recommend what helps you most.',
      reasons: [],
      recommendedBenefits: [],
      optionalBenefits: [],
      nextBestActionCTA: { label: 'Use Tools First', href: '/dashboard/financial-readiness' }
    };
  }
  // Case 1: Financial Readiness gap
  if (readiness && (Number(readiness.corpusGap) > 0 || Number(readiness.sipGap) > 0)) {
    return {
      verdict: 'Strong Fit',
      title: 'Membership can help close your plan gap',
      subtitle: 'Your plan has a gap. Membership helps you close it with guided next actions.',
      reasons: [
        {
          icon: '📉',
          title: 'Corpus gap detected',
          description: `Corpus gap: ${formatRupee(readiness.corpusGap)}`,
          evidence: `Corpus gap: ${formatRupee(readiness.corpusGap)}`
        },
        {
          icon: '💸',
          title: 'SIP gap detected',
          description: `SIP gap: ${formatRupee(readiness.sipGap)}`,
          evidence: `SIP gap: ${formatRupee(readiness.sipGap)}`
        }
      ],
      recommendedBenefits: [
        membershipBenefits.toolInsights[0],
        membershipBenefits.community[0],
        membershipBenefits.community[1],
        membershipBenefits.community[2]
      ],
      optionalBenefits: [membershipBenefits.perks[0], membershipBenefits.perks[1]],
      nextBestActionCTA: { label: 'Get Membership', href: '/dashboard/pricing' }
    };
  }
  // Case 2: FIRE/Surplus lever not feasible
  if (readiness && readiness.requiredSip && readiness.monthlyIncome && Number(readiness.requiredSip) > Number(readiness.monthlyIncome)) {
    return {
      verdict: 'Strong Fit',
      title: 'Ambitious plan, needs support',
      subtitle: 'Your plan is ambitious but doesn’t fit current income reality.',
      reasons: [
        {
          icon: '⚡',
          title: 'Required SIP exceeds income',
          description: `Required SIP: ${formatRupee(readiness.requiredSip)}, Income: ${formatRupee(readiness.monthlyIncome)}`,
          evidence: `Required SIP: ${formatRupee(readiness.requiredSip)}, Income: ${formatRupee(readiness.monthlyIncome)}`
        }
      ],
      recommendedBenefits: [
        membershipBenefits.toolInsights[0],
        membershipBenefits.toolInsights[1],
        membershipBenefits.community[2]
      ],
      optionalBenefits: [membershipBenefits.perks[2]],
      nextBestActionCTA: { label: 'Get Membership', href: '/dashboard/pricing' }
    };
  }
  if (fire && fire.notFeasible) {
    return {
      verdict: 'Strong Fit',
      title: 'Ambitious plan, needs support',
      subtitle: 'Your plan is ambitious but doesn’t fit current income reality.',
      reasons: [
        {
          icon: '⚡',
          title: 'FIRE not feasible',
          description: 'FIRE plan not feasible with current surplus.',
          evidence: 'FIRE plan not feasible with current surplus.'
        }
      ],
      recommendedBenefits: [
        membershipBenefits.toolInsights[0],
        membershipBenefits.toolInsights[1],
        membershipBenefits.community[2]
      ],
      optionalBenefits: [membershipBenefits.perks[2]],
      nextBestActionCTA: { label: 'Get Membership', href: '/dashboard/pricing' }
    };
  }
  // Case 3: Lifestyle not affordable
  if (lifestyle && (lifestyle.isAffordable === false || Number(lifestyle.gapMonthly) > 0)) {
    return {
      verdict: 'Helpful',
      title: 'Lifestyle gap detected',
      subtitle: 'Your desired lifestyle may need a plan adjustment.',
      reasons: [
        {
          icon: '🛋️',
          title: 'Lifestyle gap',
          description: `Gap: ${formatRupee(lifestyle.gapMonthly)}`,
          evidence: `Gap: ${formatRupee(lifestyle.gapMonthly)}`
        }
      ],
      recommendedBenefits: [
        membershipBenefits.toolInsights[1],
        membershipBenefits.community[0],
        membershipBenefits.community[1]
      ],
      optionalBenefits: [membershipBenefits.perks[2]],
      nextBestActionCTA: { label: 'View Pricing', href: '/dashboard/pricing' }
    };
  }
  // Case 4: Health stress breaks plan
  if (health && readiness && health.sustainableTillAge && readiness.retirementAge && Number(health.sustainableTillAge) < Number(readiness.retirementAge) + 20) {
    return {
      verdict: 'Strong Fit',
      title: 'Plan sensitive to health shocks',
      subtitle: 'Your retirement plan is sensitive to health shocks.',
      reasons: [
        {
          icon: '🩺',
          title: 'Health-adjusted sustainability',
          description: `Sustainable till age ${health.sustainableTillAge}`,
          evidence: `Sustainable till age ${health.sustainableTillAge}`
        }
      ],
      recommendedBenefits: [
        membershipBenefits.toolInsights[2],
        membershipBenefits.perks[1],
        membershipBenefits.perks[0]
      ],
      optionalBenefits: [membershipBenefits.community[0]],
      nextBestActionCTA: { label: 'Get Membership', href: '/dashboard/pricing' }
    };
  }
  // Case 5: Everything healthy
  if (
    readiness && Number(readiness.corpusGap) <= 0 && Number(readiness.sipGap) <= 0 &&
    lifestyle && (lifestyle.isAffordable === true || Number(lifestyle.gapMonthly) <= 0) &&
    health && health.sustainableTillAge && readiness.retirementAge && Number(health.sustainableTillAge) >= Number(readiness.retirementAge) + 20
  ) {
    return {
      verdict: 'Not Needed Right Now',
      title: 'You’re on track — membership is optional',
      subtitle: 'Your plan looks stable. Membership can still help you stay disciplined + learn more.',
      reasons: [
        {
          icon: '✅',
          title: 'Plan on track',
          description: 'No major gaps detected.',
          evidence: 'No major gaps detected.'
        }
      ],
      recommendedBenefits: [
        membershipBenefits.community[0],
        membershipBenefits.community[1]
      ],
      optionalBenefits: [membershipBenefits.community[2], membershipBenefits.perks[2]],
      nextBestActionCTA: { label: 'Explore Investor Hub', href: '/dashboard/investor-hub' }
    };
  }
  // Fallback
  return {
    verdict: 'Helpful',
    title: 'Membership may help',
    subtitle: 'Membership can help you improve preparedness and stay on track.',
    reasons: [],
    recommendedBenefits: [membershipBenefits.community[0]],
    optionalBenefits: [],
    nextBestActionCTA: { label: 'View Pricing', href: '/dashboard/pricing' }
  };
}
