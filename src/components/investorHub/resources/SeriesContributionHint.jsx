'use client';
import React from 'react';

/**
 * SeriesContributionHint - Shows how completing a series contributes to learning progress
 * Displayed on series detail page before/after video completion
 * Informational tone, no urgency or CTAs
 */
export default function SeriesContributionHint({
  seriesTitle,
  seriesDifficulty,
  contributions = [],
  isSeriesCompleted = false
}) {
  if (!seriesTitle || !seriesDifficulty) {
    return null;
  }

  const hasContributions = contributions && contributions.length > 0;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
      {/* Header */}
      <h4 className="text-sm font-semibold text-slate-900 mb-3">
        How this series contributes
      </h4>

      {/* Main contribution text */}
      <p className="text-sm text-slate-700 mb-4">
        Completing this {seriesDifficulty.toLowerCase()} series contributes to your Financial Learning Maturity.
        {seriesDifficulty.toLowerCase() === 'advanced' && (
          <> Advanced series add more depth to your learning progress.</>
        )}
      </p>

      {/* Achievement contributions */}
      {hasContributions && !isSeriesCompleted && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">
            When you complete this series:
          </p>
          <ul className="space-y-2">
            {contributions.map((contrib) => (
              <li
                key={contrib.achievementId}
                className="text-sm text-slate-700 flex items-start gap-2"
              >
                <span className="text-emerald-600 mt-0.5">→</span>
                <span>
                  {contrib.willUnlock ? (
                    <span>
                      You will unlock <strong>{contrib.name}</strong>
                    </span>
                  ) : (
                    <span>
                      Progress toward <strong>{contrib.name}</strong> (
                      {contrib.progressAfter})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Already completed message */}
      {isSeriesCompleted && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-sm text-emerald-700">
            ✓ You've already completed this series. It contributed to your learning progress.
          </p>
        </div>
      )}

      {/* No contributions message */}
      {!hasContributions && !isSeriesCompleted && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            This series adds depth to your learning. Complete it at your own pace.
          </p>
        </div>
      )}
    </div>
  );
}
