'use client';

import React, { useState, useEffect } from 'react';
import ReadinessFitDashboard from '@/components/readinessFit/ReadinessFitDashboard';

/**
 * Readiness Fit Page
 * Diagnoses how well Vinca's features support the user's financial readiness needs
 * Integrates data from Financial Readiness, Lifestyle Planner, Health Stress Test, and Sprints
 */
export default function ReadinessFitPage() {
  const [aggregatedData, setAggregatedData] = useState({
    financialReadiness: {},
    lifestyle: {},
    health: {},
    sprints: {},
    preferences: {},
  });

  useEffect(() => {
    // In a real app, this would fetch from the user's saved results
    // For now, we'll attempt to retrieve from localStorage or use defaults
    const retrieveData = () => {
      try {
        // Financial Readiness data
        const financialReadinessData = localStorage.getItem('financialReadinessResults');
        const parsed = financialReadinessData ? JSON.parse(financialReadinessData) : {};

        // Lifestyle Planner data
        const lifestyleData = localStorage.getItem('lifestylePlannerResults');
        const lifestyleParsed = lifestyleData ? JSON.parse(lifestyleData) : {};

        // Health Stress Test data
        const healthData = localStorage.getItem('healthStressResults');
        const healthParsed = healthData ? JSON.parse(healthData) : {};

        // Sprints data
        const sprintsData = localStorage.getItem('sprintsProgress');
        const sprintsParsed = sprintsData ? JSON.parse(sprintsData) : {};

        // Preferences
        const preferencesData = localStorage.getItem('userPreferences');
        const preferencesParsed = preferencesData ? JSON.parse(preferencesData) : {};

        setAggregatedData({
          financialReadiness: parsed,
          lifestyle: lifestyleParsed,
          health: healthParsed,
          sprints: sprintsParsed,
          preferences: preferencesParsed,
        });
      } catch (error) {
        console.error('Error retrieving readiness fit data:', error);
        // Use empty defaults
      }
    };

    retrieveData();
  }, []);

  return (
    <div>
      <ReadinessFitDashboard data={aggregatedData} />
    </div>
  );
}
