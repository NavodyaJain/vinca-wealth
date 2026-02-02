"use client";
import React, { useState } from 'react';
import { MessageSquare, Star, Heart } from 'lucide-react';

const FEATURES = [
  'Sprints',
  'Reflections',
  'Curations',
  'Calculators',
  'Dashboard',
  'Others'
];

const initialOpinions = [
  {
    id: 1,
    title: 'Mobile App Development',
    description: 'Native iOS and Android applications',
    votes: 42,
    userVoted: false,
    type: 'product',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Real-time Portfolio Analytics',
    description: 'Live tracking of investment performance',
    votes: 38,
    userVoted: false,
    type: 'product',
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 3,
    title: 'AI Financial Assistant',
    description: '24/7 personalized financial guidance',
    votes: 31,
    userVoted: false,
    type: 'product',
    createdAt: '2024-01-25T09:15:00Z'
  }
];

const sortOpinions = (items) => {
  return [...items].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

const validateFeedback = (type, state) => {
  if (type === 'overall') return state.overallRating > 0;
  if (type === 'feature') return state.featureRating > 0 && state.selectedFeature;
  return false;
};

const FeedbackOpinionsPage = () => {
  const [state, setState] = useState({
    activeTab: 'feedback',
    // Feedback Section
    overallRating: 0,
    overallComment: '',
    selectedFeature: '',
    featureRating: 0,
    featureComment: '',
    allFeedbacks: [], // {type, rating, comment, feature, createdAt}
    // Opinions Section
    opinions: sortOpinions(initialOpinions),
    isModalOpen: false,
    problemTitle: '',
    problemDescription: '',
    loading: false,
    feedbackLoading: false,
    feedbackSuccess: false,
    opinionSuccess: false
  });

  // --- Tab Switching ---
  const handleTabChange = (tab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  // --- Star Click ---
  const handleStarClick = (rating, type) => {
    if (type === 'overall') {
      setState((prev) => ({ ...prev, overallRating: rating }));
    } else if (type === 'feature') {
      setState((prev) => ({ ...prev, featureRating: rating }));
    }
  };

  // --- Feedback Submit ---
  const handleFeedbackSubmit = (type) => {
    if (!validateFeedback(type, state)) return;
    setState((prev) => ({ ...prev, feedbackLoading: true }));
    setTimeout(() => {
      const feedback = {
        id: Date.now(),
        type,
        rating: type === 'overall' ? state.overallRating : state.featureRating,
        comment: type === 'overall' ? state.overallComment : state.featureComment,
        feature: type === 'feature' ? state.selectedFeature : undefined,
        isAnonymous: true,
        createdAt: new Date().toISOString()
      };
      setState((prev) => ({
        ...prev,
        allFeedbacks: [feedback, ...prev.allFeedbacks],
        overallRating: type === 'overall' ? 0 : prev.overallRating,
        overallComment: type === 'overall' ? '' : prev.overallComment,
        featureRating: type === 'feature' ? 0 : prev.featureRating,
        featureComment: type === 'feature' ? '' : prev.featureComment,
        selectedFeature: type === 'feature' ? '' : prev.selectedFeature,
        feedbackLoading: false,
        feedbackSuccess: true
      }));
      setTimeout(() => setState((prev) => ({ ...prev, feedbackSuccess: false })), 1500);
    }, 900);
  };

  // --- Vote Handler ---
  const handleVote = (opinionId) => {
    setState((prev) => {
      const updated = prev.opinions.map((item) => {
        if (item.id === opinionId) {
          return {
            ...item,
            votes: item.userVoted ? item.votes - 1 : item.votes + 1,
            userVoted: !item.userVoted
          };
        }
        return item;
      });
      return {
        ...prev,
        opinions: sortOpinions(updated)
      };
    });
  };

  // --- Problem Suggestion Modal ---
  const handleProblemSubmit = () => {
    if (!state.problemTitle.trim() || !state.problemDescription.trim()) return;
    setState((prev) => ({ ...prev, loading: true }));
    setTimeout(() => {
      const newProblem = {
        id: Date.now(),
        title: state.problemTitle,
        description: state.problemDescription,
        votes: 0,
        userVoted: false,
        type: 'user-suggested',
        createdAt: new Date().toISOString()
      };
      const updated = sortOpinions([newProblem, ...state.opinions]);
      setState((prev) => ({
        ...prev,
        opinions: updated,
        isModalOpen: false,
        problemTitle: '',
        problemDescription: '',
        loading: false,
        opinionSuccess: true
      }));
      setTimeout(() => setState((prev) => ({ ...prev, opinionSuccess: false })), 1500);
    }, 900);
  };

  // --- UI Components ---
  return (
    <div className="feedback-opinions-root">
      <div className="tabs-bar">
        <button
          className={`tab-btn${state.activeTab === 'feedback' ? ' active' : ''}`}
          onClick={() => handleTabChange('feedback')}
        >
          Feedback
        </button>
        <button
          className={`tab-btn${state.activeTab === 'opinions' ? ' active' : ''}`}
          onClick={() => handleTabChange('opinions')}
        >
          Opinions
        </button>
      </div>
      <div className="tab-content">
        {state.activeTab === 'feedback' ? (
          <FeedbackSection
            state={state}
            setState={setState}
            handleStarClick={handleStarClick}
            handleFeedbackSubmit={handleFeedbackSubmit}
          />
        ) : (
          <OpinionsSection
            state={state}
            setState={setState}
            handleVote={handleVote}
            handleProblemSubmit={handleProblemSubmit}
          />
        )}
      </div>
      <style>{`
        :root {
          --vinca-green: #10B981;
          --vinca-green-dark: #059669;
          --vinca-green-light: #D1FAE5;
          --soft-mint: #ECFDF5;
          --light-mint: #D1FAE5;
          --grey-light: #F9FAFB;
          --grey-medium: #E5E7EB;
          --grey-dark: #374151;
          --grey-text: #6B7280;
          --success: #10B981;
          --inactive: #9CA3AF;
        }
        .feedback-opinions-root {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 16px 48px 16px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .tabs-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tab-btn {
          flex: 1;
          padding: 12px 0;
          border: none;
          border-radius: 12px 12px 0 0;
          background: var(--grey-light);
          color: var(--grey-dark);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .tab-btn.active {
          background: var(--vinca-green);
          color: #fff;
        }
        .tab-content {
          background: #fff;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 32px 24px 24px 24px;
          min-height: 480px;
        }
        @media (max-width: 700px) {
          .tab-content { padding: 18px 6px 12px 6px; }
        }
      `}</style>
    </div>
  );
};

// --- Feedback Section ---
function FeedbackSection({ state, setState, handleStarClick, handleFeedbackSubmit }) {
  return (
    <div className="feedback-section">
      <div className="feedback-cards">
        <OverallFeedbackCard
          rating={state.overallRating}
          comment={state.overallComment}
          setState={setState}
          handleStarClick={handleStarClick}
          handleSubmit={() => handleFeedbackSubmit('overall')}
          loading={state.feedbackLoading}
          success={state.feedbackSuccess}
        />
        <FeatureFeedbackCard
          selectedFeature={state.selectedFeature}
          rating={state.featureRating}
          comment={state.featureComment}
          setState={setState}
          handleStarClick={handleStarClick}
          handleSubmit={() => handleFeedbackSubmit('feature')}
          loading={state.feedbackLoading}
          success={state.feedbackSuccess}
        />
      </div>
      <FeedbackHistory feedbacks={state.allFeedbacks} />
      <style>{`
        .feedback-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .feedback-cards {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .feedback-cards { flex-direction: column; gap: 18px; }
        }
      `}</style>
    </div>
  );
}

function OverallFeedbackCard({ rating, comment, setState, handleStarClick, handleSubmit, loading, success }) {
  return (
    <div className="feedback-card">
      <h3>Overall Experience</h3>
      <StarRating
        value={rating}
        onChange={(val) => handleStarClick(val, 'overall')}
      />
      <textarea
        className="feedback-textarea"
        placeholder="Share your overall experience (optional)"
        maxLength={1500}
        value={comment}
        onChange={e => setState(prev => ({ ...prev, overallComment: e.target.value }))}
        disabled={loading}
      />
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading || rating === 0}
      >
        {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Feedback'}
      </button>
      <style>{`
        .feedback-card {
          flex: 1;
          min-width: 320px;
          background: var(--grey-light);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }
        .feedback-card h3 {
          margin: 0 0 8px 0;
          font-size: 1.15rem;
          color: var(--grey-dark);
        }
        .feedback-textarea {
          min-height: 64px;
          border-radius: 8px;
          border: 1px solid var(--grey-medium);
          padding: 10px 12px;
          font-size: 1rem;
          resize: vertical;
          background: #fff;
        }
        .submit-btn {
          align-self: flex-end;
          background: var(--vinca-green);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:disabled {
          background: var(--inactive);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function FeatureFeedbackCard({ selectedFeature, rating, comment, setState, handleStarClick, handleSubmit, loading, success }) {
  return (
    <div className="feedback-card">
      <h3>Feature Feedback</h3>
      <select
        className="feature-select"
        value={selectedFeature}
        onChange={e => setState(prev => ({ ...prev, selectedFeature: e.target.value }))}
        disabled={loading}
      >
        <option value="">Select Feature</option>
        {FEATURES.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <StarRating
        value={rating}
        onChange={(val) => handleStarClick(val, 'feature')}
      />
      <textarea
        className="feedback-textarea"
        placeholder="Share your thoughts on this feature (optional)"
        maxLength={1500}
        value={comment}
        onChange={e => setState(prev => ({ ...prev, featureComment: e.target.value }))}
        disabled={loading}
      />
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading || rating === 0 || !selectedFeature}
      >
        {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Feedback'}
      </button>
      <style>{`
        .feature-select {
          border-radius: 8px;
          border: 1px solid #dbeafe;
          padding: 8px 12px;
          font-size: 1rem;
          background: #fff;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={`star${(hovered || value) >= i ? ' filled' : ''}`}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          tabIndex={0}
          role="button"
          aria-label={`Rate ${i} star${i>1?'s':''}`}
        >
          <Star size={28} />
        </span>
      ))}
      <style>{`
        .star-rating {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }
        .star {
          color: var(--grey-medium);
          cursor: pointer;
          transition: color 0.18s, transform 0.18s;
        }
        .star.filled {
          color: var(--vinca-green);
          transform: scale(1.12);
        }
        .star:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

function FeedbackHistory({ feedbacks }) {
  if (!feedbacks.length) {
    return (
      <div className="empty-state">
        <MessageSquare size={36} />
        <h3>No Feedback Yet</h3>
        <p>Be the first to share your thoughts</p>
        <style>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: #64748b;
            margin-top: 32px;
          }
          .empty-state h3 { margin: 0; font-size: 1.1rem; }
          .empty-state p { margin: 0; font-size: 0.98rem; }
        `}</style>
      </div>
    );
  }
  return (
    <div className="feedback-history">
      {feedbacks.map(fb => (
        <div className="feedback-item" key={fb.id}>
          <div className="feedback-meta">
            <StarRatingStatic value={fb.rating} />
            {fb.type === 'feature' && (
              <span className="feature-label">{fb.feature}</span>
            )}
            <span className="timestamp">{new Date(fb.createdAt).toLocaleString()}</span>
          </div>
          {fb.comment && <div className="feedback-comment">{fb.comment}</div>}
        </div>
      ))}
      <style>{`
        .feedback-history {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .feedback-item {
          background: #f4f7fa;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 18px 16px 12px 16px;
        }
        .feedback-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .feature-label {
          background: #2563eb;
          color: #fff;
          border-radius: 6px;
          padding: 2px 10px;
          font-size: 0.92rem;
        }
        .timestamp {
          color: #64748b;
          font-size: 0.92rem;
          margin-left: auto;
        }
        .feedback-comment {
          color: #1a2540;
          font-size: 1.01rem;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

function StarRatingStatic({ value }) {
  return (
    <span className="star-static">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={20} color={i <= value ? '#2563eb' : '#b6c2d9'} fill={i <= value ? '#2563eb' : 'none'} />
      ))}
      <style>{`
        .star-static { display: flex; gap: 2px; }
        .star-static svg {
          color: var(--vinca-green);
        }
      `}</style>
    </span>
  );
}

// --- Opinions Section ---
function OpinionsSection({ state, setState, handleVote, handleProblemSubmit }) {
  // Floating button handler uses existing modal logic
  const handleSuggestClick = () => setState(prev => ({ ...prev, isModalOpen: true }));
  const pipelineFeatures = state.opinions.filter(o => o.type === 'product');
  const userSuggestions = state.opinions.filter(o => o.type === 'user-suggested');
  return (
    <div className="opinions-layout-container">
      <div className="opinions-header">
        <h1>Opinions</h1>
      </div>
      <div className="opinions-grid-wrapper">
        <div className="opinions-grid">
          {/* LEFT COLUMN: Pipeline Features */}
          <div className="grid-column pipeline-column">
            <div className="section-header">
              <h2 className="section-title">What We're Working On</h2>
              <p className="section-subtitle">Vote to influence our development priorities</p>
            </div>
            <div className="pipeline-cards">
              {pipelineFeatures.map(op => (
                <OpinionCard key={op.id} opinion={op} handleVote={handleVote} />
              ))}
            </div>
          </div>
          {/* RIGHT COLUMN: User Suggestions */}
          <div className="grid-column suggestions-column">
            <div className="section-header">
              <h2 className="section-title">User Suggestions</h2>
              <p className="section-subtitle">Community-driven problem ideas</p>
            </div>
            {userSuggestions.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">💡</div>
                <h3 className="empty-state-title">No suggestions yet</h3>
                <p className="empty-state-message">
                  Be the first to suggest a problem we should solve
                </p>
              </div>
            ) : (
              <div className="suggestion-cards">
                {userSuggestions.map(op => (
                  <OpinionCard key={op.id} opinion={op} handleVote={handleVote} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Action Button for Suggest a Problem */}
      <FloatingSuggestButton onClick={handleSuggestClick} />
      {/* Modal remains unchanged */}
      <ProblemSuggestionModal
        open={state.isModalOpen}
        onClose={() => setState(prev => ({ ...prev, isModalOpen: false }))}
        title={state.problemTitle}
        description={state.problemDescription}
        setState={setState}
        loading={state.loading}
        handleSubmit={handleProblemSubmit}
      />
      <style>{`
        .opinions-layout-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .opinions-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .opinions-header h1 {
          margin: 0;
          color: #374151;
          font-size: 1.75rem;
          font-weight: 700;
        }
        .opinions-grid-wrapper {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          background-color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
          padding: 24px;
          margin-top: 20px;
        }
        .opinions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .grid-column {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
        }
        .section-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
        }
        .section-title {
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .section-subtitle {
          color: #6B7280;
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.4;
        }
        .pipeline-cards,
        .suggestion-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }
        .pipeline-cards .feature-card,
        .suggestion-cards .suggestion-card {
          border: 1px solid #F3F4F6;
          border-radius: 12px;
          padding: 20px;
          background-color: #FFFFFF;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        .pipeline-cards .feature-card:hover,
        .suggestion-cards .suggestion-card:hover {
          border-color: #D1FAE5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        @media (min-width: 769px) {
          .grid-column.pipeline-column {
            border-right: 1px solid #F3F4F6;
            padding-right: 32px;
          }
          .grid-column.suggestions-column {
            padding-left: 32px;
          }
        }
        @media (max-width: 1024px) {
          .opinions-grid {
            gap: 24px;
          }
          .opinions-grid-wrapper {
            padding: 20px;
          }
        }
        @media (max-width: 768px) {
          .opinions-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .opinions-layout-container {
            padding: 0 16px;
          }
          .floating-suggest-btn {
            bottom: 80px;
          }
          .grid-column.pipeline-column {
            border-right: none;
            padding-right: 0;
          }
          .grid-column.suggestions-column {
            padding-left: 0;
          }
        }
        .empty-state-card {
          border: 1px solid #F3F4F6;
          border-radius: 12px;
          padding: 40px 24px;
          background-color: #F9FAFB;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        .empty-state-icon {
          font-size: 2rem;
          margin-bottom: 16px;
          opacity: 0.6;
        }
        .empty-state-title {
          color: #374151;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        .empty-state-message {
          color: #6B7280;
          font-size: 0.875rem;
          max-width: 300px;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
// Floating Action Button for Suggest a Problem
function FloatingSuggestButton({ onClick }) {
  return (
    <>
      <button
        className="floating-suggest-btn"
        onClick={onClick}
        aria-label="Suggest a Problem"
        title="Suggest a Problem"
      >
        <span className="plus-icon">+</span>
      </button>
      <style>{`
        .floating-suggest-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #10B981;
          border: none;
          color: white;
          font-size: 28px;
          font-weight: 300;
          line-height: 1;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3), 0 2px 4px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 100;
        }
        .floating-suggest-btn:hover {
          background-color: #059669;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4), 0 3px 6px rgba(0, 0, 0, 0.1);
        }
        .floating-suggest-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3), 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .plus-icon {
          display: block;
          margin-top: -2px;
        }
        @media (max-width: 768px) {
          .floating-suggest-btn {
            width: 52px;
            height: 52px;
            bottom: 20px;
            right: 20px;
            font-size: 26px;
          }
        }
      `}</style>
    </>
  );
}

function WhatWereWorkingOn({ opinions, handleVote }) {
  return (
    <div className="what-working-on">
      <h3>What We're Working On</h3>
      {opinions.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={32} />
          <h4>No Items Yet</h4>
        </div>
      ) : (
        <div className="opinion-list">
          {opinions.map(op => (
            <OpinionCard key={op.id} opinion={op} handleVote={handleVote} />
          ))}
        </div>
      )}
      <style>{`
        .what-working-on {
          background: #f8fafc;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 24px 20px 20px 20px;
        }
        .opinion-list { display: flex; flex-direction: column; gap: 18px; }
        .what-working-on h3 { margin: 0 0 16px 0; color: #1a2540; font-size: 1.15rem; }
      `}</style>
    </div>
  );
}

function UserSuggestions({ opinions, handleVote }) {
  if (!opinions.length) return null;
  return (
    <div className="user-suggestions">
      <h4>User Suggestions</h4>
      <div className="opinion-list">
        {opinions.map(op => (
          <OpinionCard key={op.id} opinion={op} handleVote={handleVote} />
        ))}
      </div>
      <style>{`
        .user-suggestions {
          background: #f8fafc;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 18px 16px 12px 16px;
          margin-top: 18px;
        }
        .user-suggestions h4 { margin: 0 0 10px 0; color: #1a2540; font-size: 1.05rem; }
        .opinion-list { display: flex; flex-direction: column; gap: 14px; }
      `}</style>
    </div>
  );
}

function OpinionCard({ opinion, handleVote }) {
  return (
    <div className="opinion-card">
      <div className="opinion-header">
        <span className="opinion-title">{opinion.title}</span>
        <div className="vote-section">
          <button
            className="like-btn"
            onClick={() => handleVote(opinion.id)}
            aria-pressed={opinion.userVoted}
            title="Like this feedback"
          >
            <Heart
              size={16}
              fill={opinion.userVoted ? '#ef4444' : 'none'}
              stroke={opinion.userVoted ? '#ef4444' : '#cbd5e1'}
            />
          </button>
          <button
            className={`vote-btn${opinion.userVoted ? ' voted' : ''}`}
            onClick={() => handleVote(opinion.id)}
            aria-pressed={opinion.userVoted}
          >
            <span className="vote-count">{opinion.votes}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={opinion.userVoted ? '#2563eb' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V6M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </div>
      <div className="opinion-desc">{opinion.description}</div>
        {/* Removed timestamp from display as requested */}
      <style>{`
        .opinion-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
          padding: 16px 14px 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s ease-in-out;
        }
        .opinion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .opinion-card.top-ranked {
          border-left: 4px solid var(--vinca-green);
          background-color: #F0F9FF;
        }
        .opinion-header {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: space-between;
        }
        .vote-section {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }
        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
          opacity: 0.5;
          flex-shrink: 0;
        }
        .like-btn:hover {
          opacity: 0.8;
          background: rgba(239, 68, 68, 0.08);
        }
        .like-btn[aria-pressed="true"] {
          opacity: 1;
        }
        .opinion-title {
          font-weight: 600;
          color: var(--grey-dark);
          font-size: 1.05rem;
        }
        .vote-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--grey-light);
          border: none;
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: var(--vinca-green);
          transition: background-color 0.15s ease, color 0.18s, box-shadow 0.18s, transform 0.1s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .vote-btn.voted {
          background: var(--vinca-green);
          color: #fff;
          box-shadow: 0 2px 8px rgba(16,185,129,0.08);
        }
        .vote-btn:active {
          transform: scale(0.95);
        }
        .vote-count {
          font-size: 1.05rem;
          font-weight: 700;
          transition: color 0.3s ease;
        }
        .vote-count.increasing {
          color: var(--vinca-green);
          font-weight: 600;
        }
        .opinion-desc {
          color: var(--grey-dark);
          font-size: 0.98rem;
        }
        .opinion-meta {
          color: var(--grey-text);
          font-size: 0.92rem;
        }
        .status-indicator {
          background-color: var(--soft-mint);
          color: #065F46;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .top-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: var(--vinca-green);
          font-weight: 600;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}

function SuggestProblemButton({ onClick }) {
  return (
    <button className="suggest-problem-btn" onClick={onClick}>
      <MessageSquare size={20} style={{ marginRight: 8 }} />
      Suggest a Problem
      <style>{`
        .suggest-problem-btn {
          background: var(--vinca-green);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background 0.18s;
        }
        .suggest-problem-btn:active {
          background: var(--vinca-green-dark);
        }
      `}</style>
    </button>
  );
}

function ProblemSuggestionModal({ open, onClose, title, description, setState, loading, handleSubmit }) {
  if (!open) return null;
  const titleLimit = 100;
  const descLimit = 1000;
  const titleErr = !title.trim() && 'Title required';
  const descErr = !description.trim() && 'Description required';
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Suggest a Problem</h3>
        <input
          className="modal-input"
          type="text"
          maxLength={titleLimit}
          placeholder="Problem Title (max 100 chars)"
          value={title}
          onChange={e => setState(prev => ({ ...prev, problemTitle: e.target.value }))}
          disabled={loading}
        />
        {titleErr && <div className="modal-err">{titleErr}</div>}
        <textarea
          className="modal-textarea"
          maxLength={descLimit}
          placeholder="Describe the problem (max 1000 chars)"
          value={description}
          onChange={e => setState(prev => ({ ...prev, problemDescription: e.target.value }))}
          disabled={loading}
        />
        {descErr && <div className="modal-err">{descErr}</div>}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30,41,59,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.16);
          padding: 32px 28px 24px 28px;
          min-width: 320px;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .modal-content h3 { margin: 0 0 8px 0; color: var(--grey-dark); font-size: 1.15rem; border-bottom: 2px solid var(--light-mint); padding-bottom: 4px; }
        .modal-input, .modal-textarea {
          border-radius: 8px;
          border: 1px solid var(--grey-medium);
          padding: 10px 12px;
          font-size: 1rem;
          background: var(--soft-mint);
        }
        .modal-textarea { min-height: 80px; resize: vertical; }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .modal-cancel {
          background: var(--inactive);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
        }
        .modal-submit {
          background: var(--vinca-green);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .modal-err {
          color: #ef4444;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}

export default FeedbackOpinionsPage;
