"use client";
import { useState } from "react";
import { videoSeries, blogs } from "@/data/investorHub/resourcesData";
import VideoSeriesCard from "@/components/investorHub/resources/VideoSeriesCard";
import BlogCard from "@/components/investorHub/resources/BlogCard";



const TABS = [
  { key: "video-series", label: "Video Series" },
  { key: "blogs", label: "Blogs" },
];

export default function ResourcesPage() {
  const [tab, setTab] = useState("video-series");
  return (
    <div className="max-w-5xl md:max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Investor Hub Resources</h1>
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
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
      {tab === "video-series" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videoSeries.map((series) => (
            <VideoSeriesCard
              key={series.id}
              series={series}
              onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
            />
          ))}
        </div>
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
  );
}
