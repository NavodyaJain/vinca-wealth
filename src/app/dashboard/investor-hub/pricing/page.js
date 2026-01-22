import { Bell, CheckCircle, Users, Calendar, BookOpen, Gift, FileText, UserCheck, Upload, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero Card: Membership Fees & Inclusions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Pricing */}
          <div>
            <div className="text-2xl font-bold text-emerald-900 mb-2">Membership fees & inclusions</div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-bold text-emerald-700">₹1,000</span>
              <span className="text-lg text-gray-400 line-through">₹2,000</span>
              <span className="text-lg font-medium text-emerald-700">/ year</span>
            </div>
            <button className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition mb-2">Become a member</button>
            <div className="text-xs text-gray-500 mt-1">Educational membership. No stock tips or recommendations.</div>
          </div>
          {/* Right: Inclusions Checklist */}
          <div>
            <div className="text-lg font-semibold text-emerald-800 mb-4">Full membership includes</div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-800 text-base"><CheckCircle className="h-5 w-5 text-emerald-500" /> Investor Hub community access (retirement planning)</li>
              <li className="flex items-center gap-3 text-gray-800 text-base"><Calendar className="h-5 w-5 text-emerald-500" /> Live events & webinars</li>
              <li className="flex items-center gap-3 text-gray-800 text-base"><BookOpen className="h-5 w-5 text-emerald-500" /> Curated resources & video series</li>
              <li className="flex items-center gap-3 text-gray-800 text-base"><Gift className="h-5 w-5 text-emerald-500" /> Perks & discount coupons</li>
              <li className="flex items-center gap-3 text-gray-800 text-base"><FileText className="h-5 w-5 text-emerald-500" /> Portfolio Review (upload + analysis workflow)</li>
              <li className="flex items-center gap-3 text-gray-800 text-base"><UserCheck className="h-5 w-5 text-emerald-500" /> Elevate: 1:1 wealth manager session booking (educational)</li>
            </ul>
          </div>
        </div>
        {/* Feature Breakdown Sections */}
        <div className="space-y-10">
          {/* Section A: Events */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Events</div>
              <div className="text-gray-600 mb-4">Learn with structured sessions designed for retirement planning clarity.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-gray-800">
              <li className="flex items-center gap-2"><Calendar className="h-5 w-5 text-emerald-500" /> Group-wise events</li>
              <li className="flex items-center gap-2"><Users className="h-5 w-5 text-emerald-500" /> Interested/Registered tracking</li>
              <li className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Past event archive</li>
              <li className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-emerald-500" /> SEBI-safe educational topics</li>
            </ul>
          </div>
          {/* Section B: Resources */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Learning Resources</div>
              <div className="text-gray-600 mb-4">Curated articles + guided video series to simplify retirement decisions.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-gray-800">
              <li className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-emerald-500" /> Blogs</li>
              <li className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Video series in modules (Udemy style)</li>
              <li className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" /> Watch progress tracking (localStorage)</li>
              <li className="flex items-center gap-2"><ArrowRight className="h-5 w-5 text-emerald-500" /> Beginner → Advanced content paths</li>
            </ul>
          </div>
          {/* Section C: Perks */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Member Perks</div>
              <div className="text-gray-600 mb-4">Discounts on tools, tax filing, books, health checks, and finance services.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-gray-800">
              <li className="flex items-center gap-2"><Gift className="h-5 w-5 text-emerald-500" /> Multiple categories</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-500" /> Redeemable coupons</li>
              <li className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Perk preview page</li>
              <li className="flex items-center gap-2"><Calendar className="h-5 w-5 text-emerald-500" /> Validity tracking</li>
            </ul>
          </div>
          {/* Section D: Portfolio Review */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Portfolio Review</div>
              <div className="text-gray-600 mb-4">Upload portfolio and get structured insights (education-only).</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-gray-800">
              <li className="flex items-center gap-2"><Upload className="h-5 w-5 text-emerald-500" /> Upload PDF/images</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-500" /> “Review My Portfolio” flow</li>
              <li className="flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Output placeholder section (future analysis)</li>
            </ul>
          </div>
          {/* Section E: Elevate */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="text-xl font-bold text-emerald-800 mb-2">Elevate</div>
              <div className="text-gray-600 mb-4">Personal guidance sessions to refine your plan with expert support.</div>
            </div>
            <ul className="col-span-2 grid grid-cols-2 gap-3 text-base text-gray-800">
              <li className="flex items-center gap-2"><Users className="h-5 w-5 text-emerald-500" /> Wealth manager profiles</li>
              <li className="flex items-center gap-2"><Calendar className="h-5 w-5 text-emerald-500" /> Book appointment CTA</li>
              <li className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" /> Eligibility step tracker (tools completion)</li>
            </ul>
          </div>
        </div>
        {/* Disclaimer Footer */}
        <div className="text-xs text-gray-400 mt-10 text-center">This is an educational community. Not investment advice. We do not provide stock recommendations.</div>
      </div>
    </div>
  );
}
