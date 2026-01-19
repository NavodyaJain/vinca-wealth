// src/components/profile/PersonalityCard.jsx
'use client';

export default function PersonalityCard({ personality, isUnlocked = false }) {
  if (!personality) return null;

  const {
    name,
    tagline,
    traits,
    icon,
    iconSecondary,
    gradient,
    bgGradient,
    accentColor
  } = personality;

  // Gradient classes mapping
  const gradientClasses = {
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-500',
    teal: 'from-teal-500 to-cyan-500',
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    amber: 'from-amber-500 to-yellow-500',
    rose: 'from-rose-500 to-red-500',
    slate: 'from-slate-500 to-gray-600'
  };

  const bgGradientClasses = {
    orange: 'from-orange-50 to-red-50',
    purple: 'from-purple-50 to-pink-50',
    teal: 'from-teal-50 to-cyan-50',
    blue: 'from-blue-50 to-indigo-50',
    green: 'from-green-50 to-emerald-50',
    amber: 'from-amber-50 to-yellow-50',
    rose: 'from-rose-50 to-red-50',
    slate: 'from-slate-50 to-gray-100'
  };

  const chipColors = {
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgGradientClasses[accentColor] || bgGradientClasses.slate} border border-white/50 shadow-xl animate-fade-in`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${gradientClasses[accentColor] || gradientClasses.slate} rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2`} />
      </div>
      
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Icon Badge */}
          <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradientClasses[accentColor] || gradientClasses.slate} flex items-center justify-center shadow-lg`}>
            <span className="text-3xl sm:text-4xl">{icon}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{iconSecondary}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Your Retirement Personality
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {name}
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 mb-4 italic">
              "{tagline}"
            </p>
            
            {/* Trait chips */}
            <div className="flex flex-wrap gap-2">
              {traits.map((trait, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${chipColors[accentColor] || chipColors.slate}`}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Celebration badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-slate-700 shadow-sm">
            🎉 Unlocked
          </span>
        </div>
      </div>
    </div>
  );
}
