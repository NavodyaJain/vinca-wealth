import { useRouter } from 'next/navigation';

export default function TemplateCard({ template }) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[170px] min-h-[170px] w-full p-4 gap-2 justify-between transition hover:shadow-md">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900 text-base">{template.name}</span>
          <span className="ml-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{template.badge}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-1">
          {template.bestFor.map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{tag}</span>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-1">Time to implement: <span className="font-medium text-slate-700">{template.timeToImplement}</span></div>
        <ul className="list-disc pl-5 text-xs text-slate-700 mb-1">
          {template.includes.map((inc, i) => (
            <li key={i}>{inc}</li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 border border-emerald-600 text-emerald-700 font-semibold rounded-lg px-3 py-1 text-sm hover:bg-emerald-50 transition"
          onClick={() => router.push(`/dashboard/templates/${template.id}`)}
        >
          Preview
        </button>
        <button
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-3 py-1 text-sm transition"
          onClick={() => router.push(`/dashboard/templates/${template.id}`)}
        >
          Use this Template
        </button>
      </div>
    </div>
  );
}
