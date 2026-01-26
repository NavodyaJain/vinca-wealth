export default function TaskRowCard({ task, checked, onToggle, disabled }) {
  return (
    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 mb-2 bg-white gap-3">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onToggle}
        disabled={disabled}
        className="accent-emerald-600 w-5 h-5 rounded"
      />
      <div className="flex-1">
        <div className="font-medium text-slate-800 text-sm mb-0.5">{task.title}</div>
        <div className="text-xs text-slate-500 mb-1">{task.description}</div>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
          task.type === 'tool' ? 'bg-blue-50 text-blue-700' :
          task.type === 'setup' ? 'bg-emerald-50 text-emerald-700' :
          task.type === 'learning' ? 'bg-yellow-50 text-yellow-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
        </span>
      </div>
      {task.route && (
        <a
          href={task.route}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
        >
          {task.ctaLabel || 'Open tool'}
        </a>
      )}
      {!task.route && (
        <button
          className="ml-2 px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-50"
          onClick={onToggle}
          disabled={disabled}
        >
          {checked ? 'Completed' : (task.ctaLabel || 'Complete')}
        </button>
      )}
    </div>
  );
}
