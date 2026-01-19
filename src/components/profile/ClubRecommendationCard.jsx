// src/components/profile/ClubRecommendationCard.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Users } from 'lucide-react';

export default function ClubRecommendationCard({ club, hasJoined = false }) {
  const router = useRouter();

  if (!club) return null;

  const {
    id,
    name,
    description,
    tags,
    gradient
  } = club;

  const gradientClasses = {
    'from-orange-500 to-red-500': 'from-orange-500 to-red-500',
    'from-purple-500 to-pink-500': 'from-purple-500 to-pink-500',
    'from-blue-500 to-indigo-500': 'from-blue-500 to-indigo-500',
    'from-green-500 to-emerald-500': 'from-green-500 to-emerald-500',
    'from-amber-500 to-yellow-500': 'from-amber-500 to-yellow-500'
  };

  const handleExploreClub = () => {
    router.push(`/dashboard/community/${id}`);
  };

  const handleGoToDashboard = () => {
    router.push(`/dashboard/community/${id}/dashboard`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header with gradient */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      
      <div className="p-6">
        {/* Section label */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Users className="w-4 h-4" />
          <span>Recommended Club</span>
        </div>
        
        {/* Club name */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{name}</h3>
        
        {/* Description */}
        <p className="text-slate-600 mb-4 line-clamp-2">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* CTA buttons */}
        {hasJoined ? (
          <button
            onClick={handleGoToDashboard}
            className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
          >
            Go to Community Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleExploreClub}
            className="w-full py-3 px-4 rounded-xl border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Explore Club
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
