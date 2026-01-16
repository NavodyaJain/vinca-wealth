import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function HealthStressCTA() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
            <HeartPulse className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              Your lifestyle can be highly affected by unpredictable health events
            </p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Test your financial readiness plan against <span className="font-medium text-slate-900">Vinca&apos;s Health Stress Test</span> and see how resilient your plan really is.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/health-stress-test"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-green-600 text-white font-semibold px-4 py-2.5 shadow-sm hover:bg-green-700 transition"
        >
          Go to Health Stress Test
        </Link>
      </div>
    </div>
  );
}
