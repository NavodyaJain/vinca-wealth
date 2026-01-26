import { useRouter } from 'next/navigation';

export default function ChallengeCard({ challenge, activeChallengeId, onStart, disableStart }) {
  const router = useRouter();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[170px] min-h-[170px] w-full p-4 gap-2 justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900 text-base">{challenge.title}</span>
          <span className="ml-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{challenge.reward}</span>
        </div>
        <div className="text-xs text-slate-500 mb-1">Duration: <span className="font-medium text-slate-700">{challenge.durationDays} days</span> • {challenge.timePerDay}</div>
        <div className="text-xs text-slate-600 mb-1">{challenge.goal}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-3 py-1 text-sm transition disabled:opacity-60"
          onClick={() => onStart && onStart(challenge)}
          disabled={disableStart}
        >
          Start Challenge
        </button>
        <button
          className="flex-1 border border-emerald-600 text-emerald-700 font-semibold rounded-lg px-3 py-1 text-sm hover:bg-emerald-50 transition"
          onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
