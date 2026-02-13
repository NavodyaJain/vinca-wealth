'use client';

import { useState } from 'react';
import ProductCard from '@/components/marketProducts/ProductCard';
import ProductDetailsDrawer from '@/components/marketProducts/ProductDetailsDrawer';
import CategoryTabs from '@/components/marketProducts/CategoryTabs';
import marketProducts from '@/data/market-products.json';

const CATEGORIES = [
  'Long-term Wealth',
  'Regular Income',
  'Tax Saving',
  'High Growth',
  'Capital Protection',
  'Global Exposure'
];

export default function MarketProductsPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter products by active category
  const filteredProducts = marketProducts.filter(
    (product) => product.category === activeCategory && product.status === 'active'
  );

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Market Products Explorer
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Understand the types of financial products available in the Indian investment landscape. This is educational information to help you learn about what options exist and what they're generally used for.
          </p>
        </div>

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

        {/* Product Details Drawer */}
        <ProductDetailsDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />

        {/* Educational Disclaimer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">Educational Awareness Only:</span> This content is for educational purposes to help you understand what financial products exist and how they're generally used. It does not constitute investment advice, recommendations to buy or use any product, or predictions about future performance. All investment decisions should be made after consulting with a qualified financial advisor who understands your personal financial situation and goals.
          </p>
        </div>
      </div>
    </div>
  );
}
