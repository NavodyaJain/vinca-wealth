// src/lib/eligibility/computeMembershipFit.js
import { benefitMap } from './benefitMap';
import { EXISTING_FEATURES } from './existingFeatures';

function formatRupee(val) {
  if (val == null || isNaN(val) || Number(val) === 0) return '—';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function getBenefitById(id) {
  for (const group of Object.values(membershipBenefits)) {
    const found = group.find((b) => b.id === id);
    if (found) return found;
  }
  return null;
}

export default function computeMembershipFit({ financialReadiness, fire, lifestyle, health }) {
  let score = 0;
  let reasons = [];
  let recommendedFeatureIds = new Set();
  let nextActionFeatureIds = new Set();
  let toolsUsed = 0;
  // Financial Readiness
  if (financialReadiness) {
    toolsUsed++;
    if (Number(financialReadiness.corpusGap) > 0) {
      score += 25;
      reasons.push({
        title: 'Retirement corpus gap',
        description: `Your expected corpus is ${formatRupee(financialReadiness.expectedCorpus)} but required is ${formatRupee(financialReadiness.requiredCorpus)}`,
        evidence: `Gap: ${formatRupee(financialReadiness.corpusGap)}`
      });
      // Recommend real features for corpus gap
      ['financialReadiness', 'events', 'portfolioReview', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (Number(financialReadiness.sipGap) > 0) {
      score += 20;
      reasons.push({
        title: 'SIP gap',
        description: `Your SIP is ${formatRupee(financialReadiness.currentSip)} but required is ${formatRupee(financialReadiness.requiredSip)}`,
        evidence: `Gap: ${formatRupee(financialReadiness.sipGap)}`
      });
      ['financialReadiness', 'portfolioReview', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (Number(financialReadiness.sustainableTillAge) < Number(financialReadiness.lifespan)) {
      score += 20;
      reasons.push({
        title: 'Plan may break early',
        description: `Plan survives till age ${financialReadiness.sustainableTillAge} vs lifespan ${financialReadiness.lifespan}`,
        evidence: `Shortfall: ${formatRupee(financialReadiness.requiredCorpus - financialReadiness.expectedCorpus)}`
      });
      ['financialReadiness', 'events', 'portfolioReview', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
  }
  // FIRE
  if (fire) {
    toolsUsed++;
    if (fire.isFeasible === false) {
      score += 25;
      reasons.push({
        title: 'FIRE plan not feasible',
        description: 'Your FIRE plan SIP exceeds your income.',
        evidence: `Total SIP: ${formatRupee(fire.totalSip)}`
      });
      ['financialReadiness', 'lifestylePlanner', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (fire.isFireSustainable === false) {
      score += 20;
      reasons.push({
        title: 'FIRE not sustainable',
        description: 'Projected corpus at FIRE age is less than required.',
        evidence: `Projected: ${formatRupee(fire.projectedCorpusAtFireAge)}, Required: ${formatRupee(fire.requiredCorpusAtFireAge)}`
      });
      ['financialReadiness', 'lifestylePlanner', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (Number(fire.yearsEarly) > 0) {
      score += 10;
    }
  }
  // Lifestyle
  if (lifestyle) {
    toolsUsed++;
    if (Number(lifestyle.monthlyGap) > 0) {
      score += 20;
      reasons.push({
        title: 'Lifestyle gap',
        description: `Gap between supported and required income: ${formatRupee(lifestyle.monthlyGap)}`,
        evidence: `Gap: ${formatRupee(lifestyle.monthlyGap)}`
      });
      ['lifestylePlanner', 'events'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (lifestyle.affordabilityStatus === 'Tight') {
      score += 12;
    }
    if (lifestyle.affordabilityStatus === 'Not Affordable') {
      score += 20;
    }
  }
  // Health
  if (health) {
    toolsUsed++;
    if (Number(health.sustainableTillAge) < Number(financialReadiness?.lifespan)) {
      score += 25;
      reasons.push({
        title: 'Health shocks can break your plan early',
        description: `Plan survives till age ${health.sustainableTillAge} vs lifespan ${financialReadiness?.lifespan}`,
        evidence: `Shortfall: ${formatRupee(health.monthlyGap)}`
      });
      ['healthStress', 'perks', 'elevate'].forEach(id => recommendedFeatureIds.add(id));
    }
    if (Number(health.monthlyGap) > 0) {
      score += 15;
    }
    if (health.category === 'Major') {
      score += 10;
    }
  }
  // Completion
  if (toolsUsed < 2) {
    return {
      verdict: 'Incomplete',
      score: 0,
      reasons: [
        { title: 'Not enough data', description: 'Complete at least 2 tools to unlock your membership fit.', evidence: '' }
      ],
      recommendedFeatureIds: [],
      nextActionFeatureIds: ['financialReadiness', 'lifestylePlanner', 'healthStress'],
      updatedAt: null
    };
  }
  if (score > 100) score = 100;
  let verdict = 'Optional';
  if (score >= 70) verdict = 'Strong Fit';
  else if (score >= 40) verdict = 'Helpful';
  else if (score < 40) verdict = 'Optional';
  // Map recommended/optional
  // Next actions: always recommend pricing, elevate, events, resources, perks if not already in recommended
  if (verdict === 'Strong Fit') {
    ['pricing', 'elevate', 'events', 'resources', 'perks'].forEach(id => nextActionFeatureIds.add(id));
  } else if (verdict === 'Helpful') {
    ['events', 'resources', 'perks'].forEach(id => nextActionFeatureIds.add(id));
  } else {
    ['events', 'resources'].forEach(id => nextActionFeatureIds.add(id));
  }
  // Remove duplicates
  Array.from(recommendedFeatureIds).forEach(id => nextActionFeatureIds.delete(id));
  return {
    verdict,
    score,
    reasons: reasons.slice(0, 5),
    recommendedFeatureIds: Array.from(recommendedFeatureIds),
    nextActionFeatureIds: Array.from(nextActionFeatureIds),
    updatedAt: null // UI should fill from readings
  };
}
