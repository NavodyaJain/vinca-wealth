"use client";
import { videoSeries } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";
import VideoSeriesCard from "@/components/investorHub/resources/VideoSeriesCard";
import { useState } from "react";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function VideoSeriesListingPage() {
  const [level, setLevel] = useState("All");
  const { savedSeries, toggleSavedSeries } = useResourcesSavedState();

  const filtered =
    level === "All"
      ? videoSeries
      : videoSeries.filter((s) => s.difficulty === level);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 pb-12">
      <div className="pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Video Series</h1>
        <p className="text-gray-600 mb-2">Browse all structured video series for retirement planning.</p>
        <span className="block text-xs text-gray-400 mb-2">Educational content for awareness only. Not investment advice. Please consult a SEBI-registered advisor for personalized decisions.</span>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
              level === lvl
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setLevel(lvl)}
            type="button"
          >
            {lvl}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No series found for this level.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((series) => (
            <VideoSeriesCard
              key={series.id}
              series={series}
              isSaved={savedSeries.includes(series.id)}
              onSave={() => toggleSavedSeries(series.id)}
              onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
