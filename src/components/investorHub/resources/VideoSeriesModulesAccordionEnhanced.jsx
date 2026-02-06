// src/components/investorHub/resources/VideoSeriesModulesAccordionEnhanced.jsx
'use client';
import React, { useState, useCallback, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

export default function VideoSeriesModulesAccordionEnhanced({
  modules,
  completedVideos = {},
  selectedVideoId: parentSelectedVideoId,
  onVideoComplete,
  onSelectVideo,
  onNavigateNext,
  onNavigateToMaturity
}) {
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(parentSelectedVideoId || null);

  // Sync with parent's selectedVideoId when it changes
  useEffect(() => {
    if (parentSelectedVideoId !== selectedVideoId) {
      setSelectedVideoId(parentSelectedVideoId);
    }
  }, [parentSelectedVideoId]);

  // Check if a module is fully completed
  const isModuleCompleted = useCallback((moduleId) => {
    const module = modules?.find(m => m.moduleId === moduleId);
    if (!module || !module.videos) return false;
    return module.videos.every(vid => completedVideos[vid.videoId]);
  }, [modules, completedVideos]);

  // Get the video object by ID
  const getVideoById = useCallback((videoId) => {
    for (const module of modules || []) {
      const video = module.videos?.find(v => v.videoId === videoId);
      if (video) return video;
    }
    return null;
  }, [modules]);

  // Get all videos as a flat array
  const getAllVideos = useCallback(() => {
    if (!modules) return [];
    const allVideos = [];
    for (const module of modules) {
      for (const video of module.videos || []) {
        allVideos.push(video.videoId);
      }
    }
    return allVideos;
  }, [modules]);

  // Get current video index
  const getCurrentVideoIndex = useCallback(() => {
    if (!selectedVideoId) return -1;
    const allVideos = getAllVideos();
    return allVideos.indexOf(selectedVideoId);
  }, [selectedVideoId, getAllVideos]);

  // Get total video count
  const getTotalVideoCount = useCallback(() => {
    return getAllVideos().length;
  }, [getAllVideos]);

  // Check if a video is the last one
  const isVideoLastInSeries = useCallback(() => {
    if (!selectedVideoId) return false;
    const currentIndex = getCurrentVideoIndex();
    const totalCount = getTotalVideoCount();
    return currentIndex === totalCount - 1 && totalCount > 0;
  }, [selectedVideoId, getCurrentVideoIndex, getTotalVideoCount]);

  // Get the next video ID by index
  const getNextVideoIdByIndex = useCallback(() => {
    const currentIndex = getCurrentVideoIndex();
    const allVideos = getAllVideos();
    if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
      return allVideos[currentIndex + 1];
    }
    return null;
  }, [getCurrentVideoIndex, getAllVideos]);

  // Handle video completion from VideoPlayer (with autoPlay/viewMaturity flags)
  const handleVideoPlayerCompletion = (options = {}) => {
    const { autoPlay = false, viewMaturity = false, nextVideo = false } = options;

    if (viewMaturity) {
      // Mark current video as completed
      if (onVideoComplete && selectedVideoId) {
        onVideoComplete({ videoId: selectedVideoId, autoPlay: false, viewMaturity: true });
      }
      // Navigate to maturity page (delegated to page component)
      if (onNavigateToMaturity) {
        onNavigateToMaturity();
      }
      return;
    }

    if (nextVideo && selectedVideoId) {
      // User clicked "Next Video" button
      if (onVideoComplete) {
        onVideoComplete({ videoId: selectedVideoId, nextVideo: true });
      }
      // Page component will handle setting next video
      return;
    }

    if (autoPlay && selectedVideoId) {
      // Mark current video as completed and trigger auto-play in the page
      if (onVideoComplete) {
        onVideoComplete({ videoId: selectedVideoId, autoPlay: true });
      }
      // Page component will handle setting next video and scrolling
      return;
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No modules added yet.</div>
    );
  }

  const selectedVideo = getVideoById(selectedVideoId);
  const isLastVideo = isVideoLastInSeries();

  return (
    <div>
      {/* Video Player - if selected */}
      {selectedVideo && (
        <div data-video-player className="mb-8">
          <VideoPlayer
            videoSrc={`/template_video1.mp4`}
            videoTitle={selectedVideo.title}
            isLastVideo={isLastVideo}
            onCompletion={handleVideoPlayerCompletion}
          />
        </div>
      )}

      {/* Modules List */}
      <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {modules.map((mod, moduleIdx) => {
          const isModuleCompleted_ = isModuleCompleted(mod.moduleId);
          const isModuleOpen = openModuleIndex === moduleIdx;

          return (
            <div key={mod.moduleId}>
              {/* Module Header */}
              <button
                className={`w-full flex justify-between items-center py-4 px-5 text-left focus:outline-none transition-colors ${
                  isModuleOpen ? 'bg-slate-50 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                }`}
                onClick={() => setOpenModuleIndex(isModuleOpen ? null : moduleIdx)}
                aria-expanded={isModuleOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Completion Check */}
                  {isModuleCompleted_ && (
                    <span className="text-emerald-600 font-bold text-lg shrink-0">✓</span>
                  )}
                  {!isModuleCompleted_ && (
                    <span className="text-slate-300 font-bold text-lg shrink-0">○</span>
                  )}

                  {/* Module Info */}
                  <div className="min-w-0">
                    <span className={`font-semibold text-base block truncate ${
                      isModuleCompleted_ ? 'text-slate-600' : 'text-slate-900'
                    }`}>
                      {mod.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {mod.videos?.length || 0} videos
                      {isModuleCompleted_ && ' • Completed'}
                    </span>
                  </div>
                </div>

                {/* Expand Icon */}
                <span className={`text-slate-400 ml-2 shrink-0 transition-transform ${
                  isModuleOpen ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>

              {/* Module Content - Videos */}
              {isModuleOpen && (
                <div className="bg-slate-50 px-5 py-4 border-t border-slate-100">
                  {mod.videos && mod.videos.length > 0 ? (
                    <ul className="space-y-2">
                      {mod.videos.map((vid, vidIdx) => {
                        const isVideoCompleted = completedVideos[vid.videoId];
                        const isVideoSelected = selectedVideoId === vid.videoId;

                        return (
                          <li key={vid.videoId}>
                            <button
                              onClick={() => {
                                setSelectedVideoId(vid.videoId);
                                if (onSelectVideo) {
                                  onSelectVideo(vid.videoId);
                                }
                                // Scroll to player
                                setTimeout(() => {
                                  document.querySelector('[data-video-player]')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className={`w-full flex items-start gap-3 py-3 px-3 rounded-lg transition-all text-left ${
                                isVideoSelected
                                  ? 'bg-white border-l-4 border-emerald-600 shadow-sm'
                                  : 'hover:bg-white hover:border-l-4 hover:border-slate-300'
                              }`}
                            >
                              {/* Video Status */}
                              <div className="shrink-0 mt-0.5">
                                {isVideoCompleted ? (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300">
                                    <span className="text-xs font-bold text-slate-400">{vidIdx + 1}</span>
                                  </span>
                                )}
                              </div>

                              {/* Video Info */}
                              <div className="flex-1 min-w-0">
                                <span className={`font-medium text-sm block ${
                                  isVideoCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                                }`}>
                                  {vid.title}
                                </span>
                                <span className="text-xs text-slate-500 mt-1 block">
                                  {vid.durationMinutes} min
                                </span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-slate-400 text-sm py-2">No videos in this module.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
