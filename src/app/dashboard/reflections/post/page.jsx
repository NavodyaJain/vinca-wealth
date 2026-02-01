"use client";


import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";


// --- UI Subcomponents (Tailwind only, strict constraints) ---
const PROMPTS = [
  "A moment of clarity I didn’t expect",
  "What changed my approach to money",
  "A risk I took that paid off",
  "How I handled a setback",
  "A lesson I wish I learned sooner"
];

function PageIntro() {
  return (
    <header className="w-full mb-4">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight mb-1">Share a Reflection</h1>
      <p className="text-sm text-gray-400 font-medium">A personal moment, lesson, or insight from your financial journey.</p>
    </header>
  );
}

function PhotoMomentsSection({ photos, setPhotos }) {
  // Handles photo upload and removal for up to 2 photos
  const handlePhotoUpload = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newPhotos = [...photos];
      newPhotos[idx] = ev.target.result;
      setPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = (idx) => {
    const newPhotos = [...photos];
    newPhotos[idx] = undefined;
    setPhotos(newPhotos.filter(Boolean));
  };
  return (
    <section className="flex flex-col gap-3 max-h-100 h-100 justify-start bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 transition-all duration-200">
      {[0, 1].map((idx) => {
        if (idx === 1 && !photos[0]) return null;
        return (
          <div key={idx} className="flex-1 flex items-center justify-center aspect-4/3 max-h-47.5 border-2 border-dashed border-emerald-100 rounded-lg bg-emerald-50/20 overflow-hidden relative transition-all duration-200">
            {photos[idx] ? (
              <div className="w-full h-full flex items-center justify-center group">
                <img src={photos[idx]} alt="Reflection" className="object-cover w-full h-full transition-all duration-300 rounded-lg" />
                <button type="button" className="absolute top-2 right-2 w-7 h-7 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 text-base shadow-sm hover:bg-gray-50 transition" onClick={() => handleRemovePhoto(idx)} title="Remove photo">×</button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-200">
                <span className="text-3xl mb-2 text-emerald-300">📷</span>
                <span className="text-xs text-gray-600 font-medium mb-0.5">Add a moment <span className="font-normal text-gray-400">(optional)</span></span>
                <span className="text-[11px] text-gray-400 text-center leading-tight">Family photo, life moment, or memory</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, idx)}
                />
              </label>
            )}
          </div>
        );
      })}
    </section>
  );
}

