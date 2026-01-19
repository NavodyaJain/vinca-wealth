// src/app/dashboard/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculator } from '@/context/CalculatorContext';
import UserInputsSummary from '@/components/profile/UserInputsSummary';
import CompactFinancialProfileCard from '@/components/profile/CompactFinancialProfileCard';
import PersonalityCard from '@/components/profile/PersonalityCard';
import PersonalityUnlockCard from '@/components/profile/PersonalityUnlockCard';
import ToolReadingCard from '@/components/profile/ToolReadingCard';
import ClubRecommendationCard from '@/components/profile/ClubRecommendationCard';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import {
  getUserJourney,
  getToolsCompletionStatus,
  unlockPersonalityIfEligible,
  hasJoinedClub,
  getJoinedClubIds,
  getUserProfile,
  saveUserProfile
} from '@/lib/userJourneyStorage';
import { getRecommendedClub, CLUBS } from '@/lib/retirementPersonalityEngine';
import { User, Edit2, Check, Sparkles, Users } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { formData } = useCalculator();
  const [journey, setJourney] = useState(null);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [recommendedClub, setRecommendedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User profile state
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadJourneyData = () => {
      try {
        const journeyData = getUserJourney();
        setJourney(journeyData);
        
        const status = getToolsCompletionStatus();
        setCompletionStatus(status);
        
        // Load user profile
        const profile = getUserProfile();
        setUserName(profile.name || '');
        
        // Load joined clubs
        const joinedIds = getJoinedClubIds();
        const joinedClubsList = joinedIds
          .map(id => Object.values(CLUBS).find(c => c.id === id))
          .filter(Boolean);
        setJoinedClubs(joinedClubsList);
        
        // Try to unlock personality if eligible
        const unlockedPersonality = unlockPersonalityIfEligible();
        
        if (unlockedPersonality) {
          setPersonality(unlockedPersonality);
          const club = getRecommendedClub(unlockedPersonality.key);
          setRecommendedClub(club);
        } else if (journeyData.personalityUnlocked && journeyData.personality) {
          setPersonality(journeyData.personality);
          const club = getRecommendedClub(journeyData.personality.key);
          setRecommendedClub(club);
        }
      } catch (error) {
        console.error('Error loading journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, []);

  const handleCompleteTools = () => {
    // Find first incomplete tool
    if (!completionStatus?.financialReadiness) {
      router.push('/dashboard/financial-readiness');
    } else if (!completionStatus?.earlyRetirement) {
      router.push('/dashboard/financial-readiness');
    } else if (!completionStatus?.lifestylePlanner) {
      router.push('/dashboard/lifestyle-planner');
    } else if (!completionStatus?.healthStress) {
      router.push('/dashboard/health-stress');
    }
  };
  
  const handleEditName = () => {
    setTempName(userName);
    setEditingName(true);
  };
  
  const handleSaveName = () => {
    saveUserProfile({ name: tempName });
    setUserName(tempName);
    setEditingName(false);
  };
  
  // Get clubs user hasn't joined yet for "Explore Other Clubs"
  const otherClubs = Object.values(CLUBS).filter(
    club => !joinedClubs.some(jc => jc.id === club.id)
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Profile Header Card - Name & Personality Badge (now at top, green theme) */}
      <div className="bg-green-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {personality ? (
              <span className="text-3xl">{personality.icon}</span>
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {userName ? `Hello, ${userName}` : 'Your Retirement Profile'}
                </h1>
                <button
                  onClick={handleEditName}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Edit name"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {personality && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Personality Unlocked</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: Compact Financial Profile - BELOW HEADER */}
      <section>
        <UserInputsSummary formData={formData} onEditClick={() => setShowEditModal(true)} />
      </section>

      {/* Tool Readings Section - MOVED ABOVE PERSONALITY */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Your Tool Readings</h2>
          <p className="text-sm text-slate-500">
            Insights from each planning tool you've saved
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolReadingCard
            title="Financial Readiness"
            icon="💰"
            isCompleted={completionStatus?.financialReadiness}
            reading={journey?.readings?.financialReadiness}
            toolPath="/dashboard/financial-readiness"
            accentColor="indigo"
          />
          <ToolReadingCard
            title="Early Retirement"
            icon="🚀"
            isCompleted={completionStatus?.earlyRetirement}
            reading={journey?.readings?.earlyRetirement}
            toolPath="/dashboard/financial-readiness"
            accentColor="emerald"
          />
          <ToolReadingCard
            title="Lifestyle Planner"
            icon="✨"
            isCompleted={completionStatus?.lifestylePlanner}
            reading={journey?.readings?.lifestylePlanner}
            toolPath="/dashboard/lifestyle-planner"
            accentColor="purple"
          />
          <ToolReadingCard
            title="Health Stress Test"
            icon="🩺"
            isCompleted={completionStatus?.healthStress}
            reading={journey?.readings?.healthStress}
            toolPath="/dashboard/health-stress"
            accentColor="blue"
          />
        </div>
      </section>

      {/* Personality Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Your Retirement Personality</h2>
          <p className="text-sm text-slate-500">
            {personality 
              ? "Your unique investor profile based on your tool readings"
              : "Complete all 4 tools to unlock your personality"
            }
          </p>
        </div>
        
        {personality ? (
          <PersonalityCard personality={personality} isUnlocked={true} />
        ) : (
          <PersonalityUnlockCard 
            completionStatus={completionStatus} 
            onCompleteTools={handleCompleteTools}
          />
        )}
      </section>

      {/* Joined Clubs Section */}
      {joinedClubs.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Your Communities</h2>
            <p className="text-sm text-slate-500">
              Clubs you've joined to connect with like-minded investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedClubs.map((club) => (
              <div 
                key={club.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/community/${club.id}/dashboard`)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${club.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-2xl">{club.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{club.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{club.tagline}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                      <Users className="w-3 h-3" />
                      <span>Member</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Club (only if has personality but hasn't joined recommended) */}
      {personality && recommendedClub && !joinedClubs.some(c => c.id === recommendedClub.id) && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Recommended For You</h2>
            <p className="text-sm text-slate-500">
              Based on your {personality.name} personality
            </p>
          </div>
          
          <div className="max-w-xl">
            <ClubRecommendationCard 
              club={recommendedClub} 
              hasJoined={false}
            />
          </div>
        </section>
      )}

      {/* Explore Other Clubs */}
      {otherClubs.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Explore Other Clubs</h2>
            <p className="text-sm text-slate-500">
              Discover more communities that match your interests
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherClubs.slice(0, 6).map((club) => (
              <div 
                key={club.id}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => router.push(`/dashboard/community/${club.id}`)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${club.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-xl">{club.icon}</span>
                  </div>
                  <h3 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{club.name}</h3>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{club.tagline}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Getting Started Section (if no tools completed) */}
      {completionStatus?.completedCount === 0 && (
        <section>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Start Your Retirement Journey
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Use our planning tools to build your personalized retirement profile. 
              Each tool reveals new insights about your financial future.
            </p>
            <button
              onClick={() => router.push('/dashboard/financial-readiness')}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start with Financial Readiness
            </button>
          </div>
        </section>
      )}

      {/* Profile Edit Modal */}
      {showEditModal && (
        <ProfileEditModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  );
}