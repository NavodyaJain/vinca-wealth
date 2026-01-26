export default function ChallengeProgressBar({ value, max }) {
  return (
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-500 transition-all"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
