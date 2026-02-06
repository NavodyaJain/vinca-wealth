"use client";


import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- DATA FETCHING UTILITY ---
function fetchExistingData() {
  const data = {};
  
  try {
    // Fetch Financial Readiness Calculator data
    const calcReading = JSON.parse(localStorage.getItem('calculatorReading') || '{}');
    if (calcReading) {
      data.retirementGoalAge = calcReading.targetRetirementAge;
      
      // Convert SIP to range
      const sip = calcReading.currentSIP || 0;
      if (sip < 25000) data.monthlySip = '< ₹25K';
      else if (sip < 50000) data.monthlySip = '₹25–50K';
      else if (sip < 75000) data.monthlySip = '₹50–75K';
      else if (sip < 100000) data.monthlySip = '₹75–100K';
      else data.monthlySip = '> ₹100K';
    }
    
    // Fetch Lifestyle Planner data
    const lifestyleReading = JSON.parse(localStorage.getItem('lifestylePlannerReading') || '{}');
    if (lifestyleReading) {
      data.familyStatus = lifestyleReading.familyStatus;
      data.careerStage = lifestyleReading.careerStage;
    }
    
    // Fetch user profile
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (userProfile) {
      const firstName = userProfile.firstName || '';
      const lastName = userProfile.lastName || '';
      data.name = `${firstName} ${lastName}`.trim();
    }
    
    // Calculate age from DOB if available
    if (userProfile?.dateOfBirth) {
      const dob = new Date(userProfile.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age >= 30 && age < 36) data.ageRange = '30–35';
      else if (age >= 36 && age < 41) data.ageRange = '36–40';
      else if (age >= 41 && age < 46) data.ageRange = '41–45';
      else if (age >= 46 && age < 51) data.ageRange = '46–50';
      else if (age >= 51 && age < 56) data.ageRange = '51–55';
      else if (age >= 56 && age < 61) data.ageRange = '56–60';
    }
  } catch (err) {
    console.error('Error fetching existing data:', err);
  }
  
  return data;
}

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

      <p className="text-sm text-gray-400 font-medium">Leave your financial readiness footprint here</p>
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

