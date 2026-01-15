'use client';

import HealthImpactCharts from './HealthImpactCharts';

// Legacy wrapper: reuse the generic educational charts to keep consistency if this component is rendered.
export default function HealthStressTest() {
  return (
    <div className="space-y-6">
      <HealthImpactCharts />
    </div>
  );
}