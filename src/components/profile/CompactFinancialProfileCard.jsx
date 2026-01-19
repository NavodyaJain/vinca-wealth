// src/components/profile/CompactFinancialProfileCard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/lib/formatters';
import { Edit2, RefreshCw, Trash2, Copy, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';

// Compact field row - always 2 columns (label left, value right)
const FieldRow = ({ label, value, onAdd }) => {
  const isEmpty = value === null || value === undefined || value === '' || value === '—';
  
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      {isEmpty ? (
        <button 
          onClick={onAdd}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Add
        </button>
      ) : (
        <span className="text-sm font-medium text-slate-900">{value}</span>
      )}
    </div>
  );
};

// Section within the card
const Section = ({ title, children }) => (
  <div className="py-3 first:pt-0">
    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{title}</h4>
    <div>{children}</div>
  </div>
);

export default function CompactFinancialProfileCard({ onEditClick }) {
  const { formData, updateFormData } = useCalculator();
  const [lastUpdated, setLastUpdated] = useState(null);
  const [profileId, setProfileId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get profile ID
      let storedId = localStorage.getItem('profileId');
      if (!storedId) {
        storedId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem('profileId', storedId);
      }
      setProfileId(storedId);

      // Get last updated
      const saved = localStorage.getItem('calculatorData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed._lastUpdated) {
          setLastUpdated(new Date(parsed._lastUpdated).toLocaleString());
        }
      }
    }
  }, [formData]);

  // Safe number helper
  const safeNum = (val) => {
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  // Format helpers
  const formatINR = (val) => {
    const num = safeNum(val);
    if (num === 0) return '—';
    return formatCurrency(num);
  };

  const formatPercent = (val) => {
    const num = safeNum(val);
    if (num === 0) return '—';
    return `${num}%`;
  };

  const formatAge = (val) => {
    const num = safeNum(val);
    if (num === 0) return '—';
    return `${num}`;
  };

  // Calculated values
  const monthlyIncome = safeNum(formData?.monthlyIncome);
  const monthlyExpenses = safeNum(formData?.monthlyExpenses);
  const monthlySurplus = monthlyIncome > 0 ? monthlyIncome - monthlyExpenses : 0;
  const expenseRatio = monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;

  // Field count for completeness
  const coreFields = ['currentAge', 'retirementAge', 'lifespan', 'monthlyIncome', 'monthlyExpenses', 'monthlySIP', 'moneySaved', 'expectedReturns', 'inflationRate'];
  const filledFields = coreFields.filter(f => formData?.[f] && safeNum(formData[f]) > 0).length;
  const completeness = Math.min(Math.round((filledFields / coreFields.length) * 100), 100);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profileId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all profile data? This will clear all your financial inputs.')) {
      updateFormData({});
    }
  };

  const handleRecalculate = () => {
    // Trigger recalculation by updating with same data
    updateFormData({ ...formData, _lastUpdated: new Date().toISOString() });
    alert('Dashboard recalculated with current profile data.');
  };

  // If no data yet
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Profile Data Yet</h3>
          <p className="text-sm text-slate-500 mb-4">Complete the financial calculator to create your profile</p>
          <button
            onClick={() => window.location.href = '/dashboard/financial-readiness'}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header Row */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Title + Subtitle */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Your Financial Profile</h2>
            <p className="text-sm text-slate-500">Single source of truth for all your financial analyses</p>
          </div>
          
          {/* Right: Metadata chips + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Metadata chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {lastUpdated && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  Updated: {lastUpdated}
                </span>
              )}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                completeness >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                completeness >= 50 ? 'bg-amber-100 text-amber-700' : 
                'bg-slate-100 text-slate-600'
              }`}>
                {completeness}% complete
              </span>
              <button 
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Copy profile ID"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEditClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={handleRecalculate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recalculate
              </button>
              <button
                onClick={handleReset}
                className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Numbers Grid - 2 columns on desktop, 1 on mobile */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-1">
            <Section title="Personal">
              <FieldRow label="Current Age" value={formatAge(formData?.currentAge)} onAdd={onEditClick} />
              <FieldRow label="Retirement Goal Age" value={formatAge(formData?.retirementAge)} onAdd={onEditClick} />
              <FieldRow label="Expected Lifespan" value={formatAge(formData?.lifespan)} onAdd={onEditClick} />
            </Section>

            <Section title="Income">
              <FieldRow label="Monthly Take-home Income" value={formatINR(formData?.monthlyIncome)} onAdd={onEditClick} />
              <FieldRow label="Expected Annual Income Growth" value={formatPercent(formData?.expectedIncomeGrowth)} onAdd={onEditClick} />
              <FieldRow 
                label="Income Stability" 
                value={
                  formData?.incomeStability === 'stable' ? 'Stable (Salaried)' :
                  formData?.incomeStability === 'variable' ? 'Variable' :
                  formData?.incomeStability === 'seasonal' ? 'Seasonal' : '—'
                } 
                onAdd={onEditClick} 
              />
            </Section>

            <Section title="Expenses">
              <FieldRow label="Monthly Expenses" value={formatINR(formData?.monthlyExpenses)} onAdd={onEditClick} />
              <FieldRow 
                label="Expense-to-Income Ratio" 
                value={monthlyIncome > 0 ? `${expenseRatio}%` : '—'} 
                onAdd={onEditClick} 
              />
              <FieldRow 
                label="Monthly Surplus" 
                value={monthlyIncome > 0 ? formatINR(monthlySurplus) : '—'} 
                onAdd={onEditClick} 
              />
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <Section title="Investing">
              <FieldRow label="Current Monthly SIP" value={formatINR(formData?.monthlySIP)} onAdd={onEditClick} />
              <FieldRow label="Existing Savings / Corpus" value={formatINR(formData?.moneySaved)} onAdd={onEditClick} />
              <FieldRow label="Expected Annual Return Rate" value={formatPercent(formData?.expectedReturns)} onAdd={onEditClick} />
            </Section>

            <Section title="Assumptions">
              <FieldRow label="Inflation Rate" value={formatPercent(formData?.inflationRate)} onAdd={onEditClick} />
              <FieldRow 
                label="Risk Comfort Level" 
                value={
                  formData?.riskComfort === 'low' ? 'Conservative' :
                  formData?.riskComfort === 'medium' ? 'Balanced' :
                  formData?.riskComfort === 'high' ? 'Aggressive' : '—'
                } 
                onAdd={onEditClick} 
              />
              <FieldRow 
                label="Planning Style" 
                value={
                  formData?.planningStyle === 'realistic' ? 'Realistic' :
                  formData?.planningStyle === 'aspirational' ? 'Aspirational' : '—'
                } 
                onAdd={onEditClick} 
              />
            </Section>
          </div>
        </div>
      </div>

      {/* Notes / Impact Section - Collapsible */}
      <div className="border-t border-slate-100">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>How this affects your plan</span>
          </div>
          {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showNotes && (
          <div className="px-6 pb-4 text-sm text-slate-600 space-y-2">
            <p>• Changes here update all tools automatically.</p>
            <p>• This profile powers Financial Readiness, Lifestyle Planner, and Health Stress test.</p>
            <p>• Your data is stored locally and never shared.</p>
          </div>
        )}
      </div>
    </div>
  );
}
