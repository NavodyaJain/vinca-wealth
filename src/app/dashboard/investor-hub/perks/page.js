

"use client";
import { useState } from "react";

const PRODUCTS = [
  // Books
  {
    title: "The Simple Path to Wealth",
    purpose: "A practical framework for long-term investing and financial independence thinking.",
    link: "https://www.amazon.in/dp/1533667926",
    category: "Books",
    icon: "📘"
  },
  {
    title: "Die With Zero",
    purpose: "Encourages balancing money with life experiences across different stages of life.",
    link: "https://www.amazon.in/dp/0358099765",
    category: "Books",
    icon: "📘"
  },
  {
    title: "The Automatic Millionaire (20th Anniversary Edition)",
    purpose: "Highlights how consistent habits and automation can support long-term financial goals.",
    link: "https://www.amazon.in/dp/0593543066",
    category: "Books",
    icon: "📘"
  },
  {
    title: "The Five Years Before You Retire",
    purpose: "Focuses on preparing financially and mentally during the critical pre-retirement years.",
    link: "https://www.amazon.in/dp/1440570888",
    category: "Books",
    icon: "📘"
  },
  {
    title: "A Richer Retirement",
    purpose: "Explores sustainable retirement spending concepts and lifestyle enjoyment.",
    link: "https://www.amazon.in/dp/0814434010",
    category: "Books",
    icon: "📘"
  },
  // Planning
  {
    title: "What My Family Should Know – Planner & Organizer (2026 Edition)",
    purpose: "Helps organise important personal and financial information for family awareness.",
    link: "https://www.amazon.in/dp/B0CQZK6J8B",
    category: "Planning",
    icon: "📓"
  },
  {
    title: "TinyChange Undated Classic Life Planner (A5)",
    purpose: "Supports goal-setting, habit tracking, and mindful daily planning.",
    link: "https://www.amazon.in/dp/B09V7YQJ6B",
    category: "Planning",
    icon: "📓"
  },
  // Games
  {
    title: "THE GAME FACTORY IPO – Stock Market Board Game",
    purpose: "Introduces basic market concepts through strategic gameplay for families and adults.",
    link: "https://www.amazon.in/dp/B09V7YQJ6B",
    category: "Games",
    icon: "🎲"
  },
  {
    title: "Curio21 Stock Market Game – Buy Hold Sell Strategy",
    purpose: "Simulates investing decisions and long-term thinking in a playful format.",
    link: "https://www.amazon.in/dp/B0B5YQJ6B",
    category: "Games",
    icon: "🎲"
  },
  {
    title: "Funskool Big Bull Junior – Stock Market Board Game",
    purpose: "Encourages early understanding of economic and market concepts.",
    link: "https://www.amazon.in/dp/B09V7YQJ6B",
    category: "Games",
    icon: "🎲"
  },
  {
    title: "Ratna’s Stock Market Board Game",
    purpose: "Explores money, economy, and trade concepts through interactive play.",
    link: "https://www.amazon.in/dp/B09V7YQJ6B",
    category: "Games",
    icon: "🎲"
  },
  // Retirement Gifts
  {
    title: "Saregama Carvaan Mini Hindi 2.0 (Portable Music Player)",
    purpose: "A nostalgic music companion for leisure time and relaxed living after retirement.",
    link: "https://www.amazon.in/dp/B07KX8J8B8",
    category: "Retirement Gifts",
    icon: "🎁"
  },
  {
    title: "Indian Art Villa Pure Copper Drinkware Gift Set (Bottle + 2 Glasses)",
    purpose: "A traditional, elegant gift suited for home and everyday wellness rituals.",
    link: "https://www.amazon.in/dp/B07KX8J8B8",
    category: "Retirement Gifts",
    icon: "🎁"
  },
  {
    title: "Personalized Retirement Keepsake / Plaque",
    purpose: "A commemorative item to mark the milestone and celebrate years of contribution.",
    link: "https://www.amazon.in/dp/B07KX8J8B8",
    category: "Retirement Gifts",
    icon: "🎁"
  },
];

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Books", value: "Books" },
  { label: "Planning", value: "Planning" },
  { label: "Games", value: "Games" },
  { label: "Retirement Gifts", value: "Retirement Gifts" },
];

function EditorialCard({ title, purpose, link, icon, category }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300">
      {/* Icon (Subtle corner) */}
      <div className="flex justify-end mb-4 opacity-60">
        <span className="text-2xl select-none" aria-label={category}>{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 leading-snug">
        {title}
      </h3>

      {/* Description - Full visible with auto wrap */}
      <p className="text-sm text-slate-600 leading-relaxed mb-6 grow">
        {purpose}
      </p>

      {/* Action Button - Bottom aligned */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-center text-sm"
      >
        View
      </a>
    </div>
  );
}

export default function VincaCurationsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="w-full min-h-screen bg-slate-50 px-2 sm:px-4 lg:px-8 py-10">
      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl flex flex-col gap-6 px-2 sm:px-4 lg:px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="text-base text-slate-600 max-w-2xl mt-2 text-left">
            Thoughtfully selected set of products to support and simplify your financial readiness journey.
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-row gap-2 mb-4">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium transition border " +
                (filter === f.value
                  ? "bg-emerald-600 text-white shadow border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100")
              }
              style={{ minWidth: 90 }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* CARDS */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, idx) => (
            <EditorialCard key={p.title + idx} {...p} />
          ))}
        </div>

        {/* Footer microcopy */}
        <div className="text-xs text-slate-400 text-center mt-10 mb-2">
          Products listed are curated for awareness and lifestyle enrichment. Availability, pricing, and delivery are handled by Amazon.
        </div>
      </div>
    </div>
  );
}

