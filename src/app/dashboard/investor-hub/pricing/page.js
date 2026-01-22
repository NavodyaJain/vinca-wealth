export default function PricingPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg md:text-2xl font-bold text-emerald-900">Pricing</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Pricing Card */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col items-center border border-slate-200">
            <div className="text-4xl font-bold text-emerald-700 mb-2">₹1000<span className="text-lg font-normal">/year</span></div>
            <div className="text-lg font-semibold text-emerald-900 mb-2">Investor Hub Membership</div>
            <ul className="text-sm text-gray-700 mb-4 list-disc pl-5 text-left w-full">
              <li>Access all events, resources, and perks</li>
              <li>Exclusive community & portfolio review</li>
              <li>SEBI-compliant, educational only</li>
            </ul>
            <button className="w-full mt-2 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition">Become a Member</button>
          </div>
          {/* Right: Perks List */}
          <div className="bg-emerald-50 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col gap-3 border border-slate-200">
            <div className="font-semibold text-lg text-emerald-800 mb-2">Membership Includes:</div>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>✔️ All live events & webinars</li>
              <li>✔️ Video series & blog library</li>
              <li>✔️ Premium perks & coupons</li>
              <li>✔️ Portfolio review & feedback</li>
            </ul>
          </div>
        </div>
        {/* Four sections below */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="font-semibold text-emerald-700 mb-2">Events Access</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Attend exclusive webinars & workshops</li>
              <li>Group discussions with experts</li>
              <li>Monthly Q&A sessions</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="font-semibold text-emerald-700 mb-2">Resources Library</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Access all video series & blogs</li>
              <li>Download checklists & guides</li>
              <li>Curated for Indian investors</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="font-semibold text-emerald-700 mb-2">Perks & Coupons</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Exclusive discounts on books & services</li>
              <li>Redeemable coupons for members</li>
              <li>New perks added every quarter</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="font-semibold text-emerald-700 mb-2">Portfolio Review</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Upload your portfolio for review</li>
              <li>Get educational feedback</li>
              <li>SEBI-compliant, no investment advice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
