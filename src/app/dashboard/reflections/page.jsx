"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GRADIENT_PLACEHOLDER = (
  <div className="w-full h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center rounded-t-2xl">
    <span className="text-4xl text-emerald-300">📝</span>
  </div>
);

const DEFAULT_REFLECTIONS = [
  {
    id: "reflection_003",
    photo: "",
    hook: "My biggest win wasn’t higher returns — it was peace of mind.",
    full: [
      "For a long time, I judged my progress only by numbers. Corpus size. XIRR. Net worth milestones. But I was constantly stressed, even when things were going well.",
      "The real shift happened when I aligned my plan with my life instead of chasing benchmarks. I accounted for health, family needs, and flexibility — not just retirement age.",
      "Knowing that I could handle surprises gave me more confidence than any spreadsheet ever did.",
      "Financial readiness isn’t about perfection. It’s about sleeping well at night, knowing you’re prepared."
    ],
    createdAt: 3,
    isDefault: true
  },
  {
    id: "reflection_002",
    photo: "",
    hook: "I stopped waiting for motivation and focused on consistency instead.",
    full: [
      "There was a phase where I kept delaying my SIPs because the market didn’t “feel right.” I’d wait for the perfect time, read more articles, and convince myself I’d start next month.",
      "Eventually, I realised that this hesitation was costing me more than market volatility ever could.",
      "What helped was committing to a small, boring, repeatable action. Same date. Same amount. No thinking involved.",
      "Once I treated investing like a routine instead of a decision, the anxiety reduced. Progress became visible — not just financially, but mentally.",
      "You don’t need confidence to begin. You build confidence by showing up consistently."
    ],
    createdAt: 2,
    isDefault: true
  },
  {
    id: "reflection_001",
    photo: "",
    hook: "I thought saving was enough — until I realised I had no direction.",
    full: [
      "I started saving money in my mid-20s because everyone told me it was the right thing to do. I had an FD, some cash in my account, and occasional investments, but no real clarity.",
      "What confused me most was not knowing *how much was enough* or *what I was actually working toward*. Retirement felt too far away to plan seriously, yet too important to ignore.",
      "The turning point came when I wrote down my future expenses instead of just focusing on returns. That simple exercise made things real. I wasn’t behind — I was just unstructured.",
      "If you’re starting out and feeling lost, that’s normal. Direction comes before speed."
    ],
    createdAt: 1,
    isDefault: true
  }
];

export default function ReflectionsHome() {
  // Only user reflections in state
  const [userReflections, setUserReflections] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vinca_reflections");
      if (saved) setUserReflections(JSON.parse(saved));
      window.onstorage = () => {
        const updated = localStorage.getItem("vinca_reflections");
        if (updated) setUserReflections(JSON.parse(updated));
      };
    }
  }, []);
  const router = useRouter();
  // User reflections sorted newest first
  const sortedUserReflections = [...userReflections].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  // Final feed: user reflections first, then defaults
  const feed = [...sortedUserReflections, ...DEFAULT_REFLECTIONS];

  function goToPost() {
    router.push("/dashboard/reflections/post");
  }
  function viewStory(id) {
    router.push(`/dashboard/reflections/${id}`);
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 px-0 py-8 relative">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6 px-2 sm:px-4 lg:px-0">
        <div className="mb-2 text-left">
          <p className="text-slate-600 text-base text-left">Leave your financial readiness footprints and learn from others who’ve walked the path.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 justify-center items-stretch">
          {feed.map(story => (
            <div key={story.id} className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition hover:shadow-xl h-full min-w-0 max-w-xl mx-auto" style={{minHeight:'320px'}}>
              {story.photo ? (
                <img src={story.photo} alt="Reflection moment" className="w-full h-44 object-cover object-center rounded-t-2xl" />
              ) : (
                GRADIENT_PLACEHOLDER
              )}
              <div className="flex flex-col gap-4 p-6 flex-1 justify-between">
                <div className="text-slate-900 text-base font-medium leading-snug mb-2" style={{whiteSpace:'pre-line'}}>{story.hook}</div>
                <button
                  className="mt-auto text-emerald-700 font-semibold text-base rounded-full px-0 py-1 transition hover:underline text-left"
                  onClick={() => viewStory(story.id)}
                  style={{alignSelf:'flex-start'}}
                >View &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating Post Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition text-3xl group"
        onClick={goToPost}
        aria-label="Share a reflection"
        title="Share a reflection"
        style={{boxShadow:'0 4px 24px 0 rgba(16, 185, 129, 0.15)'}}
      >
        <span className="group-hover:scale-110 transition">+</span>
      </button>
    </div>
  );
}
