export default function TemplatePreviewHeader({ template }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        {template.name}
        <span className="bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{template.badge}</span>
      </h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {template.bestFor.map((tag, i) => (
          <span key={i} className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{tag}</span>
        ))}
      </div>
      <div className="text-slate-600 mb-2 text-sm">{template.description}</div>
      <div className="text-xs text-slate-500 mb-1">Time to implement: <span className="font-medium text-slate-700">{template.timeToImplement}</span></div>
    </div>
  );
}
