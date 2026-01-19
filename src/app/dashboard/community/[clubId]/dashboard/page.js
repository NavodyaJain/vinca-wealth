// src/app/dashboard/community/[clubId]/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Users, 
  Bell,
  Sparkles,
  Shield,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';
import { getClubById } from '@/lib/retirementPersonalityEngine';
import { hasJoinedClub, joinClub } from '@/lib/userJourneyStorage';

export default function CommunityDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId;
  
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClub = () => {
      try {
        const clubData = getClubById(clubId);
        setClub(clubData);
        
        // Auto-join if not already joined
        if (!hasJoinedClub(clubId)) {
          joinClub(clubId);
        }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Community Not Found</h2>
          <p className="text-slate-600 mb-4">The community you're looking for doesn't exist.</p>
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

  // Mock data for the dashboard
  const weeklyPrompts = [
    {
      id: 1,
      title: "Share your monthly savings milestone",
      description: "What percentage of your income did you save this month?",
      responses: 24,
      isNew: true
    },
    {
      id: 2,
      title: "What's your biggest financial lesson from 2025?",
      description: "Share insights that helped you on your journey",
      responses: 47,
      isNew: false
    },
    {
      id: 3,
      title: "How do you stay disciplined with SIP?",
      description: "Share your automation tips and mental tricks",
      responses: 31,
      isNew: false
    }
  ];

  const memberMilestones = [
    { icon: '🎯', text: "Rajesh completed 5 years of consistent SIP", time: "2 hours ago" },
    { icon: '💰', text: "Priya reached her first ₹25L corpus", time: "5 hours ago" },
    { icon: '🚀', text: "Amit optimized his surplus by 15%", time: "1 day ago" },
    { icon: '📊', text: "Sneha completed her retirement planning review", time: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${club.gradient} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome to {club.name}</h1>
              <p className="text-white/80">Your community of like-minded investors</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>248 Members</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEBI Compliance Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Educational Community:</strong> This is a peer learning space. Vinca does not provide investment advice or recommendations.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Discussions - Coming Soon */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Trending Discussions</h2>
                    <p className="text-sm text-slate-500">What members are talking about</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  Coming Soon
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Discussions Coming Soon</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  We're building a space for meaningful peer discussions. 
                  Stay tuned for topic-based threads and community insights.
                </p>
              </div>
            </div>

            {/* Weekly Prompts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Weekly Prompts</h2>
                  <p className="text-sm text-slate-500">Share your journey with the community</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {weeklyPrompts.map((prompt) => (
                  <div 
                    key={prompt.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-900">{prompt.title}</h3>
                          {prompt.isNew && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{prompt.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{prompt.responses}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View all prompts →
              </button>
            </div>

            {/* Member Milestones */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Member Milestones</h2>
                  <p className="text-sm text-slate-500">Celebrating community achievements</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {memberMilestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
                  >
                    <span className="text-xl">{milestone.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{milestone.text}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {milestone.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Your Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500">Posts</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500">Comments</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">1</div>
                  <div className="text-xs text-slate-500">Days Active</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">🌱</div>
                  <div className="text-xs text-slate-500">New Member</div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
              <div className="space-y-3">
                {/* Getting Started Guide */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Community Library</div>
                    <div className="text-xs text-slate-500">Explore guides & resources</div>
                  </div>
                </div>
                {/* Community Events */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Community Events</div>
                    <div className="text-xs text-slate-500">See upcoming events</div>
                  </div>
                </div>
                {/* Goal Templates */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Goal Templates</div>
                    <div className="text-xs text-slate-500">Plan your journey</div>
                  </div>
                </div>
                {/* Member Stories */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Member Stories</div>
                    <div className="text-xs text-slate-500">Get inspired</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-slate-100 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Be respectful and supportive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Share experiences, not advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>No stock tips or recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Keep discussions educational</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
