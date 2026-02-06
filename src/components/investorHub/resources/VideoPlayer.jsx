// src/components/investorHub/resources/VideoPlayer.jsx
'use client';
import React, { useRef, useState, useEffect } from 'react';

export default function VideoPlayer({
  videoSrc,
  videoTitle,
  onCompletion,
  isLastVideo = false
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Track video completion (95-100% watched)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentage = (currentTime / duration) * 100;
      
      setProgress(percentage);
      
      // Mark as completed at 95%
      if (percentage >= 95 && !isCompleted) {
        setIsCompleted(true);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    // Auto-hide controls after 3 seconds of inactivity
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden mb-6">
      {/* Video Container */}
      <div
        className="relative bg-black aspect-video flex items-center justify-center group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full"
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all group-hover:bg-opacity-40 z-10"
          >
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition-all">
              <span className="text-emerald-600 text-2xl ml-1">▶</span>
            </div>
          </button>
        )}

        {/* Congratulations Overlay - Last Video */}
        {isCompleted && isLastVideo && (
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900 to-teal-900 bg-opacity-95 flex flex-col items-center justify-center rounded-lg z-30">
            <div className="text-white text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold mb-3">Congratulations!</h2>
              <p className="text-lg text-slate-100 mb-8 max-w-sm">
                You've completed this series. This strengthens your financial awareness.
              </p>
              <button
                onClick={() => {
                  if (onCompletion) {
                    onCompletion({ viewMaturity: true });
                  }
                }}
                className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                View Your Maturity
              </button>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer mb-3 hover:h-2 transition-all group"
          >
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <span className="text-sm">🔊</span>
              </div>

              {/* Time Display */}
              <span className="text-sm ml-2">
                {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Playback Speed */}
              <div className="relative group">
                <button className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors text-sm font-semibold">
                  {playbackRate}x
                </button>
                <div className="hidden group-hover:flex flex-col absolute right-0 bottom-full bg-gray-900 rounded overflow-hidden border border-gray-700 z-20">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`px-2 py-1 text-sm hover:bg-gray-800 transition-colors ${
                        playbackRate === rate ? 'bg-emerald-600' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors text-sm"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{videoTitle}</h3>
        {isCompleted && !isLastVideo && (
          <button
            onClick={() => onCompletion({ nextVideo: true })}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded transition-colors"
          >
            Next Video →
          </button>
        )}
      </div>
    </div>
  );
}
