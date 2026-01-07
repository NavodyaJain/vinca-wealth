// components/UserProfile.jsx
'use client';

import { useState, useEffect, useContext } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { formatCurrency } from '../lib/formatters';

// =============== SECTION COMPONENTS ===============
const ProfileSection = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
    <div className="space-y-6">{children}</div>
  </div>
);

const FieldRow = ({ label, value, isEditing, onChange, type = "text", placeholder, unit, validation }) => {
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (validation) {
      const validationError = validation(newValue);
      setError(validationError);
    }
    
    onChange(newValue);
  };
  
  const displayValue = (val) => {
    if (type === 'currency') {
      return formatCurrency(val);
    }
    if (type === 'percentage') {
      return `${val}%`;
    }
    return val;
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="sm:w-1/3">
        <label className="font-medium text-gray-700">{label}</label>
        {unit && <span className="text-gray-500 text-sm ml-2">{unit}</span>}
      </div>
      
      <div className="sm:w-2/3">
        {isEditing ? (
          <div>
            <input
              type={type === 'currency' || type === 'percentage' ? 'number' : type}
              value={value}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={placeholder}
              step={type === 'percentage' ? '0.1' : '1'}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        ) : (
          <p className="text-gray-900 font-medium">
            {displayValue(value) || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );
};

const SelectField = ({ label, value, isEditing, onChange, options }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="sm:w-1/3">
      <label className="font-medium text-gray-700">{label}</label>
    </div>
    
    <div className="sm:w-2/3">
      {isEditing ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-900 font-medium">
          {options.find(opt => opt.value === value)?.label || 
           <span className="text-gray-400">Not specified</span>}
        </p>
      )}
    </div>
  </div>
);

// =============== MAIN USER PROFILE COMPONENT ===============
export default function UserProfile() {
  const { formData, updateFormData } = useCalculator();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [profileId, setProfileId] = useState('');

  // Initialize with form data
  useEffect(() => {
    if (formData) {
      setEditedData(formData);
      
      // Generate or retrieve profile ID
      if (typeof window !== 'undefined') {
        let storedId = localStorage.getItem('profileId');
        if (!storedId) {
          storedId = Math.random().toString(36).substr(2, 9);
          localStorage.setItem('profileId', storedId);
        }
        setProfileId(storedId);
      }
      
      // Get last updated timestamp
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('calculatorData');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed._lastUpdated) {
            setLastUpdated(new Date(parsed._lastUpdated).toLocaleString());
          } else {
            setLastUpdated(new Date().toLocaleString());
          }
        } else {
          setLastUpdated(new Date().toLocaleString());
        }
      }
    }
  }, [formData]);

  // Check for changes
  useEffect(() => {
    if (!formData) return;
    
    const changesExist = Object.keys(editedData).some(key => 
      editedData[key] !== formData[key]
    );
    setHasChanges(changesExist);
  }, [editedData, formData]);

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: typeConversions[field] ? typeConversions[field](value) : value
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...editedData,
      _lastUpdated: new Date().toISOString()
    };
    updateFormData(dataToSave);
    setIsEditing(false);
    setLastUpdated(new Date().toLocaleString());
  };

  const handleCancel = () => {
    setEditedData(formData);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all profile data? This will clear all your financial inputs.')) {
      updateFormData({});
      setEditedData({});
      setIsEditing(false);
      setLastUpdated(new Date().toLocaleString());
    }
  };

  const handleRecalculate = () => {
    // This would typically recalculate dashboard
    alert('Recalculating dashboard with updated profile data...');
    // In a real implementation, this would trigger a recalculation
  };

  // Type conversions for numeric fields
  const typeConversions = {
    currentAge: val => parseInt(val) || 0,
    retirementAge: val => parseInt(val) || 0,
    lifespan: val => parseInt(val) || 0,
    monthlyIncome: val => parseInt(val) || 0,
    monthlyExpenses: val => parseInt(val) || 0,
    monthlySIP: val => parseInt(val) || 0,
    moneySaved: val => parseInt(val) || 0,
    expectedReturns: val => parseFloat(val) || 0,
    inflationRate: val => parseFloat(val) || 0,
    expectedIncomeGrowth: val => parseFloat(val) || 0
  };

  // Field validations
  const validations = {
    currentAge: (val) => {
      const age = parseInt(val);
      if (isNaN(age)) return 'Please enter a valid number';
      if (age < 18) return 'Must be at least 18';
      if (age > 100) return 'Invalid age';
      return '';
    },
    retirementAge: (val) => {
      const retirementAge = parseInt(val);
      const currentAge = editedData.currentAge || formData?.currentAge;
      if (isNaN(retirementAge)) return 'Please enter a valid number';
      if (retirementAge <= currentAge) return 'Must be greater than current age';
      return '';
    },
    lifespan: (val) => {
      const lifespan = parseInt(val);
      const retirementAge = editedData.retirementAge || formData?.retirementAge;
      if (isNaN(lifespan)) return 'Please enter a valid number';
      if (lifespan < retirementAge) return 'Must be at least retirement age';
      return '';
    }
  };

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">No Profile Data Yet</h3>
        <p className="text-gray-600 mb-8">
          Complete the financial freedom calculator to create your profile
        </p>
        <button
          onClick={() => window.location.href = '/calculator'}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go to Calculator
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header with Edit Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your Financial Profile</h2>
          <p className="text-gray-600 mt-1">
            Single source of truth for all your financial analyses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Edit Profile
              </button>
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                disabled={!hasChanges}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges}
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Snapshot */}
        <ProfileSection 
          title="Personal Snapshot" 
          subtitle="Core parameters that drive all calculations"
        >
          <FieldRow
            label="Current Age"
            value={editedData.currentAge || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('currentAge', val)}
            type="number"
            placeholder="30"
            unit="years"
            validation={validations.currentAge}
          />
          <FieldRow
            label="Retirement Goal Age"
            value={editedData.retirementAge || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('retirementAge', val)}
            type="number"
            placeholder="60"
            unit="years"
            validation={validations.retirementAge}
          />
          <FieldRow
            label="Expected Lifespan"
            value={editedData.lifespan || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('lifespan', val)}
            type="number"
            placeholder="85"
            unit="years"
            validation={validations.lifespan}
          />
          {!isEditing && editedData.lifespan && (
            <div className="text-sm text-gray-500 mt-2">
              Lifespan is used to ensure your retirement corpus lasts through your golden years
            </div>
          )}
        </ProfileSection>

        {/* Income & Employment */}
        <ProfileSection 
          title="Income & Employment" 
          subtitle="Used for realistic optimization and income-aware planning"
        >
          <FieldRow
            label="Monthly Take-home Income"
            value={editedData.monthlyIncome || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('monthlyIncome', val)}
            type="currency"
            placeholder="75000"
            unit="₹/month"
          />
          <SelectField
            label="Income Stability"
            value={editedData.incomeStability || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('incomeStability', val)}
            options={[
              { value: 'stable', label: 'Stable (Salaried)' },
              { value: 'variable', label: 'Variable (Business/Commission)' },
              { value: 'seasonal', label: 'Seasonal' }
            ]}
          />
          <FieldRow
            label="Expected Annual Income Growth"
            value={editedData.expectedIncomeGrowth || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('expectedIncomeGrowth', val)}
            type="percentage"
            placeholder="10"
            unit="% per year"
          />
          {!isEditing && editedData.monthlyIncome && (
            <div className="text-sm text-blue-600 mt-2">
              💡 Income details enable realistic optimization vs. fantasy scenarios
            </div>
          )}
        </ProfileSection>

        {/* Expenses & Lifestyle */}
        <ProfileSection 
          title="Expenses & Lifestyle" 
          subtitle="Your spending habits drive retirement corpus requirements"
        >
          <FieldRow
            label="Monthly Expenses"
            value={editedData.monthlyExpenses || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('monthlyExpenses', val)}
            type="currency"
            placeholder="50000"
            unit="₹/month"
          />
          {editedData.monthlyIncome && editedData.monthlyExpenses && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">
                Expense-to-Income Ratio: {Math.round((editedData.monthlyExpenses / editedData.monthlyIncome) * 100)}%
              </span>
              <span className="text-gray-500 ml-2">
                ({formatCurrency(editedData.monthlyIncome - editedData.monthlyExpenses)} available for savings)
              </span>
            </div>
          )}
          <SelectField
            label="Lifestyle Type"
            value={editedData.lifestyleType || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('lifestyleType', val)}
            options={[
              { value: 'minimal', label: 'Minimal (Essential expenses only)' },
              { value: 'moderate', label: 'Moderate (Comfortable living)' },
              { value: 'comfortable', label: 'Comfortable (Luxury included)' }
            ]}
          />
          {isEditing ? (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Major Future Expenses
              </label>
              <textarea
                value={editedData.majorExpenses || ''}
                onChange={(e) => handleFieldChange('majorExpenses', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="3"
                placeholder="E.g., Child's education, house purchase, travel plans..."
              />
            </div>
          ) : (
            <div>
              <div className="font-medium text-gray-700 mb-2">Major Future Expenses</div>
              <p className="text-gray-900">
                {editedData.majorExpenses || <span className="text-gray-400">No major expenses planned</span>}
              </p>
            </div>
          )}
        </ProfileSection>

        {/* Investments & Savings */}
        <ProfileSection 
          title="Investments & Savings" 
          subtitle="Your current financial position and growth expectations"
        >
          <FieldRow
            label="Current Monthly SIP"
            value={editedData.monthlySIP || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('monthlySIP', val)}
            type="currency"
            placeholder="25000"
            unit="₹/month"
          />
          <FieldRow
            label="Existing Savings / Corpus"
            value={editedData.moneySaved || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('moneySaved', val)}
            type="currency"
            placeholder="500000"
            unit="₹"
          />
          <FieldRow
            label="Expected Annual Return Rate"
            value={editedData.expectedReturns || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('expectedReturns', val)}
            type="percentage"
            placeholder="12"
            unit="% per year"
          />
          {!isEditing && (
            <div className="text-sm text-gray-500 mt-2">
              Expected returns are assumptions for projections. Actual returns may vary.
            </div>
          )}
        </ProfileSection>

        {/* Assumptions & Preferences */}
        <ProfileSection 
          title="Assumptions & Preferences" 
          subtitle="Parameters that affect all projections and scenarios"
        >
          <FieldRow
            label="Inflation Rate Assumption"
            value={editedData.inflationRate || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('inflationRate', val)}
            type="percentage"
            placeholder="6"
            unit="% per year"
          />
          <SelectField
            label="Risk Comfort Level"
            value={editedData.riskComfort || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('riskComfort', val)}
            options={[
              { value: 'low', label: 'Low (Conservative)' },
              { value: 'medium', label: 'Medium (Balanced)' },
              { value: 'high', label: 'High (Aggressive)' }
            ]}
          />
          <SelectField
            label="Planning Style"
            value={editedData.planningStyle || ''}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange('planningStyle', val)}
            options={[
              { value: 'realistic', label: 'Realistic (Income-aware)' },
              { value: 'aspirational', label: 'Aspirational (Goal-focused)' }
            ]}
          />
          {!isEditing && (
            <div className="text-sm text-gray-500 mt-2">
              These assumptions align with calculator defaults and affect all projections
            </div>
          )}
        </ProfileSection>

        {/* Actions & Status */}
        <ProfileSection 
          title="Actions & Status" 
          subtitle="Manage your profile data and updates"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Profile Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={handleRecalculate}
                    className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Recalculate Dashboard
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Reset Profile Data
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Profile Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">{lastUpdated || 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Completeness</span>
                    <span className="font-medium text-green-600">
                      {Object.keys(editedData).filter(k => editedData[k] && !k.startsWith('_')).length}/12 fields
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile ID</span>
                    <span className="font-mono text-sm text-gray-500">
                      {profileId || 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">ℹ</span>
              </div>
              <p className="text-sm text-gray-700">
                Changes made here will update all financial analyses and dashboard projections immediately.
                Your profile data is the single source of truth for all calculations.
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Sticky Save Button for Mobile Edit Mode */}
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-50">
            <div className="max-w-7xl mx-auto flex justify-between gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}