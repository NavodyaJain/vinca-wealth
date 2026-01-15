export default function ToolWelcomeHeader({ toolName, subtitle = 'Answer a few questions to get a personalized assessment.' }) {
  return (
    <div className="text-center mb-10">
      <p className="text-sm font-semibold text-green-700 mb-2">Welcome to Vinca {toolName}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-3">{toolName} Input Experience</h1>
      <p className="text-lg text-slate-600">{subtitle}</p>
    </div>
  );
}
