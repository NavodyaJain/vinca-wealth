// src/app/dashboard/community/[clubId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, MessageCircle, Target, BookOpen, Shield } from 'lucide-react';
import { getClubById } from '@/lib/retirementPersonalityEngine';
import { joinClub, hasJoinedClub, getUserJourney } from '@/lib/userJourneyStorage';

export default function ClubLandingPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId;
  
  const [club, setClub] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const loadClub = () => {
      try {
        const clubData = getClubById(clubId);
        setClub(clubData);
        setIsJoined(hasJoinedClub(clubId));
      } catch (error) {
        console.error('Error loading club:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      loadClub();
    }
  }, [clubId]);

  const handleJoinClub = () => {
    setJoining(true);
    
    // Simulate API call delay
    setTimeout(() => {
      joinClub(clubId);
      setIsJoined(true);
      setJoining(false);
      router.push(`/dashboard/community/${clubId}/dashboard`);
    }, 800);
  };

  const handleGoToDashboard = () => {
    router.push(`/dashboard/community/${clubId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading club...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Club Not Found</h2>
          <p className="text-slate-600 mb-4">The club you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${club.gradient} p-8 sm:p-12 text-white`}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
            <div className="w-full h-full bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{club.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{club.longDescription}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {club.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* What members discuss */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">What Members Discuss</h2>
              </div>
              
              <ul className="space-y-3">
                {club.discussionTopics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                      ✓
                    </span>
                    <span className="text-slate-700">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who this is best for */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Who This Is Best For</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {club.bestFor.map((item, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEBI Compliance Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Educational Community</h3>
                  <p className="text-sm text-amber-700">
                    This is an educational community for peer discussion and knowledge sharing. 
                    Vinca Wealth does not provide investment advice, stock recommendations, or 
                    guaranteed returns. All discussions are for educational purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Join Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{club.shortName}</h3>
                <p className="text-slate-600 text-sm mb-6">{club.description}</p>
                
                {/* Benefits */}
                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>Educational resources</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>Peer discussions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span>Goal planning templates</span>
                  </div>
                </div>
                
                {/* CTA */}
                {isJoined ? (
                  <button
                    onClick={handleGoToDashboard}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${club.gradient} text-white font-semibold hover:opacity-90 transition-opacity`}
                  >
                    Go to Community Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClub}
                    disabled={joining}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${club.gradient} text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-70`}
                  >
                    {joining ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      'Join This Club'
                    )}
                  </button>
                )}
                
                <p className="text-xs text-slate-500 text-center mt-3">
                  Free to join • No commitments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
