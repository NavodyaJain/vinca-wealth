import React from "react";
import clsx from "clsx";
import { getPointsForDifficulty } from "@/lib/learningPointsConfig";

export default function VideoSeriesCard({
  series,
  isSaved,
  onSave,
  onExplore,
}) {
  const pointsToEarn = getPointsForDifficulty(series.difficulty);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border flex flex-col w-full max-w-xs min-w-[220px] mx-auto relative">
      <img
        src={series.bannerImage || 'https://placehold.co/400x200?text=Resource+Image'}
        alt={series.title}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      
      {/* Points Badge - top right corner */}
      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
        +{pointsToEarn} pts
      </div>
      
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center mb-2">
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-0.5 rounded-full mr-2",
              series.difficulty === "Beginner"
                ? "bg-green-100 text-green-700"
                : series.difficulty === "Intermediate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {series.difficulty}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {series.totalDurationMinutes} min
          </span>
        </div>
        <h3 className="font-semibold text-base mb-1 line-clamp-2">
          {series.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {series.description}
        </p>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span>{series.modules?.length || 0} modules</span>
          <span className="mx-2">•</span>
          <span>
            {series.modules?.reduce(
              (acc, m) => acc + (m.videos?.length || 0),
              0
            )} videos
          </span>
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700 transition"
            onClick={onExplore}
            type="button"
          >
            Explore Series
          </button>
          <button
            className={clsx(
              "flex-1 border text-xs py-1 rounded transition",
              isSaved
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50"
            )}
            onClick={onSave}
            type="button"
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
