// src/components/profile/ProfileEditModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/lib/formatters';
import { X } from 'lucide-react';

const FieldInput = ({ label, value, onChange, type = 'number', placeholder, unit }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {unit && <span className="text-slate-400 font-normal ml-1">({unit})</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default function ProfileEditModal({ isOpen, onClose }) {
  const { formData, updateFormData } = useCalculator();
  const [editedData, setEditedData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (formData) {
      setEditedData({ ...formData });
    }
  }, [formData, isOpen]);

  useEffect(() => {
    if (!formData) return;
    const changesExist = Object.keys(editedData).some(key => 
      editedData[key] !== formData[key]
    );
    setHasChanges(changesExist);
  }, [editedData, formData]);

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...editedData,
      _lastUpdated: new Date().toISOString()
    };
    updateFormData(dataToSave);
    onClose();
  };

  const handleCancel = () => {
    setEditedData(formData || {});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Edit Financial Profile</h2>
              <p className="text-sm text-slate-500">Update your financial details</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Personal</h3>
                <FieldInput
                  label="Current Age"
                  value={editedData.currentAge}
                  onChange={(val) => handleFieldChange('currentAge', val)}
                  placeholder="30"
                  unit="years"
                />
                <FieldInput
                  label="Retirement Goal Age"
                  value={editedData.retirementAge}
                  onChange={(val) => handleFieldChange('retirementAge', val)}
                  placeholder="60"
                  unit="years"
                />
                <FieldInput
                  label="Expected Lifespan"
                  value={editedData.lifespan}
                  onChange={(val) => handleFieldChange('lifespan', val)}
                  placeholder="85"
                  unit="years"
                />
              </div>

              {/* Income */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Income</h3>
                <FieldInput
                  label="Monthly Take-home Income"
                  value={editedData.monthlyIncome}
                  onChange={(val) => handleFieldChange('monthlyIncome', val)}
                  placeholder="100000"
                  unit="₹/month"
                />
                <FieldInput
                  label="Expected Annual Income Growth"
                  value={editedData.expectedIncomeGrowth}
                  onChange={(val) => handleFieldChange('expectedIncomeGrowth', val)}
                  placeholder="10"
                  unit="%"
                />
                <SelectInput
                  label="Income Stability"
                  value={editedData.incomeStability}
                  onChange={(val) => handleFieldChange('incomeStability', val)}
                  options={[
                    { value: 'stable', label: 'Stable (Salaried)' },
                    { value: 'variable', label: 'Variable (Business/Commission)' },
                    { value: 'seasonal', label: 'Seasonal' }
                  ]}
                />
              </div>

              {/* Expenses */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Expenses</h3>
                <FieldInput
                  label="Monthly Expenses"
                  value={editedData.monthlyExpenses}
                  onChange={(val) => handleFieldChange('monthlyExpenses', val)}
                  placeholder="50000"
                  unit="₹/month"
                />
              </div>

              {/* Investing */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Investing</h3>
                <FieldInput
                  label="Current Monthly SIP"
                  value={editedData.monthlySIP}
                  onChange={(val) => handleFieldChange('monthlySIP', val)}
                  placeholder="20000"
                  unit="₹/month"
                />
                <FieldInput
                  label="Existing Savings / Corpus"
                  value={editedData.moneySaved}
                  onChange={(val) => handleFieldChange('moneySaved', val)}
                  placeholder="500000"
                  unit="₹"
                />
                <FieldInput
                  label="Expected Annual Return Rate"
                  value={editedData.expectedReturns}
                  onChange={(val) => handleFieldChange('expectedReturns', val)}
                  placeholder="12"
                  unit="%"
                />
              </div>

              {/* Assumptions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Assumptions</h3>
                <FieldInput
                  label="Inflation Rate"
                  value={editedData.inflationRate}
                  onChange={(val) => handleFieldChange('inflationRate', val)}
                  placeholder="6"
                  unit="%"
                />
                <SelectInput
                  label="Risk Comfort Level"
                  value={editedData.riskComfort}
                  onChange={(val) => handleFieldChange('riskComfort', val)}
                  options={[
                    { value: 'low', label: 'Low (Conservative)' },
                    { value: 'medium', label: 'Medium (Balanced)' },
                    { value: 'high', label: 'High (Aggressive)' }
                  ]}
                />
                <SelectInput
                  label="Planning Style"
                  value={editedData.planningStyle}
                  onChange={(val) => handleFieldChange('planningStyle', val)}
                  options={[
                    { value: 'realistic', label: 'Realistic (Income-aware)' },
                    { value: 'aspirational', label: 'Aspirational (Goal-focused)' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
