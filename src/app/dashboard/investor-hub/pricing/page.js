import { CheckCircle, Zap, Footprints, BookOpen, Target, Lightbulb, Users } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-6xl">
        
        {/* HERO CARD: PRICING & INCLUSIONS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Pricing */}
          <div>
            <div className="text-2xl font-bold text-emerald-900 mb-2">Membership fees & inclusions</div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-bold text-emerald-700">₹2500</span>
              <span className="text-lg font-medium text-emerald-700">/ year</span>
            </div>
            <button className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition mb-2">
              Become a member
            </button>
            <div className="text-xs text-slate-500 mt-2">
              Educational platform. No product selling. No stock tips.
            </div>
          </div>

          {/* Right: Inclusions Checklist */}
          <div>
            <div className="text-lg font-semibold text-emerald-800 mb-4">Full membership includes</div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Tools to understand your financial reality
              </li>
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Sprints for consistent, focused progress
              </li>
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Footprints to share and learn together
              </li>
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Curated resources to support your journey
              </li>
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Learning modules for financial clarity
              </li>
              <li className="flex items-center gap-3 text-slate-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                Elevate: optional 1:1 guidance sessions
              </li>
            </ul>
          </div>
        </div>

        {/* FEATURE BREAKDOWN SECTIONS */}
        <div className="space-y-10">

          {/* SPRINTS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Sprints</div>
              <div className="text-slate-600 mb-4">Build financial discipline through small, focused actions instead of overwhelming plans.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                Consistency over intensity
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                Time-bound focus areas
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                Habit-building around saving and planning
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                Progress through regular participation
              </li>
            </ul>
          </div>

          {/* FOOTPRINTS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Footprints</div>
              <div className="text-slate-600 mb-4">Share your financial journey and learn from others navigating similar challenges at every stage.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-500" />
                Share real financial challenges
              </li>
              <li className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-500" />
                Learn from community perspective
              </li>
              <li className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-500" />
                Progress-focused reflection
              </li>
              <li className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-500" />
                Community-driven learning
              </li>
            </ul>
          </div>

          {/* REFLECTIONS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Reflections</div>
              <div className="text-slate-600 mb-4">Capture your personal experience with Vinca and share what's working, what's unclear, and how we can improve.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                Reflect on your product experience
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                Share feedback and suggestions
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                Surface confusion or clarity gaps
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                Help shape our learning content
              </li>
            </ul>
          </div>

          {/* LEARNING */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Learning</div>
              <div className="text-slate-600 mb-4">Structured content designed to build your financial maturity step by step, from confusion to clarity.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Video series and modules
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Real-life financial clarity
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Beginner to advanced paths
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Conceptual maturity tracking
              </li>
            </ul>
          </div>

          {/* CURATIONS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Curations</div>
              <div className="text-slate-600 mb-4">Thoughtfully selected books, tools, and products that make your financial readiness journey more engaging and human.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Handpicked, intentional selection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Supports motivation and learning
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Makes the journey feel less intimidating
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Focused on relevance, never promotion
              </li>
            </ul>
          </div>

          {/* ELEVATE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Elevate</div>
              <div className="text-slate-600 mb-4">Optional one-on-one guidance for validation and clarity on your next steps. Fully user-initiated, educational-only.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-slate-800">
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Fully optional, user-initiated
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Validate your existing plans
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Add confidence and perspective
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Educational-only, no product selling
              </li>
            </ul>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <div className="text-xs text-slate-500 mt-10 text-center">
          SEBI-safe. Education-only platform. No product recommendations.
        </div>
      </div>
    </div>
  );
}
