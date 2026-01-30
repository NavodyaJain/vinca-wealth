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
      photo: photo || "",
      hook: story.split(". ")[0] || "A new reflection.",
      full: story.split(/\n+/).map(p => p.trim()).filter(Boolean)
    };
    try {
      localStorage.setItem("vinca_reflections", JSON.stringify([newReflection, ...prev]));
      router.push("/dashboard/reflections");
    } catch (err) {
      if (err && err.name === "QuotaExceededError") {
        alert("Sorry, your browser storage is full. Please delete some old reflections or clear your browser storage and try again.");
      } else {
        alert("An error occurred while saving your reflection. Please try again.");
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg w-full flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Share Your Reflection</h1>
          <p className="text-slate-600 mb-2">Your experience can help someone else feel less alone.</p>
        </div>
        {/* Photo Upload */}
        <div className="flex flex-col gap-2">
          <div className="w-full aspect-[16/9] bg-slate-100 rounded-xl border-2 border-dashed border-emerald-100 flex items-center justify-center overflow-hidden relative">
            {photo ? (
              <img src={photo} alt="Reflection moment" className="object-cover w-full h-full rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full py-8">
                <span className="text-4xl text-emerald-200 mb-2">🖼️</span>
                <span className="text-slate-400 text-sm">Add a moment (optional)</span>
                <span className="text-slate-400 text-xs mt-1">This can be a family photo, life moment, or memory.</span>
                <span className="text-slate-300 text-xs mt-1">No faces required. You can stay anonymous.</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoChange}
              aria-label="Upload moment photo"
            />
          </div>
        </div>
        {/* Prompts */}
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 rounded-lg p-3 text-slate-700 text-sm shadow-sm">“What part of the journey are you in right now?”</div>
          <div className="bg-slate-50 rounded-lg p-3 text-slate-700 text-sm shadow-sm">“What felt confusing or heavy at first?”</div>
          <div className="bg-slate-50 rounded-lg p-3 text-slate-700 text-sm shadow-sm">“What helped you move forward?”</div>
          <div className="bg-slate-50 rounded-lg p-3 text-slate-700 text-sm shadow-sm">“What would you tell someone just starting?”</div>
        </div>
        {/* Story Textarea */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full min-h-[120px] max-h-60 rounded-lg border border-slate-200 p-3 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-emerald-200"
            maxLength={3000}
            value={story}
            onChange={handleStoryChange}
            placeholder="Write freely. This is not advice — just your experience."
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{wordCount} / 500 words</span>
            <span className="italic">Shared as a personal reflection. Not financial advice.</span>
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
