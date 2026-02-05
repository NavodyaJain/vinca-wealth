'use client';

import React, { useState, useEffect } from 'react';
import { getScoreDisplay } from '@/lib/readinessFit';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function ReadinessFitDashboard({ result = null, loading = true }) {
  const [fitResult, setFitResult] = useState(result);

  useEffect(() => {
    // Result comes from page.js (engine called once there)
    setFitResult(result);
  }, [result]);

  if (loading || !fitResult) {
    return (
      <div className="readiness-fit-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your financial readiness fit...</p>
        </div>
      </div>
    );
  }

  // SINGLE SOURCE OF TRUTH: Use result directly
  const scoreDisplay = getScoreDisplay(fitResult.score);

  // Debug: Confirm binding
  console.log('SCORE CARD BINDING', {
    score: fitResult.score,
    fitLevel: fitResult.fitLevel,
    color: scoreDisplay.color,
  });

  // Helper function to get gradient based on score color
  const getGradient = (color) => {
    if (color === '#059669' || color === '#10b981') {
      // Green gradient
      return 'linear-gradient(135deg, #f0fdf9 0%, #d1fae5 100%)';
    } else if (color === '#f59e0b') {
      // Amber gradient
      return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
    } else {
      // Grey gradient
      return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
    }
  };

  return (
    <div className="readiness-fit-container">
      {/* Section 1: Header */}
      <div className="fit-header">
        <h1 className="fit-title">How well does Vinca support your financial readiness?</h1>
        <p className="fit-subtitle">Based on your actual retirement data (education-only)</p>
      </div>

      {/* Section 2 & 3: Unified Score + Why This Score Card */}
      <div className="fit-score-unified-card">
        {/* LEFT: Score Square Card */}
        <div className="score-square-container">
          <div className="score-square" style={{ background: getGradient(scoreDisplay.color) }}>
            <div className="score-number">{scoreDisplay.score}</div>
            <div className="score-label">READINESS FIT SCORE</div>
            <div className="fit-level-text">{scoreDisplay.label}</div>
          </div>
        </div>

        {/* RIGHT: Why This Score Reasoning - from actual data */}
        {fitResult.reasons && fitResult.reasons.length > 0 && (
          <div className="why-score-content">
            <h2 className="why-score-title">Where your plan needs support</h2>
            <p className="why-score-subtitle">Based on gaps identified in your retirement data (education-only)</p>
            <div className="reasons-stack">
              {fitResult.reasons.map((item, idx) => (
                <div key={idx} className="reason-item">
                  <div className="reason-icon">
                    <AlertCircle size={18} />
                  </div>
                  <div className="reason-text">
                    <span className="reason-source">{item.source}</span> — {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Closing Message */}
      <div className="closing-message">
        <div className="message-icon">
          <CheckCircle size={32} />
        </div>
        <p>{fitResult.closingMessage}</p>
      </div>

      <style>{`
        .readiness-fit-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 16px 48px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          color: #1a2540;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 64px 24px;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .fit-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .fit-title {
          margin: 0 0 8px;
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .fit-subtitle {
          margin: 0;
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Unified Score + Why This Score Card */
        .fit-score-unified-card {
          display: flex;
          gap: 32px;
          align-items: center;
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          margin-bottom: 40px;
          max-width: 900px;
        }

        /* LEFT: Score Square Container */
        .score-square-container {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-square {
          width: 220px;
          height: 220px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .score-number {
          font-size: 56px;
          font-weight: 700;
          line-height: 1;
          color: #1a2540;
          margin: 0;
        }

        .score-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #6b7280;
          margin: 0;
          margin-top: 4px;
        }

        .fit-level-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
          margin-top: 6px;
        }

        /* RIGHT: Why This Score Content */
        .why-score-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .why-score-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a2540;
          letter-spacing: 0.3px;
        }

        .why-score-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .reasons-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reason-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .reason-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          margin-top: 2px;
        }

        .reason-icon svg {
          width: 18px;
          height: 18px;
        }

        .reason-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #4b5563;
          flex: 1;
        }

        .reason-source {
          font-weight: 600;
          color: #374151;
        }

        /* Old styles cleanup */
        .fit-score-card {
          display: none;
        }

        .why-score-section {
          display: none;
        }

        /* Features Section */
        .features-section {
          margin-bottom: 40px;
        }

        .features-section h2 {
          margin: 0 0 20px;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        /* Closing Message */
        .closing-message {
          background: linear-gradient(135deg, #f0fdf9, #ecfdf5);
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          border: 1px solid #d1fae5;
        }

        .message-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
          color: #10b981;
        }

        .closing-message p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .readiness-fit-container {
            padding: 24px 12px 40px;
          }

          .fit-title {
            font-size: 1.4rem;
          }

          .fit-score-card {
            flex-direction: column;
            gap: 20px;
            padding: 24px;
          }

          .score-circle {
            width: 140px;
            height: 140px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Individual feature card component - renders data-driven recommendations
 */
function FeatureCard({ feature }) {
  return (
    <div className="feature-card">
      <h4 className="feature-name">{feature.feature}</h4>
      <p className="feature-why">
        <strong>This helps because</strong>: {feature.why}
      </p>

      <style>{`
        .feature-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .feature-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
        }

        .feature-name {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a2540;
        }

        .feature-why {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #4b5563;
          background: #f9fafb;
          padding: 12px 12px;
          border-radius: 6px;
          border-left: 3px solid #10b981;
        }

        .feature-why strong {
          color: #1a2540;
        }
      `}</style>
    </div>
  );
}
