export default function ToolWelcomeHeader({ toolName, subtitle = 'Answer a few questions to get a personalized assessment.' }) {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <p className="text-xs sm:text-sm font-semibold text-green-700 mb-2 uppercase tracking-[0.1em]">Welcome to Vinca {toolName}</p>
      <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3">{toolName} Input Experience</h1>
      <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
  );
}
