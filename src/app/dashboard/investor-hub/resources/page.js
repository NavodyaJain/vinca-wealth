"use client";
import { useState, useEffect } from "react";
import { videoSeries, blogs } from "@/data/investorHub/resourcesData";
import VideoSeriesCard from "@/components/investorHub/resources/VideoSeriesCard";
import BlogCard from "@/components/investorHub/resources/BlogCard";
import FinancialMaturityCard from "@/components/investorHub/resources/FinancialMaturityCard";
import useLearningProgress from "@/hooks/useLearningProgress";

const TABS = [
];

export default function ResourcesPage() {
  const [tab, setTab] = useState("video-series");
  const [mounted, setMounted] = useState(false);
  const {
    getMaturityLevel,
    getCompletedSeriesByLevel
  } = useLearningProgress();

  // Ensure client-side hydration completes before rendering maturity card
  useEffect(() => {
    setMounted(true);
  }, []);

  const maturityLevel = getMaturityLevel();
  const completedSeriesByLevel = getCompletedSeriesByLevel();

  return (
    <div className="w-full px-6 lg:px-8 py-6">
      <div className="w-full">
        {/* Removed Investor Hub Resources heading as requested */}
        <div className="w-full overflow-x-auto mb-6">
          <div className="flex w-max gap-2 border-b border-gray-200">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-150 whitespace-nowrap ${tab === t.key ? 'border-emerald-600 text-emerald-800 bg-emerald-50' : 'border-transparent text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Concepts that leads to financial readiness</h2>
        </div>

        {/* Motivation Cards - Always visible on video-series tab */}
        {tab === "video-series" && (
          <>
            {/* Financial Maturity Card - Single primary card */}
            {mounted && (
              <div className="mb-6">
                <FinancialMaturityCard
                  maturityLevel={maturityLevel}
                  completedSeriesByLevel={completedSeriesByLevel}
                />
              </div>
            )}

            {/* Video Series Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videoSeries.map((series) => (
                <VideoSeriesCard
                  key={series.id}
                  series={series}
                  onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {tab === "blogs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                onSave={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
