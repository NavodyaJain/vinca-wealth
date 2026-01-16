import { Lock } from 'lucide-react';

const PremiumBlurGate = ({
  isLocked = false,
  title,
  subtitle,
  buttonText = 'Upgrade to Pro',
  pillText = 'PRO · Premium insight',
  onUpgradeClick,
  className = '',
  children
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className={isLocked ? 'blur-md opacity-70 pointer-events-none select-none' : ''}>
        {children}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-emerald-100 p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-700 mt-1" />
              <div>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {pillText}
                </div>
                <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 max-w-2xl">{subtitle}</p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={onUpgradeClick}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumBlurGate;
