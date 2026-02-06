"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PostReflectionPage() {
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef();
  const router = useRouter();

  // Journey data structure
  const [journey, setJourney] = useState({
    context: {
      name: undefined,
      ageRange: undefined,
      retirementGoalAge: undefined,
      monthlySipRange: undefined,
      familyStatus: undefined,
      careerStage: undefined
    },
    challenges: [""],
    howTheyHandled: "",
    reflection: ""
  });

  // Toggle states for context fields
  const [contextToggles, setContextToggles] = useState({
    name: false,
    ageRange: false,
    retirementGoalAge: false,
    monthlySipRange: false,
    familyStatus: false,
    careerStage: false
  });

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function toggleContextField(field) {
    setContextToggles(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    if (contextToggles[field]) {
      setJourney(prev => ({
        ...prev,
        context: {
          ...prev.context,
          [field]: undefined
        }
      }));
    }
  }

  function updateContextField(field, value) {
    setJourney(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [field]: value
      }
    }));
  }

  function updateChallenge(index, text) {
    const newChallenges = [...journey.challenges];
    newChallenges[index] = text;
    setJourney(prev => ({
      ...prev,
      challenges: newChallenges
    }));
  }

  function addChallenge() {
    setJourney(prev => ({
      ...prev,
      challenges: [...prev.challenges, ""]
    }));
  }

  function removeChallenge(index) {
    setJourney(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Filter out empty challenges and undefined context values
    const cleanedJourney = {
      context: Object.entries(journey.context).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") acc[key] = value;
        return acc;
      }, {}),
      challenges: journey.challenges.filter(c => c.trim()),
      howTheyHandled: journey.howTheyHandled.trim(),
      reflection: journey.reflection.trim()
    };

    // Ensure at least some content exists
    const hasContent =
      Object.keys(cleanedJourney.context).length > 0 ||
      cleanedJourney.challenges.length > 0 ||
      cleanedJourney.howTheyHandled.length > 0 ||
      cleanedJourney.reflection.length > 0;

    if (!hasContent) return;

    // Save to localStorage
    const prev = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const fullText = [
      ...cleanedJourney.challenges,
      cleanedJourney.howTheyHandled,
      cleanedJourney.reflection
    ].filter(Boolean).join(" ");

    const newReflection = {
      id: `reflection_${Date.now()}`,
      name: cleanedJourney.context.name || "You",
      avatar: photo || "",
      hook: cleanedJourney.challenges[0] || "A retirement journey.",
      preview: fullText.slice(0, 120) + (fullText.length > 120 ? "..." : ""),
      full: fullText.split(/\n+/).map(p => p.trim()).filter(Boolean),
      journey: cleanedJourney
    };
    localStorage.setItem("vinca_reflections", JSON.stringify([newReflection, ...prev]));
    router.push("/dashboard/templates");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl w-full flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Journey</h1>
          <p className="text-slate-600 text-sm">Share your retirement journey in a way that feels true to your experience.</p>
        </div>

        {/* Photo Upload */}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* SECTION 1: PERSONAL CONTEXT */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Your context</h2>
            <p className="text-xs text-slate-500 mb-4">Choose what you want others to know about your journey</p>

            {/* Context Fields with Toggles */}
            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("name")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.name
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Name
                </button>
                {contextToggles.name && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={journey.context.name || ""}
                    onChange={(e) => updateContextField("name", e.target.value)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                )}
              </div>

              {/* Age Range */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("ageRange")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.ageRange
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Age range
                </button>
                {contextToggles.ageRange && (
                  <select
                    value={journey.context.ageRange || ""}
                    onChange={(e) => updateContextField("ageRange", e.target.value)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select age range</option>
                    <option value="30-35">30–35</option>
                    <option value="36-40">36–40</option>
                    <option value="41-45">41–45</option>
                    <option value="46-50">46–50</option>
                    <option value="51-55">51–55</option>
                    <option value="56-60">56–60</option>
                  </select>
                )}
              </div>

              {/* Retirement Goal Age */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("retirementGoalAge")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.retirementGoalAge
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Retirement goal age
                </button>
                {contextToggles.retirementGoalAge && (
                  <input
                    type="number"
                    placeholder="e.g., 60"
                    value={journey.context.retirementGoalAge || ""}
                    onChange={(e) => updateContextField("retirementGoalAge", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                )}
              </div>

              {/* Monthly SIP Range */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("monthlySipRange")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.monthlySipRange
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Monthly SIP
                </button>
                {contextToggles.monthlySipRange && (
                  <select
                    value={journey.context.monthlySipRange || ""}
                    onChange={(e) => updateContextField("monthlySipRange", e.target.value)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select range</option>
                    <option value="<25k">{'< ₹25K'}</option>
                    <option value="25-50k">₹25–50K</option>
                    <option value="50-75k">₹50–75K</option>
                    <option value="75-100k">₹75–100K</option>
                    <option value=">100k">{'> ₹100K'}</option>
                  </select>
                )}
              </div>

              {/* Family Status */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("familyStatus")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.familyStatus
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Family status
                </button>
                {contextToggles.familyStatus && (
                  <select
                    value={journey.context.familyStatus || ""}
                    onChange={(e) => updateContextField("familyStatus", e.target.value)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="married-with-kids">Married with kids</option>
                  </select>
                )}
              </div>

              {/* Career Stage */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleContextField("careerStage")}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    contextToggles.careerStage
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  Career stage
                </button>
                {contextToggles.careerStage && (
                  <select
                    value={journey.context.careerStage || ""}
                    onChange={(e) => updateContextField("careerStage", e.target.value)}
                    className="ml-2 flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select stage</option>
                    <option value="early-career">Early career</option>
                    <option value="mid-career">Mid career</option>
                    <option value="senior-leadership">Senior/Leadership</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: CHALLENGES FACED */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Challenges I faced</h2>
            <div className="space-y-2">
              {journey.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => updateChallenge(index, e.target.value)}
                    placeholder="Staying consistent during market volatility"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {index === journey.challenges.length - 1 && challenge.trim() && (
                    <button
                      type="button"
                      onClick={addChallenge}
                      className="text-emerald-600 hover:text-emerald-700 text-lg font-light"
                    >
                      ＋
                    </button>
                  )}
                  {journey.challenges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChallenge(index)}
                      className="text-slate-400 hover:text-slate-600 text-lg"
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
            <h2 className="text-base font-semibold text-slate-900 mb-3">How I dealt with these challenges</h2>
            <textarea
              value={journey.howTheyHandled}
              onChange={(e) => setJourney(prev => ({ ...prev, howTheyHandled: e.target.value }))}
              placeholder="What helped me stay on track (habits, mindset, structure, changes I made)"
              className="w-full min-h-[100px] rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* SECTION 4: REFLECTION / CONCLUSION */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Looking back</h2>
            <textarea
              value={journey.reflection}
              onChange={(e) => setJourney(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="What I learned from this phase, or what I'd remind myself during tough months"
              className="w-full min-h-[80px] rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-50 rounded p-3 text-slate-600 text-xs border border-slate-200">
            <p>
              <span className="font-semibold text-slate-700">Shared as a personal experience.</span> Not financial advice.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-5 py-2 text-base transition shadow disabled:opacity-60"
            disabled={!journey.challenges.some(c => c.trim()) && !journey.howTheyHandled.trim() && !journey.reflection.trim()}
          >Post Your Journey</button>
        </form>
      </div>
    </div>
  );
}
