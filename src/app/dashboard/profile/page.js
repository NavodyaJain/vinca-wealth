
'use client';
import { Edit2, User, Check } from 'lucide-react';
// src/app/dashboard/profile/page.js

import { useState, useEffect } from 'react';
import { getActiveTemplateId, getActiveTemplateStarted } from '@/lib/templates/templatesStorage';
import { getTemplateById } from '@/lib/templates/templatesData';
import { useRouter } from 'next/navigation';
import { useCalculator } from '@/context/CalculatorContext';
import UserInputsSummary from '@/components/profile/UserInputsSummary';
import CompactFinancialProfileCard from '@/components/profile/CompactFinancialProfileCard';
import ToolReadingCard from '@/components/profile/ToolReadingCard';

import {
  getUserJourney,
  getToolsCompletionStatus,
  getUserProfile
} from '@/lib/userJourneyStorage';
function ProfilePage() {
    // Active Template State
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [activeTemplateStarted, setActiveTemplateStarted] = useState(null);
    useEffect(() => {
      // Load active template from localStorage
      const id = getActiveTemplateId();
      if (id) {
        setActiveTemplate(getTemplateById(id));
        setActiveTemplateStarted(getActiveTemplateStarted());
      }
    }, []);
  const router = useRouter();
  const { formData } = useCalculator();
  const [journey, setJourney] = useState(null);
  const [completionStatus, setCompletionStatus] = useState(null);
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
      } catch (error) {
        console.error('Error loading journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, []);

  const handleEditName = () => {
    setTempName(userName);
    setEditingName(true);
  };

  const handleSaveName = () => {
    saveUserProfile({ name: tempName });
    setUserName(tempName);
    setEditingName(false);
  };

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
      {/* Active Plan Template Card */}
      {activeTemplate && (
        <div className="w-full bg-white border border-emerald-200 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-4 mb-8 shadow-sm">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg text-slate-900">Active Plan Template:</span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{activeTemplate.badge}</span>
            </div>
            <div className="text-xl font-bold text-emerald-700 mb-1">{activeTemplate.name}</div>
            <div className="text-xs text-slate-500 mb-2">Started: {activeTemplateStarted ? new Date(activeTemplateStarted).toLocaleDateString() : 'Today'}</div>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              onClick={() => router.push(`/dashboard/challenges?pack=${activeTemplate.recommendedChallengeId}`)}
            >
              Start Challenge
            </button>
            <button
              className="w-full sm:w-auto px-5 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
              onClick={() => router.push('/dashboard/templates')}
            >
              Change Template
            </button>
          </div>
        </div>
      )}
      {/* Profile Header Card - Name at top */}
      <div className="bg-green-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-white" />
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
        </div>
      </div>

      {/* SECTION 1: Compact Financial Profile - BELOW HEADER */}
      <section>
        <UserInputsSummary formData={formData} onEditClick={() => setShowEditModal(true)} />
      </section>

      {/* Tool Readings Section */}
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

export default ProfilePage;
