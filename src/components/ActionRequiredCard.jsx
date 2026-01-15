import Link from 'next/link';

export default function ActionRequiredCard({ title, message, ctaHref = '/dashboard/financial-readiness', ctaLabel = 'Get Detailed Analysis' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-semibold">!</div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-700 leading-relaxed">{message}</p>
      {ctaLabel && ctaLabel.trim() && (
        <Link href={ctaHref} className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors w-full sm:w-auto">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
