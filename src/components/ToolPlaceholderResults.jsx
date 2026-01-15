export default function ToolPlaceholderResults({ toolName }) {
  return (
    <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2">
      <h3 className="text-lg font-semibold text-slate-900">{toolName} results are on the way</h3>
      <p className="text-slate-600">We will soon add deep insights here. For now, your inputs are saved to keep the experience consistent.</p>
    </div>
  );
}
