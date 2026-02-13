'use client';

const CATEGORY_COLORS = {
  'Long-term Wealth': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  'Regular Income': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  'Tax Saving': 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  'High Growth': 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  'Capital Protection': 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
  'Global Exposure': 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
};

const ACTIVE_CATEGORY_COLORS = {
  'Long-term Wealth': 'bg-emerald-600 text-white',
  'Regular Income': 'bg-blue-600 text-white',
  'Tax Saving': 'bg-purple-600 text-white',
  'High Growth': 'bg-orange-600 text-white',
  'Capital Protection': 'bg-slate-600 text-white',
  'Global Exposure': 'bg-indigo-600 text-white'
};

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-semibold text-sm border transition-all duration-200 whitespace-nowrap ${
            activeCategory === category
              ? ACTIVE_CATEGORY_COLORS[category]
              : `${CATEGORY_COLORS[category]} border`
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
