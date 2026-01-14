// src/app/dashboard/financial-readiness/components/ProfessionalGuidanceSection.jsx
'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const ProfessionalGuidanceSection = () => {
  const [showToast, setShowToast] = useState(false);

  const benefits = [
    {
      title: '📊 Personalized Strategy',
      description: 'Tailored investment plans based on your unique goals'
    },
    {
      title: '💼 Exclusive Access',
      description: 'Premium investment opportunities and business ventures'
    },
    {
      title: '🤝 Expert Support',
      description: 'One-on-one guidance from experienced wealth managers'
    }
  ];

  const handleCTAClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="mt-12">
      {showToast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Login required to connect with advisor
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Take the Next Step with Professional Guidance
          </h2>
          <p className="text-gray-700">
            Your financial journey deserves expert support. Login to your Portfolio and connect with our advisors who will personally guide you through:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to level up?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Get personalized guidance from our team of financial experts
              </p>
              
              <button
                onClick={handleCTAClick}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                Talk to Wealth Manager
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  Trusted by 1000+ investors achieving their financial goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalGuidanceSection;