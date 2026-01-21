"use client";
import { useParams, useRouter } from "next/navigation";
import { videoSeries } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";
import VideoSeriesModulesAccordion from "@/components/investorHub/resources/VideoSeriesModulesAccordion";
import { useMemo } from "react";

export default function VideoSeriesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { savedSeries, toggleSavedSeries } = useResourcesSavedState();
  const seriesId = params?.seriesId;
  const series = useMemo(() => videoSeries.find((s) => s.id === seriesId), [seriesId]);

  if (!series) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-lg font-semibold mb-2">Series not found</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white mt-2"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
    );
  }

  const totalVideos = series.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 pb-12">
      <div className="pt-4 pb-2">
        <button
          className="mb-4 px-4 py-1 rounded bg-gray-100 text-gray-700 hover:bg-blue-50 text-sm font-medium"
          onClick={() => router.push('/dashboard/investor-hub/resources')}
          type="button"
        >
          ← Back to Resources
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{series.title}</h1>
          <p className="text-gray-600 mb-2">{series.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{series.difficulty}</span>
            {series.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
            ))}
          </div>
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Learning Outcomes</h2>
            <ul className="list-disc pl-6 text-gray-700 text-sm">
              <li>Understand retirement planning basics</li>
              <li>Learn to estimate your retirement needs</li>
              <li>Explore tax strategies for retirees</li>
            </ul>
          </div>
        </div>
        {/* Sticky side card */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white border rounded-lg shadow-sm p-4 flex flex-col items-center">
            <img
              src={series.bannerImage || 'https://placehold.co/400x200?text=Resource+Image'}
              alt={series.title}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <div className="flex gap-2 text-xs text-gray-500 mb-2">
              <span>{series.modules?.length || 0} modules</span>
              <span>•</span>
              <span>{totalVideos} videos</span>
              <span>•</span>
              <span>{series.totalDurationMinutes} min</span>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
                onClick={() => toggleSavedSeries(series.id)}
                type="button"
              >
                {savedSeries.includes(series.id) ? "Saved" : "Save Series"}
              </button>
              <button
                className="w-full border border-blue-600 text-blue-700 text-sm py-2 rounded hover:bg-blue-50 transition"
                onClick={() => {
                  // Go to first module (stub)
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                type="button"
              >
                Start Watching
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modules Accordion */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">Modules</h2>
        <VideoSeriesModulesAccordion modules={series.modules} />
      </div>
      <span className="block text-xs text-gray-400 mt-8">Educational content for awareness only. Not investment advice. Please consult a SEBI-registered advisor for personalized decisions.</span>
    </div>
  );
}
