// lib/premium.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for premium status
const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  
  // Check localStorage on initial load
  useEffect(() => {
    const keys = ['vinca_is_pro', 'vinca_premium_demo', 'vinca_pro_unlocked'];
    const anyTrue = keys.some((k) => localStorage.getItem(k) === 'true');
    if (anyTrue) setIsPremium(true);
  }, []);

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('vinca_is_pro', 'true');
    localStorage.setItem('vinca_premium_demo', 'true');
    localStorage.setItem('vinca_pro_unlocked', 'true');
  };

  const downgradeToFree = () => {
    setIsPremium(false);
    localStorage.removeItem('vinca_premium_demo');
    localStorage.removeItem('vinca_is_pro');
    localStorage.removeItem('vinca_pro_unlocked');
  };

  return (
    <PremiumContext.Provider value={{ isPremium, upgradeToPremium, downgradeToFree }}>
      {children}
    </PremiumContext.Provider>
  );
}

// Custom hook to use premium context
export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}