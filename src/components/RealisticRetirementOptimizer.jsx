'use client';

import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, BarChart, Bar, ComposedChart,
  Area
} from 'recharts';
import { formatCurrency, formatAge } from '../lib/formatters';
import {
  calculateFinancialReality,
  calculateSurvivalMode,
  calculateRealisticOptimization,
  calculateAggressiveFantasy,
  calculateRealityConfidence,
  generateFantasyChartData
} from '../lib/realisticRetirement';

const RealityConfidenceGauge = ({ score, label, components }) => {
  const getColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
            <text x="18" y="22" textAnchor="middle" className="text-lg font-semibold fill-slate-900">
              {score}
            </text>
          </svg>
        </div>
        <div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBgColor(score)} ${getColor(score)}`}>
            {label}
          </div>
          <p className="text-sm text-slate-600 mt-2">
            How well your retirement plan aligns with income reality
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Income-Expense Health</span>
          <span className="font-medium text-slate-900">{components.incomeExpenseHealth}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-green-600 h-1.5 rounded-full" 
            style={{ width: `${components.incomeExpenseHealth}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Lifespan Coverage</span>
          <span className="font-medium text-slate-900">{components.lifespanCoverage}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-green-600 h-1.5 rounded-full" 
            style={{ width: `${components.lifespanCoverage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">SIP Feasibility</span>
          <span className="font-medium text-slate-900">{components.sipFeasibility}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-green-600 h-1.5 rounded-full" 
            style={{ width: `${components.sipFeasibility}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const FinancialRealityCard = ({ financialReality, onUpdateIncome }) => {
  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [incomeInput, setIncomeInput] = useState(financialReality.monthlyIncome || '');

  const handleSaveIncome = () => {
    const income = parseFloat(incomeInput);
    if (!isNaN(income) && income > 0) {
      onUpdateIncome(income);
      setShowIncomeInput(false);
    }
  };

  return (
    <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Your Financial Reality</h3>
        <button
          onClick={() => setShowIncomeInput(!showIncomeInput)}
          className="text-sm text-green-600 hover:text-green-800"
        >
          {showIncomeInput ? 'Cancel' : 'Edit income'}
        </button>
      </div>
      
      {/* Income Input Field */}
      {showIncomeInput && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-slate-900 mb-3">Update Your Monthly Income</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Net Monthly Income (Post-tax)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="pl-8 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your monthly take-home pay"
                  min="0"
                  step="1000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your net income after all deductions (taxes, PF, etc.)
              </p>
            </div>
            
            <div className="flex space-x-3">
                <button
                  onClick={handleSaveIncome}
                  className="btn-primary flex-1"
                >
                  Save Income
                </button>
              <button
                onClick={() => {
                  setShowIncomeInput(false);
                  setIncomeInput(financialReality.monthlyIncome || '');
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Income → Expenses → Surplus Flow */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm font-medium">₹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Monthly Income</p>
                <p className="text-sm text-slate-600">
                  {financialReality.monthlyIncome > 0 ? 'Net take-home pay' : 'Click "Edit income" to add'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">
                {financialReality.monthlyIncome > 0 ? formatCurrency(financialReality.monthlyIncome) : '—'}
              </p>
              {financialReality.monthlyIncome === 0 && (
                <button
                  onClick={() => setShowIncomeInput(true)}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Add income
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">↓</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm font-medium">→</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Monthly Expenses</p>
                <p className="text-sm text-slate-600">From your retirement calculator inputs</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(financialReality.monthlyExpenses)}</p>
              <p className="text-sm text-slate-600">
                {financialReality.monthlyIncome > 0 
                  ? `${Math.round((financialReality.monthlyExpenses / financialReality.monthlyIncome) * 100)}% of income`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">↓</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm font-medium">+</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Current Monthly SIP</p>
                <p className="text-sm text-slate-600">Retirement savings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(financialReality.currentSIP)}</p>
              <p className="text-sm text-slate-600">
                {financialReality.monthlyIncome > 0 
                  ? `${Math.round(financialReality.currentSIPIncomeRatio * 100)}% of income`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">=</span>
          </div>

          <div className={`p-4 rounded-lg border ${
            financialReality.monthlySurplus >= 10000 
              ? 'bg-green-50 border-green-200' 
              : financialReality.monthlySurplus >= 0
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">Monthly Surplus</p>
                <p className="text-sm text-slate-600">
                  {financialReality.monthlyIncome > 0 ? (
                    financialReality.monthlySurplus >= 0 
                      ? 'Available for optimization'
                      : 'Deficit - Plan needs adjustment'
                  ) : 'Add income to see surplus'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  financialReality.monthlyIncome > 0 ? (
                    financialReality.monthlySurplus >= 10000 
                      ? 'text-green-700' 
                      : financialReality.monthlySurplus >= 0
                        ? 'text-amber-700'
                        : 'text-red-700'
                  ) : 'text-slate-700'
                }`}>
                  {financialReality.monthlyIncome > 0 
                    ? formatCurrency(financialReality.monthlySurplus)
                    : '—'
                  }
                </p>
                {financialReality.monthlyIncome === 0 && (
                  <button
                    onClick={() => setShowIncomeInput(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add income to calculate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {financialReality.warnings.length > 0 && (
          <div className="mt-4">
            {financialReality.warnings.map((warning, index) => (
              <div key={index} className={`p-3 rounded-lg mb-2 ${
                warning.type === 'critical' 
                  ? 'bg-red-50 border border-red-200' 
                  : warning.type === 'warning'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${
                    warning.type === 'critical' ? 'bg-red-100 text-red-600' : 
                    warning.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {warning.type === 'critical' ? '!' : 'i'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{warning.message}</p>
                    <p className="text-sm text-slate-600 mt-1">{warning.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SurvivalModeCard = ({ survivalMode }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'danger': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getIcon = (status) => {
    switch(status) {
      case 'safe': return '✓';
      case 'warning': return '⚠';
      case 'danger': return '✗';
      default: return 'ℹ';
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
          <span className="text-slate-700 font-medium">1</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Survival Check</h3>
          <p className="text-slate-600 text-sm mt-1">{survivalMode.label}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 ${getStatusColor(survivalMode.survivalStatus)}`}>
              <span className="font-medium">{getIcon(survivalMode.survivalStatus)}</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Will I run out of money?</h4>
              <p className="text-slate-700">{survivalMode.survivalMessage}</p>
              
              <div className="mt-3 flex items-center">
                <span className="text-sm text-slate-600 mr-3">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(survivalMode.survivalStatus)}`}>
                  {survivalMode.survivalStatus === 'safe' ? 'Safe' : 
                   survivalMode.survivalStatus === 'warning' ? 'At Risk' : 
                   survivalMode.survivalStatus === 'danger' ? 'High Risk' : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <span className="text-blue-600 text-xs">ℹ</span>
            </div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Important:</span> {survivalMode.importantNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RealisticOptimizationCard = ({ realisticMode, financialReality }) => {
  if (financialReality.monthlyIncome === 0) {
    return (
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-700 font-medium">2</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Realistic Optimization</h3>
            <p className="text-slate-600 text-sm mt-1">{realisticMode.label}</p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-blue-600">ℹ</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Add income to see realistic optimization</h4>
              <p className="text-blue-800">
                We need to know your monthly income to show what's realistically possible within your budget.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!realisticMode.isRealistic) {
    return (
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-700 font-medium">2</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Realistic Optimization</h3>
            <p className="text-slate-600 text-sm mt-1">{realisticMode.label}</p>
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-amber-600">⚠</span>
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Fix cash flow first</h4>
              <p className="text-amber-800">{realisticMode.message}</p>
              <p className="text-sm text-amber-700 mt-1">{realisticMode.requires}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <span className="text-blue-700 font-medium">2</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Realistic Optimization</h3>
          <p className="text-slate-600 text-sm mt-1">{realisticMode.label}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Key Insight */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <span className="text-green-600 text-xs">💡</span>
            </div>
            <p className="text-sm text-green-700">
              <span className="font-medium">Key insight:</span> {realisticMode.keyInsight}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                <span className="text-slate-700 font-medium">Now</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Current</p>
            </div>
            
            <div className="flex-1 h-1 bg-slate-200 mx-4 relative">
              <div 
                className="h-1 bg-blue-500 rounded-full absolute top-0 left-0"
                style={{ width: '70%' }}
              ></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                <span className="text-blue-700 font-medium">+{formatCurrency(realisticMode.usedSurplus)}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Optimized</p>
            </div>
            
            <div className="flex-1 h-1 bg-slate-200 mx-4 relative">
              <div 
                className="h-1 bg-green-500 rounded-full absolute top-0 left-0"
                style={{ width: '30%' }}
              ></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                <span className="text-green-700 font-medium">{realisticMode.earliestRetirementAge}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Retire</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Monthly Action Needed</p>
              <p className="text-2xl font-bold text-blue-700">+{formatCurrency(realisticMode.usedSurplus)}</p>
              <p className="text-xs text-slate-500 mt-1">{realisticMode.explanation?.monthlyAction}</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Earliest Realistic Retirement</p>
              <p className="text-2xl font-bold text-blue-700">Age {realisticMode.earliestRetirementAge}</p>
              <p className="text-xs text-slate-500 mt-1">{realisticMode.explanation?.earliestAge}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Years Earlier</p>
              <p className="text-2xl font-bold text-green-700">-{realisticMode.yearsEarlier} years</p>
              <p className="text-xs text-slate-500 mt-1">{realisticMode.explanation?.yearsEarlier}</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Comfort Level</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                realisticMode.requiresSacrifice 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {realisticMode.comfortLevel}
              </div>
              <p className="text-xs text-slate-500 mt-1">{realisticMode.note}</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-slate-600">
          <p><strong>Constraints used:</strong> Only uses actual monthly surplus (₹{formatCurrency(financialReality.monthlySurplus)}), caps SIP to safe % of income, does not assume income growth or extreme sacrifice.</p>
        </div>
      </div>
    </div>
  );
};

const AggressiveFantasyCard = ({ aggressiveMode, onExploreFantasy, financialReality }) => {
  if (financialReality.monthlyIncome === 0) {
    return (
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 opacity-50">
            <span className="text-slate-700 font-medium">3</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 opacity-50">Aggressive Fantasy</h3>
            <p className="text-slate-600 text-sm mt-1 opacity-50">{aggressiveMode?.label || "If I insist on retiring very early, what would it mathematically cost?"}</p>
          </div>
        </div>
        
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 opacity-75">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-slate-600">③</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Add income to see aggressive scenarios</h4>
              <p className="text-slate-600">
                We need your current income to show what it would mathematically take to retire early.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generate chart data
  const chartData = generateFantasyChartData({
    ...financialReality,
    monthlySIP: financialReality.currentSIP,
    currentAge: 30, // Default if not provided
    lifespan: 85,
    expectedReturns: 12,
    inflationRate: 6,
    moneySaved: 0
  });

  const FantasyLineChart = () => {
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
            <p className="font-medium text-slate-900">Retire at age {label}</p>
            <p className="text-sm text-slate-600">
              Required SIP: <span className="font-medium">{formatCurrency(payload[0].value)}/month</span>
            </p>
            {payload[1] && (
              <p className="text-sm text-slate-600">
                Max realistic: <span className="font-medium text-blue-600">{formatCurrency(payload[1].value)}/month</span>
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="retirementAge" 
            label={{ value: 'Retirement Age', position: 'insideBottom', offset: -10 }}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            label={{ value: 'Monthly SIP Required', angle: -90, position: 'insideLeft' }}
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Current SIP Reference Line */}
          <ReferenceLine 
            y={financialReality.currentSIP} 
            stroke="#94a3b8" 
            strokeDasharray="3 3"
            label={{ value: 'Current SIP', position: 'right', fill: '#64748b' }}
          />
          
          {/* Max Realistic SIP Reference Line */}
          <ReferenceLine 
            y={financialReality.maxPossibleSIP} 
            stroke="#3b82f6" 
            strokeDasharray="3 3"
            label={{ value: 'Max Realistic SIP', position: 'right', fill: '#3b82f6' }}
          />
          
          {/* Area for realistic zone */}
          <Area
            type="monotone"
            dataKey="maxRealisticSIP"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            name="Realistic Range"
          />
          
          {/* Line for required SIP */}
          <Line
            type="monotone"
            dataKey="requiredSIP"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Required SIP for Early Retirement"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const IncomeComparisonChart = () => {
    const sampleData = chartData.filter((_, i) => i % 3 === 0).slice(0, 5);

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="retirementAge" 
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(value), '']}
            labelFormatter={(label) => `Retire at ${label}`}
          />
          <Legend />
          
          <Bar 
            dataKey="monthlyExpenses" 
            stackId="a" 
            fill="#94a3b8" 
            name="Expenses" 
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="requiredSIP" 
            stackId="a" 
            fill="#ef4444" 
            name="Required SIP" 
            radius={[2, 2, 0, 0]}
          />
          
          <Line
            type="monotone"
            dataKey="currentIncome"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Current Income"
          />
          <Line
            type="monotone"
            dataKey="requiredIncome"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 4 }}
            name="Required Income"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 opacity-75">
          <span className="text-slate-700 font-medium">3</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 opacity-75">Aggressive Fantasy</h3>
          <p className="text-slate-600 text-sm mt-1 opacity-75">{aggressiveMode.label}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-amber-600">⚠</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Explicit Disclaimer</h4>
              <p className="text-slate-700">{aggressiveMode.disclaimer}</p>
              <div className="mt-3 space-y-2">
                {aggressiveMode.purpose?.map((purpose, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <span className="text-slate-600 text-xs">•</span>
                    </div>
                    <p className="text-sm text-slate-600">{purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Exponential Rise in SIP as Retirement Age Moves Earlier</h4>
            <p className="text-sm text-slate-600 mb-4">
              Shows how required monthly SIP increases dramatically for earlier retirement
            </p>
            <FantasyLineChart />
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Income Comparison: Required vs Current</h4>
            <p className="text-sm text-slate-600 mb-4">
              Compares required income (SIP + expenses) against your current income
            </p>
            <IncomeComparisonChart />
          </div>
        </div>

        {/* Sample Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aggressiveMode.scenarios?.slice(0, 4).map((scenario, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              scenario.isRealistic ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50 opacity-75'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-lg font-bold text-slate-900">Retire at {scenario.targetAge}</div>
                  <div className="text-sm text-slate-600">{scenario.yearsToTarget} years from now</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  scenario.isRealistic ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {scenario.feasibility}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Required SIP:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(scenario.requiredSIP)}/month</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Required income:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(scenario.requiredIncome)}/month</span>
                </div>
                
                {!scenario.isRealistic && (
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-100">
                    <p className="text-xs text-red-700">
                      Requires {scenario.incomeMultiplier}× your current income
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            <strong>Free tier:</strong> Preview shows first 4 scenarios. Upgrade for full analysis.
          </p>
          
          <button
          onClick={onExploreFantasy}
            className="text-sm text-green-600 hover:text-green-800 flex items-center"
          >
            Explore full fantasy scenarios
            <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PremiumFeaturesCard = ({ onUpgrade }) => {
  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-blue-900 text-lg">Unlock Premium Reality Analysis</h4>
          <p className="text-blue-700 text-sm mt-1">
            Pay to understand trade-offs clearly, not for generic advice
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Premium
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📊</span>
            <div>
              <h5 className="font-medium text-slate-900">Full Aggressive Fantasy Scenarios</h5>
              <p className="text-sm text-slate-600 mt-1">All early retirement scenarios with detailed projections</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📈</span>
            <div>
              <h5 className="font-medium text-slate-900">Year-by-Year Projections</h5>
              <p className="text-sm text-slate-600 mt-1">Detailed timeline for each retirement scenario</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📥</span>
            <div>
              <h5 className="font-medium text-slate-900">Downloadable Action Plan</h5>
              <p className="text-sm text-slate-600 mt-1">Personalized steps for realistic optimization</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">🤝</span>
            <div>
              <h5 className="font-medium text-slate-900">Advisor Handoff Preparation</h5>
              <p className="text-sm text-slate-600 mt-1">Pre-filled analysis for financial advisor consultation</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-blue-200">
        <button
          onClick={onUpgrade}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow"
        >
          Upgrade to Premium Reality Analysis — ₹999/year
        </button>
        <p className="text-xs text-green-700 text-center mt-3">
          Cancel anytime • 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default function RealisticRetirementOptimizer({ formData, results, onExploreScenarios, onUpgradeToPremium }) {
  const [userIncome, setUserIncome] = useState(formData?.monthlyIncome || 0);

  // Update the formData with user's income for calculations
  const enhancedFormData = {
    ...formData,
    monthlyIncome: userIncome,
    monthlyExpenses: formData?.monthlyExpenses || 0,
    monthlySIP: formData?.monthlySIP || 0,
    currentAge: formData?.currentAge || 30,
    retirementAge: formData?.retirementAge || 60,
    lifespan: formData?.lifespan || 85,
    inflationRate: formData?.inflationRate || 6,
    expectedReturns: formData?.expectedReturns || 12,
    moneySaved: formData?.moneySaved || 0
  };

  // Calculate all modes
  const financialReality = calculateFinancialReality(enhancedFormData);
  const survivalMode = calculateSurvivalMode(enhancedFormData, results);
  const realisticMode = calculateRealisticOptimization(enhancedFormData, results, financialReality);
  const aggressiveMode = calculateAggressiveFantasy(enhancedFormData, results);
  const confidence = calculateRealityConfidence(financialReality, survivalMode, realisticMode);

  const handleUpdateIncome = (newIncome) => {
    setUserIncome(newIncome);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Realistic Retirement Optimizer</h3>
          <p className="text-slate-600 mt-2">
            An income-aware retirement optimizer that tells you whether you will survive till your expected lifespan, 
            what you can realistically improve today, and what early retirement would actually cost — without lying or overselling.
          </p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white border border-slate-200">
            <p className="text-sm text-slate-600">Reality Confidence</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold text-green-700">{confidence.score}</div>
              <div className="text-sm text-slate-500">{confidence.label}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200">
            <p className="text-sm text-slate-600">Monthly Surplus</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold text-green-700">{formatCurrency(financialReality.monthlySurplus)}</div>
              <div className="text-sm text-slate-500">Available today</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200">
            <p className="text-sm text-slate-600">Earliest Realistic Retirement</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold text-green-700">Age {realisticMode.earliestRetirementAge}</div>
              <div className="text-sm text-slate-500">Based on current surplus</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Financial Reality & Sequential Modes */}
          <div className="space-y-6">
            <FinancialRealityCard 
              financialReality={financialReality} 
              onUpdateIncome={handleUpdateIncome}
            />
            <SurvivalModeCard survivalMode={survivalMode} />
            <RealisticOptimizationCard 
              realisticMode={realisticMode} 
              financialReality={financialReality} 
            />
            <AggressiveFantasyCard 
              aggressiveMode={aggressiveMode} 
              onExploreFantasy={onExploreScenarios}
              financialReality={financialReality}
            />
          </div>

          {/* Right Column: Confidence & Analysis */}
          <div className="space-y-6">
            <div className="card">
              <h4 className="font-semibold text-slate-900 mb-4">Reality Confidence Score</h4>
              <RealityConfidenceGauge 
                score={confidence.score} 
                label={confidence.label}
                components={confidence.components}
              />
            </div>

            <div className="card">
              <h4 className="font-semibold text-slate-900 mb-4">How This Works</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-slate-700 font-medium">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 mb-1">Survival Check</h5>
                    <p className="text-sm text-slate-600">
                      Checks if your money lasts till your expected lifespan. This is NOT early retirement.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-blue-700 font-medium">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 mb-1">Realistic Optimization</h5>
                    <p className="text-sm text-slate-600">
                      Uses only your actual surplus to find what's possible without breaking cash flow.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-slate-700 font-medium">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 mb-1">Aggressive Fantasy</h5>
                    <p className="text-sm text-slate-600">
                      Shows mathematically possible scenarios to expose the true cost of early retirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold text-slate-900 mb-4">Core Design Principle</h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Never mix realism and fantasy in the same mental model.</span> 
                  Each mode has a different emotional tone and serves a distinct purpose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <PremiumFeaturesCard onUpgrade={onUpgradeToPremium} />

        {/* Final Note */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-slate-700">💡</span>
            </div>
            <div>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Trend context:</span> FIRE (Financial Independence Retire Early) is trending heavily, 
                but most content ignores income constraints and post-retirement lifespan sustainability. This feature 
                grounds FIRE dreams in income reality while still allowing aspiration exploration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}