function CompactReflectionForm({ title, setTitle, story, setStory, wordCount, setWordCount, tags, setTags, journey, setJourney, existingData }) {
  // Rotating prompt logic
  const [promptIdx, setPromptIdx] = useState(0);
  const [showPromptDropdown, setShowPromptDropdown] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
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

  // Visibility toggles for context fields
  const toggleVisibility = (field) => {
    setJourney(prev => ({
      ...prev,
      context: {
        ...prev.context,
        visibleFields: prev.context.visibleFields.includes(field)
          ? prev.context.visibleFields.filter(f => f !== field)
          : [...prev.context.visibleFields, field]
      }
    }));
  };

  // Define fixed context fields (3 tags only, label-only, no values)
  const contextFields = [
    { id: 'name', label: 'Name' },
    { id: 'monthlySip', label: 'Monthly SIP' },
    { id: 'retirementGoal', label: 'Retirement Goal' }
  ];
  
  return (
    <div className="flex flex-col gap-4 max-h-100 h-100 justify-start bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 transition-all duration-200 overflow-y-auto">
      <div className="flex flex-col gap-3 w-full flex-shrink-0">
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
                    onClick={() => {
                      setTitle(p);
                      setPromptIdx(idx);
                      setShowPromptDropdown(false);
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button type="button" className="mt-1 text-xs text-gray-300 hover:text-gray-500" onClick={() => setShowPromptDropdown(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
        {/* Body - Structured Journey Builder */}
        <div className="flex flex-col gap-6">
          <label className="text-xs text-gray-400 font-medium">Your Journey</label>

          {/* SECTION 1: PERSONAL CONTEXT - VISIBILITY TOGGLES */}
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">What you're comfortable sharing</h3>
            <p className="text-xs text-gray-400 mb-4">You control what others see.</p>

            <div className="flex flex-wrap gap-2">
              {contextFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => toggleVisibility(field.id)}
                  className={`text-xs px-3 py-2 rounded-full transition border ${
                    journey.context.visibleFields.includes(field.id)
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {journey.context.visibleFields.includes(field.id) ? '✓ ' : ''}{field.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: CHALLENGES FACED */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Challenges I faced</h3>
            <div className="space-y-2">
              {journey.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => {
                      const newChallenges = [...journey.challenges];
                      newChallenges[index] = e.target.value;
                      setJourney(prev => ({ ...prev, challenges: newChallenges }));
                    }}
                    placeholder="Staying consistent during market volatility"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {index === journey.challenges.length - 1 && challenge.trim() && (
                    <button
                      type="button"
                      onClick={() => setJourney(prev => ({ ...prev, challenges: [...prev.challenges, ""] }))}
                      className="text-emerald-600 hover:text-emerald-700 text-lg font-light"
                    >
                      ＋
                    </button>
                  )}
                  {journey.challenges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setJourney(prev => ({ ...prev, challenges: prev.challenges.filter((_, i) => i !== index) }))}
                      className="text-gray-400 hover:text-gray-600 text-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: HOW I DEALT WITH THEM */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">How I dealt with these challenges</h3>
            <textarea
              value={journey.howTheyHandled}
              onChange={(e) => setJourney(prev => ({ ...prev, howTheyHandled: e.target.value }))}
              placeholder="What helped me stay on track (habits, mindset, structure, changes I made)"
              className="w-full h-20 px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-gray-50"
            />
          </div>

          {/* SECTION 4: REFLECTION / CONCLUSION */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Looking back</h3>
            <textarea
              value={journey.reflection}
              onChange={(e) => setJourney(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="What I learned from this phase, or what I'd remind myself during tough months"
              className="w-full h-16 px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-gray-50"
            />
          </div>
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
        Post
      </button>
      <div className="text-xs text-gray-300 mt-2 font-medium">Shared as a personal reflection. Not financial advice.</div>
    </footer>
  );
}


export default function PostReflectionPage() {
  // --- Single-screen state ---
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [tags, setTags] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [existingData, setExistingData] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [journey, setJourney] = useState({
    context: {
      visibleFields: []
    },
    challenges: [""],
    howTheyHandled: "",
    reflection: ""
  });
  const router = useRouter();

  // Fetch existing data on mount (client-side only)
  useEffect(() => {
    setIsHydrated(true);
    const data = fetchExistingData();
    setExistingData(data);
  }, []);

  // --- Logic preserved ---
  const isFormValid = (journey.challenges.some(c => c.trim()) || journey.howTheyHandled.trim() || journey.reflection.trim());
  const handleSubmit = (e) => {
    e.preventDefault();
    const hasContent = journey.challenges.some(c => c.trim()) || journey.howTheyHandled.trim() || journey.reflection.trim();
    if (!hasContent) return;
    
    // Build context object with values for visible fields
    const contextData = {
      visibleFields: journey.context.visibleFields
    };
    
    // Add values for visible fields from existingData
    if (journey.context.visibleFields.includes('name')) {
      contextData.name = existingData.name || '';
    }
    if (journey.context.visibleFields.includes('ageRange')) {
      contextData.ageRange = existingData.ageRange || '';
    }
    if (journey.context.visibleFields.includes('retirementGoal')) {
      contextData.retirementGoal = existingData.retirementGoalAge || '';
    }
    if (journey.context.visibleFields.includes('monthlySip')) {
      contextData.monthlySip = existingData.monthlySip || '';
    }
    
    const cleanedJourney = {
      context: contextData,
      challenges: journey.challenges.filter(c => c.trim()),
      howTheyHandled: journey.howTheyHandled.trim(),
      reflection: journey.reflection.trim()
    };
    
    const prev = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const fullText = [
      ...cleanedJourney.challenges,
      cleanedJourney.howTheyHandled,
      cleanedJourney.reflection
    ].filter(Boolean).join(" ");
    
    const newReflection = {
      id: `reflection_${Date.now()}`,
      photo: photos[0] || "",
      title: title.trim() || cleanedJourney.challenges[0] || "A retirement journey.",
      hook: cleanedJourney.challenges[0] || "A retirement journey.",
      full: fullText.split(/\n+/).map(p => p.trim()).filter(Boolean),
      journey: cleanedJourney
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
            journey={journey}
            setJourney={setJourney}
            existingData={existingData}
          />
        </main>
        <SubmitSection isFormValid={isFormValid} />
      </form>
    </div>
  );
}
