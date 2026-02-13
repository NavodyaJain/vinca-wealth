'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductDetailsDrawer({ product, isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen || !product) return null;

  const handleCTAClick = () => {
    router.push('/dashboard/investor-hub/elevate/');
  };

  return (
    <>
      {/* Centered Popup - No Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in pointer-events-auto border border-slate-200">
          {/* Sticky Header */}
          <div className="sticky top-0 flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{product.product_group}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{product.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close details"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
            {/* What is it used for */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">What is it used for?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Key Characteristics */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Characteristics</h4>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Purpose</p>
                  <p className="text-sm text-slate-900 font-semibold">{product.purpose}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Time Horizon</p>
                  <p className="text-sm text-slate-900 font-semibold">{product.time_horizon}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Risk Level</p>
                  <p className="text-sm text-slate-900 font-semibold">{product.risk_level}</p>
                </div>
              </div>
            </div>

            {/* General Risk Explanation */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">General Risk Explanation</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.risk_level === 'Very Low' && 'This product has minimal price fluctuation. You can expect steady, predictable returns with very low loss risk.'}
                {product.risk_level === 'Low' && 'This product is designed for safety with modest returns. Price changes are typically small and infrequent.'}
                {product.risk_level === 'Low-Medium' && 'This product balances safety with some growth potential. Modest price fluctuations are normal; longer holding periods help smooth returns.'}
                {product.risk_level === 'Medium' && 'This product experiences moderate price changes. Expect fluctuations in value, especially in shorter periods. Long-term holding helps.'}
                {product.risk_level === 'Medium-High' && 'This product can see significant price swings. Short-term volatility is common; it requires a longer investment horizon to absorb losses.'}
                {product.risk_level === 'High' && 'This product experiences substantial price changes. Be prepared for extended periods of decline; patience and a long time horizon are essential.'}
                {product.risk_level === 'Very High' && 'This product is highly volatile with potential for sharp, extended declines. Only suitable for those who can afford to lose their investment and hold for many years.'}
              </p>
            </div>

            {/* Typical Long-term Expectation */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Typical Long-term Expectation</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{product.return_hint}</p>
            </div>

            {/* What This Product Does NOT Guarantee */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">What This Product Does NOT Guarantee</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✗ Future returns or performance</li>
                <li>✗ Protection against market downturns</li>
                <li>✗ Meeting any specific financial goal</li>
                <li>✗ Capital preservation in short term</li>
                <li>✗ Inflation protection (some products)</li>
              </ul>
            </div>

            {/* Educational Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">Educational Only:</span> This information is for educational awareness only. It does not constitute investment advice, not a recommendation to buy or use this product, and should not drive your investment decisions.
              </p>
            </div>
          </div>

          {/* Sticky CTA Footer */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-5 rounded-b-2xl">
            <button
              onClick={handleCTAClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors mb-2"
            >
              Talk to a Vinca Wealth Expert
            </button>
            <p className="text-xs text-slate-600 text-center">
              Get clarity on how this product works and where it may fit in your overall financial plan.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
