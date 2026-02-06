'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ToolsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to financial readiness by default
    router.push('/tools/financial-readiness');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-600">Loading tools...</p>
    </div>
  );
}
