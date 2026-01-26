import { useRouter } from 'next/navigation';

export default function ChallengeDayCard({
  dayNumber,
  status,
  onStart,
  onReview,
  lockedReason
}) {
  // status: 'completed' | 'today' | 'locked'
  const router = useRouter();
  let statusLabel = '';
  let statusColor = '';
  if (status === 'completed') {
    statusLabel = 'Completed';
    statusColor = 'bg-emerald-100 text-emerald-700';
  } else if (status === 'today') {
    statusLabel = 'Today';
    statusColor = 'bg-blue-100 text-blue-700';
  } else {
    statusLabel = 'Locked';
    statusColor = 'bg-slate-100 text-slate-500';
  }
  return (
    <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 mb-2 bg-white">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColor}`}>{statusLabel}</span>
        <span className="font-medium text-slate-800">Day {dayNumber}</span>
      </div>
      <div className="flex gap-2">
        {status === 'completed' && (
          <button
            className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-50"
            onClick={onReview}
          >
            Review
          </button>
        )}
        {status === 'today' && (
          <button
            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            onClick={onStart}
          >
            Start Day
          </button>
        )}
        {status === 'locked' && (
          <button
            className="px-3 py-1 rounded-lg border border-slate-300 text-slate-400 text-sm font-semibold cursor-not-allowed"
            disabled
            title={lockedReason || 'Locked until previous day complete'}
          >
            Locked
          </button>
        )}
      </div>
    </div>
  );
}
