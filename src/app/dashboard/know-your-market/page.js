'use client';

import { useState } from 'react';
import ProductCard from '@/components/marketProducts/ProductCard';
import ProductDetailsDrawer from '@/components/marketProducts/ProductDetailsDrawer';
import CategoryTabs from '@/components/marketProducts/CategoryTabs';
import ValuationCard from '@/components/marketValuation/ValuationCard';
import marketProducts from '@/data/market-products.json';
import marketValuation from '@/data/market-valuation.json';

const CATEGORIES = [
  'Long-term Wealth',
  'Regular Income',
  'Tax Saving',
  'High Growth',
  'Capital Protection',
  'Global Exposure'
];

export default function KnowYourMarketPage() {
  const [activeTab, setActiveTab] = useState('valuations');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductPopupOpen, setIsProductPopupOpen] = useState(false);

  // Filter products by active category
  const filteredProducts = marketProducts.filter(
    (product) => product.category === activeCategory && product.status === 'active'
  );

  // Build asset array from valuation data
  const assets = [
    {
      name: 'Nifty 50',
      type: 'equity',
      current_pe: marketValuation.nifty_50.current_pe,
      historical_average_pe: marketValuation.nifty_50.historical_average_pe,
      current_zone: marketValuation.nifty_50.current_zone
    },
    {
      name: 'Sensex (BSE)',
      type: 'equity',
      current_pe: marketValuation.sensex.current_pe,
      historical_average_pe: marketValuation.sensex.historical_average_pe,
      current_zone: marketValuation.sensex.current_zone
    },
    {
      name: 'Gold',
      type: 'metal',
      historical_basis: marketValuation.gold.historical_basis,
      current_zone: marketValuation.gold.current_zone,
      current_price: marketValuation.gold.current_price,
      price_change_percent: marketValuation.gold.price_change_percent,
      price_change_direction: marketValuation.gold.price_change_direction
    },
    {
      name: 'Silver',
      type: 'metal',
      historical_basis: marketValuation.silver.historical_basis,
      current_zone: marketValuation.silver.current_zone,
      current_price: marketValuation.silver.current_price,
      price_change_percent: marketValuation.silver.price_change_percent,
      price_change_direction: marketValuation.silver.price_change_direction
    }
  ];

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsProductPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsProductPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="know-your-market-root" suppressHydrationWarning>
      <h3 className="kym-page-header">Understand where current markets stand relative to history, and explore available investment products.</h3>
      <div className="kym-tabs-bar">
        <button
          className={`kym-tab-btn${activeTab === 'valuations' ? ' active' : ''}`}
          onClick={() => setActiveTab('valuations')}
          suppressHydrationWarning
        >
          Valuations
        </button>
        <button
          className={`kym-tab-btn${activeTab === 'products' ? ' active' : ''}`}
          onClick={() => setActiveTab('products')}
          suppressHydrationWarning
        >
          Products
        </button>
      </div>

      <div className="kym-tab-content">
        {/* Valuations Tab Content */}
        {activeTab === 'valuations' && (
          <div>
            {/* Valuation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {assets.map((asset) => (
                <ValuationCard key={asset.name} asset={asset} />
              ))}
            </div>

            {/* Educational Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-sm text-blue-900 leading-relaxed">
                <span className="font-semibold">Educational Awareness Only:</span> Valuations describe market context—what assets are priced at historically. They do not predict future returns, do not constitute investment advice, and should not drive investment decisions. Market timing is extremely difficult. This information is for understanding market context only.
              </p>
            </div>
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div>
            {/* Category Tabs */}
            <CategoryTabs
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDetailsClick={handleViewDetails}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">No products available in this category yet.</p>
              </div>
            )}

            {/* Product Details Popup */}
            <ProductDetailsDrawer
              product={selectedProduct}
              isOpen={isProductPopupOpen}
              onClose={handleClosePopup}
            />

            {/* Educational Disclaimer */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-sm text-blue-900 leading-relaxed">
                <span className="font-semibold">Educational Awareness Only:</span> This content is for educational purposes to help you understand what financial products exist and how they're generally used. It does not constitute investment advice, recommendations to buy or use any product, or predictions about future performance. All investment decisions should be made after consulting with a qualified financial advisor who understands your personal financial situation and goals.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        :root {
          --vinca-green: #10B981;
          --vinca-green-dark: #059669;
          --vinca-green-light: #D1FAE5;
          --grey-light: #F9FAFB;
          --grey-dark: #374151;
        }
        .know-your-market-root {
          width: 100%;
          padding: 32px 24px 48px 24px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .kym-page-header {
          margin: 0 0 32px 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--grey-dark);
          line-height: 1.4;
        }
        .kym-tabs-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .kym-tab-btn {
          flex: 1;
          padding: 12px 0;
          border: none;
          border-radius: 12px 12px 0 0;
          background: var(--grey-light);
          color: var(--grey-dark);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .kym-tab-btn.active {
          background: var(--vinca-green);
          color: #fff;
        }
        .kym-tab-content {
          background: #fff;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 32px 24px 24px 24px;
          min-height: 480px;
        }
        @media (max-width: 700px) {
          .kym-tab-content { padding: 18px 6px 12px 6px; }
        }
      `}</style>
    </div>
  );
}
