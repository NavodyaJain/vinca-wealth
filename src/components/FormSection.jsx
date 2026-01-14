"use client";

import { useCalculator } from '../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import InputField from './InputField';

const stepConfigs = {
  1: {
    title: "Tell us about your current situation",
    description: "Let's start with where you are today in your financial journey.",
    fields: [
      {
        id: 'currentAge',
        label: 'Current Age',
        type: 'number',
        min: 18,
        max: 70,
        suffix: 'years',
        helper: 'Your current age in years'
      },
      {
        id: 'moneySaved',
        label: 'Money Already Saved',
        type: 'currency',
        prefix: '₹',
        helper: 'Total savings & investments you have today'
      },
      {
        id: 'monthlyExpenses',
        label: 'Monthly Expenses',
        type: 'currency',
        prefix: '₹',
        helper: 'Your current monthly living expenses'
      },
      {
        id: 'monthlyIncome',
        label: 'Monthly Income',
        type: 'currency',
        prefix: '₹',
        helper: 'Your total monthly income'
      },
      {
        id: 'retirementAge',
        label: 'Desired Retirement Age',
        type: 'number',
        min: 40,
        max: 75,
        suffix: 'years',
        helper: 'Age at which you want to retire'
      }
    ]
  },
  2: {
    title: "Your investment plan",
    description: "How are you planning to grow your wealth?",
    fields: [
      {
        id: 'monthlySIP',
        label: 'Monthly SIP Amount',
        type: 'currency',
        prefix: '₹',
        helper: 'Monthly Systematic Investment Plan amount'
      },
      {
        id: 'investmentYears',
        label: 'Investment Years',
        type: 'number',
        min: 5,
        max: 50,
        suffix: 'years',
        helper: 'Number of years you will continue investing'
      },
      {
        id: 'expectedReturns',
        label: 'Expected Annual Returns',
        type: 'percentage',
        min: 1,
        max: 30,
        helper: 'Expected rate of return on investments'
      },
      {
        id: 'sipIncreaseRate',
        label: 'Annual SIP Increase Rate',
        type: 'percentage',
        min: 0,
        max: 20,
        helper: 'How much you expect to increase SIP each year'
      }
    ]
  },
  3: {
    title: "Your retirement goals",
    description: "Define your retirement lifestyle and expectations.",
    fields: [
      {
        id: 'lifespan',
        label: 'Expected Lifespan',
        type: 'number',
        min: 70,
        max: 100,
        suffix: 'years',
        helper: 'Age until which you plan your finances'
      },
      {
        id: 'inflationRate',
        label: 'Expected Inflation Rate',
        type: 'percentage',
        min: 1,
        max: 15,
        helper: 'Average annual inflation expectation'
      },
      {
        id: 'withdrawalIncrease',
        label: 'Annual Withdrawal Increase',
        type: 'percentage',
        min: 0,
        max: 10,
        helper: 'How much you expect to increase withdrawals yearly'
      },
      {
        id: 'retirementReturns',
        label: 'Post-Retirement Returns',
        type: 'percentage',
        min: 4,
        max: 12,
        helper: 'Expected returns during retirement (conservative)'
      }
    ]
  }
};

export default function FormSection() {
  const { currentStep, formData, updateFormData, setCurrentStep, calculateResults } = useCalculator();
  const router = useRouter();
  const config = stepConfigs[currentStep];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults();
      router.push('/calculator/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
          {config.title}
        </h1>
        <p className="text-lg text-slate-600">
          {config.description}
        </p>
      </div>

      <div className="card space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.fields.map((field) => (
            <InputField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              value={formData[field.id]}
              onChange={(value) => updateFormData(field.id, value)}
              min={field.min}
              max={field.max}
              prefix={field.prefix}
              suffix={field.suffix}
              helper={field.helper}
            />
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-200">
          <button
            onClick={handleBack}
            className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
            type="button"
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="btn-primary ml-auto"
            type="button"
          >
            {currentStep === 3 ? 'Calculate My Freedom' : 'Continue'}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Your data is stored locally in your browser and is never sent to any server.
        </p>
      </div>
    </div>
  );
}