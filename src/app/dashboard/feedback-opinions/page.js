"use client";
import React, { useState } from 'react';
import { MessageSquare, Star, Heart, Send } from 'lucide-react';

const FEATURES = [
  'Sprints',
  'Reflections',
  'Curations',
  'Calculators',
  'Dashboard',
  'Others'
];

const initialOpinions = [];

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
    activeTab: 'opinions',
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
    <div className="feedback-opinions-root" suppressHydrationWarning>
      <h3 className="page-header">Your reflection helps us strengthen the financial readiness experience we're building for you.</h3>
      <div className="tabs-bar">
        <button
          className={`tab-btn${state.activeTab === 'feedback' ? ' active' : ''}`}
          onClick={() => handleTabChange('feedback')}
          suppressHydrationWarning
        >
          Review
        </button>
        <button
          className={`tab-btn${state.activeTab === 'opinions' ? ' active' : ''}`}
          onClick={() => handleTabChange('opinions')}
          suppressHydrationWarning
        >
          Raise
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
          width: 100%;
          padding: 32px 24px 48px 24px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .page-header {
          margin: 0 0 32px 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--grey-dark);
          line-height: 1.4;
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
  const [likedFeedback, setLikedFeedback] = useState(new Set());
  const [feedbackLikes, setFeedbackLikes] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);

  const handleLike = (feedbackId) => {
    if (likedFeedback.has(feedbackId)) return;
    
    setLikedFeedback(prev => new Set([...prev, feedbackId]));
    setFeedbackLikes(prev => ({
      ...prev,
      [feedbackId]: (prev[feedbackId] || 0) + 1
    }));
  };

  const handleSubmitWithPopup = (type) => {
    const originalSubmit = handleFeedbackSubmit;
    handleFeedbackSubmit(type);
    if (type === 'overall' && state.overallRating > 0) {
      setTimeout(() => setShowThankYou(true), 1000);
    }
  };

  return (
    <div className="feedback-section">
      <OverallFeedbackCard
        rating={state.overallRating}
        comment={state.overallComment}
        setState={setState}
        handleStarClick={handleStarClick}
        handleSubmit={() => handleSubmitWithPopup('overall')}
        loading={state.feedbackLoading}
        success={state.feedbackSuccess}
      />

      <FeedbackHistory 
        feedbacks={state.allFeedbacks} 
        onLike={handleLike}
        likedFeedback={likedFeedback}
        feedbackLikes={feedbackLikes}
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

      {showThankYou && (
        <ThankYouModal onClose={() => setShowThankYou(false)} />
      )}

      <style>{`
        .feedback-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      `}</style>
    </div>
  );
}

