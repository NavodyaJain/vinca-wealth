'use client';

import React, { useState, useEffect } from 'react';
import ReadinessFitDashboard from '@/components/readinessFit/ReadinessFitDashboard';
import { calculateReadinessFitScore } from '@/lib/readinessFit';

/**
 * Readiness Fit Page
 * Diagnoses how well Vinca's features support the user's financial readiness needs
 * Uses ONLY calculator outputs: Financial Readiness, Lifestyle Planner, Health Stress Test
 * (No sprint, guidance, or engagement data)
 */
export default function ReadinessFitPage() {
  const [readinessResult, setReadinessResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve data from localStorage and calculate fit score ONCE
    const calculateFit = () => {
      try {
        // Financial Readiness data
        const financialReadinessData = localStorage.getItem('financialReadinessResults');
        const financialReadiness = financialReadinessData ? JSON.parse(financialReadinessData) : {};

        // Lifestyle Planner data
        const lifestyleData = localStorage.getItem('lifestylePlannerResults');
        const lifestyle = lifestyleData ? JSON.parse(lifestyleData) : {};

        // Health Stress Test data
        const healthData = localStorage.getItem('healthStressResults');
        const health = healthData ? JSON.parse(healthData) : {};

        // Normalize into single input object (ONLY calculator outputs)
        const readinessInput = {
          financialReadiness,
          lifestyle,
          health,
        };

        // SINGLE SOURCE OF TRUTH: Call engine once, store result
        const result = calculateReadinessFitScore(readinessInput);
        console.log('READINESS FIT ENGINE RESULT (page.js)', result);
        
        setReadinessResult(result);
        setLoading(false);
      } catch (error) {
        console.error('Error calculating readiness fit:', error);
        // Use empty result on error
        setReadinessResult(null);
        setLoading(false);
      }
    };

    calculateFit();
  }, []);

  return (
    <div>
      <ReadinessFitDashboard result={readinessResult} loading={loading} />
    </div>
  );
}
