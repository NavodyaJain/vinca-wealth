// src/components/checkEligibility/CheckEligibilityDashboard.jsx
import { useEffect, useState } from 'react';

import { getVincaReadings } from '@/lib/readings/vincaReadingsStore';
import computeMembershipFit from '@/lib/eligibility/computeMembershipFit';
import EligibilityHeroCard from '@/components/eligibility/EligibilityHeroCard';
import MembershipSupportCard from '@/components/eligibility/MembershipSupportCard';

export default function CheckEligibilityDashboard() {
  const [fit, setFit] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const readings = getVincaReadings();
      setFit(computeMembershipFit(readings || {}));
    }
  }, []);

  if (!fit) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-slate-500 text-lg">Loading your membership fit...</div>
    );
  }

  // Handler for Join Membership button (no payment logic yet)
  const handleJoin = () => {
    // Future: open membership modal or redirect
    alert('Membership join coming soon!');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <EligibilityHeroCard
          score={fit.score}
          verdict={fit.verdict}
          onJoin={handleJoin}
          reasons={fit.reasons}
        />
        <MembershipSupportCard />
      </div>
    </div>
  );
}