function CompactReflectionForm({ title, setTitle, story, setStory, wordCount, setWordCount, tags, setTags }) {
  // Generate from Sprint UI state
  const [genLoading, setGenLoading] = useState(false);
  // Rotating prompt logic
  const [promptIdx, setPromptIdx] = useState(0);
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);
  const [tagInput, setTagInput] = useState("");
  useEffect(() => {
    if (showPromptDropdown) return;
    const interval = setInterval(() => {
      setPromptIdx((i) => (i + 1) % PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showPromptDropdown]);
  // Tag input logic
  const handleTagInput = (e) => setTagInput(e.target.value);
  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };
  const handleRemoveTag = (idx) => setTags(tags.filter((_, i) => i !== idx));
  // Word count
  const handleStoryChange = (e) => {
    setStory(e.target.value);
    setWordCount(e.target.value.length);
  };
  // Prompt select
  const handlePromptSelect = (idx) => {
    setTitle(PROMPTS[idx]);
    setPromptIdx(idx);
    setShowPromptDropdown(false);
  };
  return (
    <div className="flex flex-col gap-4 max-h-100 h-100 justify-start bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 transition-all duration-200 overflow-hidden">
      <div className="flex flex-col gap-3 w-full">
        {/* Title + prompt */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium mb-1">Title</label>
          <input
            className="w-full h-10 px-3 py-2 text-base border border-gray-100 rounded-lg focus:outline-none focus:border-emerald-300 bg-gray-50 placeholder:text-emerald-300 placeholder:font-normal placeholder:text-base transition-all duration-200"
            type="text"
            placeholder={PROMPTS[promptIdx]}
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={80}
          />
          <div className="flex items-center gap-2 mt-1 relative">
            <button
              type="button"
              className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center gap-1 hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-100 transition-all duration-150 shadow-none"
              onClick={() => setShowPromptDropdown((v) => !v)}
              tabIndex={0}
            >
              <span role="img" aria-label="prompt">💡</span> Choose a prompt
            </button>
            {showPromptDropdown && (
              <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-100 rounded-lg shadow-lg p-2 flex flex-col gap-1">
                {PROMPTS.map((p, idx) => (
                  <button
                    key={p}
                    type="button"
                    className="text-left text-xs px-2 py-1 rounded hover:bg-emerald-50 text-gray-700"
                    onClick={() => handlePromptSelect(idx)}
                  >
                    {p}
                  </button>
                ))}
                <button type="button" className="mt-1 text-xs text-gray-300 hover:text-gray-500" onClick={() => setShowPromptDropdown(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
                {/* Body */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 font-medium mb-1">Reflection</label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-base border border-gray-100 rounded-lg resize-none focus:outline-none focus:border-emerald-300 bg-gray-50 placeholder:text-emerald-300 placeholder:font-normal placeholder:text-base transition-all duration-200"
                    placeholder="Write freely. This is your experience — not advice."
                    value={story}
                    onChange={handleStoryChange}
                    maxLength={500}
                    required
                  />
                  <div className="flex justify-end text-[11px] text-gray-300 font-medium">{wordCount}/500</div>
                </div>
                {/* Generate from Sprint helper (UI only, 404-safe) - moved below reflection */}
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center bg-emerald-50/40 border border-emerald-100 rounded-lg px-3 py-2 shadow-sm min-h-[48px] w-full transition-all duration-200">
                    <span className="flex items-center justify-center mr-3 text-emerald-400 text-lg">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="currentColor" d="M10.75 2.5a.75.75 0 0 0-1.5 0v1.19A6.5 6.5 0 0 0 4.19 9.25H3a.75.75 0 0 0 0 1.5h1.19A6.5 6.5 0 0 0 9.25 16.31V17.5a.75.75 0 0 0 1.5 0v-1.19A6.5 6.5 0 0 0 15.81 10.75H17a.75.75 0 0 0 0-1.5h-1.19A6.5 6.5 0 0 0 10.75 3.69V2.5Zm-1.5 3.06V5.5a.75.75 0 0 0 1.5 0v-.06A5 5 0 0 1 14.44 9.25h-.06a.75.75 0 0 0 0 1.5h.06A5 5 0 0 1 10.75 14.44V14.5a.75.75 0 0 0-1.5 0v.06A5 5 0 0 1 5.56 10.75h.06a.75.75 0 0 0 0-1.5h-.06A5 5 0 0 1 9.25 5.56Z"/></svg>
                    </span>
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="text-xs font-semibold text-gray-700">Generate from Sprint</span>
                      <span className="text-xs text-gray-400 leading-tight">Turn your recent sprint progress into a reflection draft. You can edit it freely.</span>
                    </div>
                    <button
                      type="button"
                      className={`ml-3 text-xs px-3 py-1 rounded-md border border-emerald-200 bg-white text-emerald-500 font-medium shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1 ${genLoading ? 'pointer-events-none' : ''}`}
                      disabled={genLoading}
                      onClick={() => {
                        setGenLoading(true);
                        setTimeout(() => setGenLoading(false), 2000);
                      }}
                    >
                      {genLoading ? (
                        <>
                          <svg className="animate-spin mr-1" width="16" height="16" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/></svg>
                          Preparing draft...
                        </>
                      ) : (
                        'Generate draft'
                      )}
                    </button>
                  </div>
                  <span className="text-xs text-gray-300 mt-1 ml-1">Available with Pro</span>
                </div>
      </div>
    </div>
  );
}

function SubmitSection({ isFormValid }) {
  return (
    <footer className="w-full flex flex-col items-center mt-4">
      <button
        className="w-full h-9 bg-emerald-500 text-white text-base font-semibold rounded-lg shadow-sm disabled:bg-gray-100 disabled:text-gray-300 transition-all duration-150 hover:bg-emerald-600 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        type="submit"
        disabled={!isFormValid}
      >
        Post Reflection
      </button>
      <div className="text-xs text-gray-300 mt-2 font-medium">Shared as a personal reflection. Not financial advice.</div>
    </footer>
  );
}


export default function PostReflectionPage() {
  // --- Single-screen state ---
  const [photos, setPhotos] = useState([]); // max 2
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [tags, setTags] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();

  // ...existing logic and UI components here (unchanged)...

  // --- Logic preserved ---
  const isFormValid = story.trim().length > 0 && wordCount <= 500;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!story.trim()) return;
    const prev = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const newReflection = {
      id: `reflection_${Date.now()}`,
      photo: photos[0] || "",
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
  };
  // --- Render ---
  return (
    <div className="w-full h-screen max-h-screen min-h-150 flex flex-col items-center justify-start bg-gradient-to-b from-emerald-50/40 to-white p-4 select-none overflow-hidden">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col h-full">
        <PageIntro />
        <main className="grid grid-cols-2 gap-6 w-full flex-1 max-h-100 h-100 items-start">
          <PhotoMomentsSection photos={photos} setPhotos={setPhotos} />
          <CompactReflectionForm
            title={title}
            setTitle={setTitle}
            story={story}
            setStory={setStory}
            wordCount={wordCount}
            setWordCount={setWordCount}
            tags={tags}
            setTags={setTags}
          />
        </main>
        <SubmitSection isFormValid={isFormValid} />
      </form>
    </div>
  );
}
  // ...see above for new return and styles...
