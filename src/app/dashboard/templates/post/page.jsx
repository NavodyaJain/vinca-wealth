"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PostReflectionPage() {
  const [photo, setPhoto] = useState(null);
  const [story, setStory] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const fileInputRef = useRef();
  const router = useRouter();

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleStoryChange(e) {
    const text = e.target.value;
    setStory(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!story.trim()) return;
    // Save to localStorage
    const prev = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const newReflection = {
      id: `reflection_${Date.now()}`,
      name: "You",
      avatar: photo || "",
      hook: story.split(". ")[0] || "A new reflection.",
      preview: story.slice(0, 120) + (story.length > 120 ? "..." : ""),
      full: story.split(/\n+/).map(p => p.trim()).filter(Boolean)
    };
    localStorage.setItem("vinca_reflections", JSON.stringify([newReflection, ...prev]));
    router.push("/dashboard/templates");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg w-full flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Share Your Reflection</h1>
          <p className="text-slate-600 mb-2">Your experience can help others feel less alone on their journey.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-emerald-100 flex items-center justify-center">
            {photo ? (
              <img src={photo} alt="Avatar preview" className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl text-slate-400">👤</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            className="text-emerald-700 underline text-sm mt-1"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >{photo ? "Change Photo" : "Upload Photo (optional)"}</button>
        </div>
        <div className="bg-slate-50 rounded p-3 text-slate-600 text-sm mb-1">
          <div className="mb-1 font-semibold text-slate-700">Reflection Prompts:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>What stage of your financial journey are you in?</li>
            <li>What felt confusing or difficult initially?</li>
            <li>What helped you take the first step?</li>
            <li>What would you tell someone just starting out?</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full min-h-[120px] max-h-60 rounded-lg border border-slate-200 p-3 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200"
            maxLength={3000}
            value={story}
            onChange={handleStoryChange}
            placeholder="Share your experience... (max 500 words)"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{wordCount} / 500 words</span>
            <span className="italic">Please share experiences, not advice.</span>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-5 py-2 text-base transition shadow disabled:opacity-60"
            disabled={!story.trim() || wordCount > 500}
          >Post Reflection</button>
        </form>
      </div>
    </div>
  );
}