function OverallFeedbackCard({ rating, comment, setState, handleStarClick, handleSubmit, loading, success }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading && rating > 0) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="feedback-input-card">
      <StarRating
        value={rating}
        onChange={(val) => handleStarClick(val, 'overall')}
      />
      <div className="feedback-input-wrapper">
        <input
          type="text"
          className="feedback-input"
          placeholder="Share your experience with Vinca so far…"
          maxLength={500}
          value={comment}
          onChange={e => setState(prev => ({ ...prev, overallComment: e.target.value }))}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="feedback-send-btn"
          onClick={handleSubmit}
          disabled={loading || rating === 0 || !comment.trim()}
          title="Send feedback"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
      <style>{`
        .feedback-input-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feedback-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          position: relative;
        }
        .feedback-input {
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.95rem;
          background: #fafbfc;
          font-family: inherit;
          transition: all 0.2s ease;
          color: #374151;
        }
        .feedback-input::placeholder {
          color: #9ca3af;
        }
        .feedback-input:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        .feedback-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }
        .feedback-send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #9ca3af;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .feedback-send-btn:hover:not(:disabled) {
          color: #10b981;
        }
        .feedback-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .feedback-send-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

function FeatureFeedbackCard({ selectedFeature, rating, comment, setState, handleStarClick, handleSubmit, loading, success }) {
  return null;
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

function FeedbackHistory({ feedbacks, onLike, likedFeedback, feedbackLikes }) {
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
          <div className="feedback-left">
            <StarRatingStatic value={fb.rating} />
            {fb.comment && <div className="feedback-comment">{fb.comment}</div>}
            {fb.type === 'feature' && (
              <span className="feature-label">{fb.feature}</span>
            )}
          </div>
          <div className="feedback-right">
            <span className="timestamp">{new Date(fb.createdAt).toLocaleString()}</span>
            <button 
              className={`like-btn ${likedFeedback && likedFeedback.has(fb.id) ? 'liked' : ''}`}
              onClick={() => onLike && onLike(fb.id)}
              disabled={likedFeedback && likedFeedback.has(fb.id)}
              title="Like this feedback"
            >
              <Heart size={16} />
              <span className="like-count">{(feedbackLikes && feedbackLikes[fb.id]) || 0}</span>
            </button>
          </div>
        </div>
      ))}
      <style>{`
        .feedback-history {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .feedback-item {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 20px 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .feedback-item:nth-child(odd) {
          background: linear-gradient(135deg, #f0fdf9 0%, #d1fae5 100%);
        }
        .feedback-item:nth-child(even) {
          background: linear-gradient(135deg, #ecfdf5 0%, #bbf7d0 100%);
        }
        .feedback-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feedback-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          min-width: 120px;
        }
        .feature-label {
          background: #2563eb;
          color: #fff;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          align-self: flex-start;
        }
        .timestamp {
          color: #9ca3af;
          font-size: 0.8rem;
          white-space: nowrap;
        }
        .feedback-comment {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }
        .like-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .like-btn:hover:not(:disabled) {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }
        .like-btn.liked {
          background: #fee2e2;
          border-color: #ef4444;
          color: #ef4444;
        }
        .like-btn.liked svg {
          fill: #ef4444;
        }
        .like-btn:disabled {
          cursor: not-allowed;
        }
        .like-count {
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function StarRatingStatic({ value }) {
  return (
    <span className="star-static">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={20} color={i <= value ? '#10b981' : '#d1d5db'} fill={i <= value ? '#10b981' : 'none'} />
      ))}
      <style>{`
        .star-static { 
          display: flex; 
          gap: 3px;
        }
        .star-static svg {
          color: var(--vinca-green);
        }
      `}</style>
    </span>
  );
}

function ThankYouModal({ onClose }) {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      <div className="thank-you-overlay" onClick={onClose} />
      <div className="thank-you-modal">
        <div className="thank-you-content">
          <div className="thank-you-emoji">🙏</div>
          <h2>Thank You!</h2>
          <p>We truly appreciate your valuable feedback. Vinca will take this seriously.</p>
          <button className="thank-you-btn" onClick={onClose}>
            Welcome
          </button>
        </div>
      </div>
      <style>{`
        .thank-you-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .thank-you-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .thank-you-content {
          background: #fff;
          border-radius: 16px;
          padding: 40px 36px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          max-width: 360px;
          width: 90vw;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .thank-you-emoji {
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 8px;
        }
        .thank-you-content h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1a2540;
          font-weight: 700;
        }
        .thank-you-content p {
          margin: 0;
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.5;
        }
        .thank-you-btn {
          background: var(--vinca-green);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 8px;
          min-width: 120px;
        }
        .thank-you-btn:hover {
          background: #059669;
        }
        .thank-you-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}

// --- Opinions Section ---
function OpinionsSection({ state, setState, handleVote, handleProblemSubmit }) {
  const [opinionText, setOpinionText] = useState('');
  const [likedOpinions, setLikedOpinions] = useState(new Set());
  const [opinionLikes, setOpinionLikes] = useState({});
  const [newlySubmittedId, setNewlySubmittedId] = useState(null);

  const handleLikeOpinion = (opinionId) => {
    if (likedOpinions.has(opinionId)) return;
    
    setLikedOpinions(prev => new Set([...prev, opinionId]));
    setOpinionLikes(prev => ({
      ...prev,
      [opinionId]: (prev[opinionId] || 0) + 1
    }));
    handleVote(opinionId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitOpinion();
    }
  };

  const handleSubmitOpinion = () => {
    if (!opinionText.trim()) return;
    
    setState((prev) => ({
      ...prev,
      problemTitle: opinionText,
      problemDescription: opinionText,
      loading: true
    }));

    setTimeout(() => {
      const newOpinion = {
        id: Date.now(),
        title: opinionText,
        description: opinionText,
        votes: 0,
        userVoted: false,
        type: 'user-suggested',
        createdAt: new Date().toISOString()
      };
      
      setNewlySubmittedId(newOpinion.id);
      setOpinionText('');
      
      setState((prev) => ({
        ...prev,
        opinions: [newOpinion, ...prev.opinions],
        loading: false,
        opinionSuccess: true
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, opinionSuccess: false }));
        setNewlySubmittedId(null);
      }, 2000);
    }, 600);
  };

  // Sort opinions by likes (descending), with newly submitted at top
  const sortedOpinions = [...state.opinions].sort((a, b) => {
    // Newly submitted opinion stays at top temporarily
    if (newlySubmittedId) {
      if (a.id === newlySubmittedId) return -1;
      if (b.id === newlySubmittedId) return 1;
    }
    
    // Then sort by likes
    const likesA = (opinionLikes[a.id] || 0) + (a.votes || 0);
    const likesB = (opinionLikes[b.id] || 0) + (b.votes || 0);
    return likesB - likesA;
  });

  return (
    <div className="opinions-section">
      <div className="opinions-header-block">
        <p className="opinions-subtext">Raise the next blocker in your financial readiness journey.</p>
      </div>

      <div className="opinion-input-card">
        <div className="opinion-input-wrapper">
          <input
            type="text"
            className="opinion-input"
            maxLength={500}
            value={opinionText}
            onChange={e => setOpinionText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={state.loading}
            suppressHydrationWarning
          />
          <button
            className="opinion-send-btn"
            onClick={handleSubmitOpinion}
            disabled={!opinionText.trim() || state.loading}
            title="Send opinion"
            aria-label="Send"
            suppressHydrationWarning
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="opinions-list">
        {sortedOpinions.length === 0 ? (
          <div className="opinions-empty">
            <p>No opinions yet. Be the first to share what's on your mind.</p>
          </div>
        ) : (
          sortedOpinions.map(opinion => (
            <div className={`opinion-item ${newlySubmittedId === opinion.id ? 'newly-submitted' : ''}`} key={opinion.id}>
              <div className="opinion-left">
                <div className="opinion-text">{opinion.title}</div>
                <div className="opinion-timestamp">{new Date(opinion.createdAt).toLocaleString()}</div>
              </div>
              <div className="opinion-right">
                <button
                  className={`opinion-like-btn ${likedOpinions && likedOpinions.has(opinion.id) ? 'liked' : ''}`}
                  onClick={() => handleLikeOpinion(opinion.id)}
                  disabled={likedOpinions && likedOpinions.has(opinion.id)}
                  title="Like this opinion"
                >
                  <Heart size={16} />
                  <span className="like-count">{(opinionLikes && opinionLikes[opinion.id]) || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .opinions-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .opinions-header-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .opinions-main-question {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a2540;
          line-height: 1.4;
        }
        .opinions-subtext {
          margin: 0;
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.5;
        }
        .opinion-input-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 12px 16px;
          display: flex;
          align-items: center;
        }
        .opinion-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          position: relative;
        }
        .opinion-input {
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.95rem;
          background: #fafbfc;
          font-family: inherit;
          transition: all 0.2s ease;
          color: #374151;
        }
        .opinion-input::placeholder {
          color: #9ca3af;
        }
        .opinion-input:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        .opinion-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }
        .opinion-send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #9ca3af;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .opinion-send-btn:hover:not(:disabled) {
          color: #10b981;
        }
        .opinion-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .opinion-send-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .opinions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .opinions-empty {
          text-align: center;
          padding: 40px 24px;
          color: #6b7280;
          font-size: 0.95rem;
        }
        .opinion-item {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 18px 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .opinion-item:nth-child(odd) {
          background: linear-gradient(135deg, #f0fdf9 0%, #d1fae5 100%);
        }
        .opinion-item:nth-child(even) {
          background: linear-gradient(135deg, #ecfdf5 0%, #bbf7d0 100%);
        }
        .opinion-item.newly-submitted {
          border-left: 4px solid #10b981;
        }
        .opinion-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .opinion-text {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }
        .opinion-timestamp {
          color: #9ca3af;
          font-size: 0.75rem;
          margin: 0;
        }
        .opinion-right {
          display: flex;
          align-items: center;
          min-width: 100px;
        }
        .opinion-like-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .opinion-like-btn:hover:not(:disabled) {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }
        .opinion-like-btn.liked {
          background: #fee2e2;
          border-color: #ef4444;
          color: #ef4444;
        }
        .opinion-like-btn.liked svg {
          fill: #ef4444;
        }
        .opinion-like-btn:disabled {
          cursor: not-allowed;
        }
        .like-count {
          font-size: 0.75rem;
          font-weight: 600;
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
