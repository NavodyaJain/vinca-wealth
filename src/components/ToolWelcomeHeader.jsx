export default function ToolWelcomeHeader({ toolName, subtitle = 'Fill your input once and use any tool.' }) {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3">Welcome to Vinca Wealth — {toolName}</h1>
      <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
  );
}
