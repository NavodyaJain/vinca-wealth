"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

const GRADIENT_PLACEHOLDER = (
  <div className="w-full h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center rounded-t-2xl">
    <span className="text-5xl text-emerald-200">📝</span>
  </div>
);

export default function ReflectionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reflection, setReflection] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
      const found = all.find(r => r.id === id);
      setReflection(found || null);
      
      // Initialize likes from localStorage
      const storedLikes = JSON.parse(localStorage.getItem("reflection_likes") || "{}");
      setLikes(storedLikes);
    }
  }, [id]);

  const handleLike = () => {
    const newLikes = { ...likes, [id]: !likes[id] };
    setLikes(newLikes);
    localStorage.setItem("reflection_likes", JSON.stringify(newLikes));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Reflection",
        text: reflection.full.join(" "),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const photos = reflection?.photos && Array.isArray(reflection.photos) && reflection.photos.length > 0
    ? reflection.photos
    : (reflection?.photo ? [reflection.photo] : []);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!reflection) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 mb-4">Reflection not found.</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Footprints</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-0 max-w-xl w-full flex flex-col overflow-hidden">
        {/* Photo Slider */}
        {photos.length > 0 ? (
          <div className="relative w-full h-56 bg-slate-200">
            <img
              src={photos[currentPhotoIndex]}
              alt={`Reflection photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Like and Share buttons on photo */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleLike}
                className="bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
              >
                <Heart
                  size={20}
                  className={likes[id] ? "fill-red-500 text-red-500" : "text-slate-600"}
                />
              </button>
              <button
                onClick={handleShare}
                className="bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
              >
                <Share2 size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Photo Slider Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>

                {/* Photo Counter */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        ) : (
          GRADIENT_PLACEHOLDER
        )}
        
        <div className="flex flex-col gap-6 p-8">
          {reflection.full.map((para, idx) => (
            <p key={idx} className="text-slate-800 text-base leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
      <button className="mt-8 text-emerald-700 font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Footprints</button>
    </div>
  );
}
