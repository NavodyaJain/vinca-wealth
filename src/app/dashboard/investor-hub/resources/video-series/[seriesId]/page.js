"use client";
import { useParams, useRouter } from "next/navigation";
import { videoSeries } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";
import useLearningProgress from "@/hooks/useLearningProgress";
import VideoSeriesModulesAccordionEnhanced from "@/components/investorHub/resources/VideoSeriesModulesAccordionEnhanced";
import SeriesCompletionModal from "@/components/investorHub/resources/SeriesCompletionModal";
import { useMemo, useEffect, useState, useCallback } from "react";

export default function VideoSeriesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { savedSeries, toggleSavedSeries } = useResourcesSavedState();
  const { progress, markSeriesCompleted } = useLearningProgress();
  
  const [mounted, setMounted] = useState(false);
  const [completedVideos, setCompletedVideos] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Scroll to video player when it's playing via auto-play
  useEffect(() => {
    if (selectedVideoId && currentVideoIndex > 0) {
      // Delay scroll to allow video to load
      setTimeout(() => {
        document.querySelector('[data-video-player]')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedVideoId, currentVideoIndex]);

  const seriesId = params?.seriesId;
  const series = useMemo(() => videoSeries.find((s) => s.id === seriesId), [seriesId]);

  // Get series difficulty
  const getDifficulty = (series) => {
    const difficulty = series?.difficulty?.toLowerCase() || 'beginner';
    if (difficulty.includes('advanced')) return 'advanced';
    if (difficulty.includes('intermediate')) return 'intermediate';
    return 'beginner';
  };

  // Calculate total videos
  const getTotalVideos = (series) => {
    if (!series?.modules) return 0;
    return series.modules.reduce((acc, m) => acc + (m.videos?.length || 0), 0);
  };

  // Get all videos as a flat array (for index-based navigation)
  const getAllVideos = useCallback(() => {
    if (!series?.modules) return [];
    const allVideos = [];
    for (const module of series.modules) {
      for (const video of module.videos || []) {
        allVideos.push({ ...video, moduleId: module.moduleId });
      }
    }
    return allVideos;
  }, [series]);

  // Get video by index in the flat array
  const getVideoByIndex = useCallback((index) => {
    const allVideos = getAllVideos();
    return allVideos[index] || null;
  }, [getAllVideos]);

  // Get index of a video by its ID
  const getVideoIndex = useCallback((videoId) => {
    const allVideos = getAllVideos();
    return allVideos.findIndex(v => v.videoId === videoId);
  }, [getAllVideos]);

  // Check if a video index is the last video
  const isLastVideoIndex = (index) => {
    const totalVideos = getTotalVideos(series);
    return index === totalVideos - 1;
  };

  // Get the last video ID in the series
  const getLastVideoId = (series) => {
    if (!series?.modules || series.modules.length === 0) return null;
    const lastModule = series.modules[series.modules.length - 1];
    const lastVideo = lastModule.videos?.[lastModule.videos.length - 1];
    return lastVideo?.videoId || null;
  };

  // Check if all videos are completed
  const areAllVideosCompleted = () => {
    if (!series?.modules) return false;
    const totalVids = getTotalVideos(series);
    const completedCount = Object.keys(completedVideos).length;
    return totalVids > 0 && completedCount === totalVids;
  };

  // Handle video completion
  const handleVideoComplete = (options = {}) => {
    const { autoPlay = false, viewMaturity = false, nextVideo = false, videoId } = options;

    if (!videoId) return;

    // Always mark the video as completed
    setCompletedVideos(prev => {
      const newCompleted = { ...prev, [videoId]: true };
      
      // Check if all videos are now completed
      const totalVids = getTotalVideos(series);
      if (Object.keys(newCompleted).length === totalVids) {
        const difficulty = getDifficulty(series);
        // Pass series ID to avoid duplicate counting
        markSeriesCompleted(difficulty, series.id);
        setShowCompletionModal(true);
      }

      return newCompleted;
    });

    // Handle manual next video or auto-play
    if (nextVideo || autoPlay) {
      const currentIndex = getVideoIndex(videoId);
      const nextIndex = currentIndex + 1;
      const nextVideoObj = getVideoByIndex(nextIndex);
      
      if (nextVideoObj) {
        // Next video exists - set it
        setCurrentVideoIndex(nextIndex);
        setSelectedVideoId(nextVideoObj.videoId);
      }
    }

    // Handle maturity page navigation
    if (viewMaturity) {
      router.push('/dashboard/investor-hub/resources');
    }
  };

  if (!series) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-lg font-semibold mb-2">Series not found</div>
        <button
          className="px-4 py-2 rounded bg-emerald-600 text-white mt-2"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
    );
  }

  const totalVideos = getTotalVideos(series);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 pb-12">
      <div className="pt-4 pb-2">
        <button
          className="mb-4 px-4 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors"
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
          <p className="text-slate-600 mb-2">{series.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {series.difficulty}
            </span>
            {series.tags?.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <div className="mb-8">
            <h2 className="font-semibold text-lg text-slate-900 mb-3">Learning Outcomes</h2>
            <ul className="list-disc pl-6 text-slate-700 text-sm space-y-1">
              <li>Understand retirement planning basics</li>
              <li>Learn to estimate your retirement needs</li>
              <li>Explore tax strategies for retirees</li>
            </ul>
          </div>

          {/* Video Modules */}
          <div className="mb-8">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Course Content</h2>
            <VideoSeriesModulesAccordionEnhanced
              modules={series.modules}
              completedVideos={completedVideos}
              selectedVideoId={selectedVideoId}
              onVideoComplete={handleVideoComplete}
              onSelectVideo={(videoId) => {
                setSelectedVideoId(videoId);
              }}
              onNavigateNext={(videoId) => {
                setSelectedVideoId(videoId);
              }}
              onNavigateToMaturity={() => {
                router.push('/dashboard/investor-hub/resources');
              }}
            />
          </div>
        </div>

        {/* Sticky side card */}
        <div className="w-full md:w-80 shrink-0">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col items-center">
            <img
              src="/template-image1.jpg"
              alt={series.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <div className="flex gap-2 text-xs text-slate-600 mb-4 flex-wrap justify-center">
              <span className="font-semibold">{series.modules?.length || 0} modules</span>
              <span>•</span>
              <span className="font-semibold">{totalVideos} videos</span>
              <span>•</span>
              <span className="font-semibold">{series.totalDurationMinutes} min</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700">Your Progress</span>
                <span className="text-xs font-bold text-emerald-600">
                  {Object.keys(completedVideos).length}/{totalVideos}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: totalVideos > 0 ? `${(Object.keys(completedVideos).length / totalVideos) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 w-full">
              <button
                className={`w-full text-sm py-2.5 rounded-lg font-semibold transition-all ${
                  mounted && savedSeries.includes(series.id)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
                onClick={() => toggleSavedSeries(series.id)}
                type="button"
                aria-pressed={mounted && savedSeries.includes(series.id)}
              >
                {mounted ? (savedSeries.includes(series.id) ? "✓ Saved" : "Save Series") : "Save Series"}
              </button>
              <button
                className="w-full border-2 border-slate-300 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition font-medium"
                onClick={() => {
                  // Scroll to first video
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

      {/* Completion Modal */}
      {showCompletionModal && (
        <SeriesCompletionModal
          seriesTitle={series.title}
          onCheckMaturity={() => {
            router.push('/dashboard/investor-hub/resources');
          }}
          onContinue={() => {
            router.push('/dashboard/investor-hub/resources');
          }}
        />
      )}

      <span className="block text-xs text-slate-500 mt-8">Educational content for awareness only. Not investment advice. Please consult a SEBI-registered advisor for personalized decisions.</span>
    </div>
  );
}
