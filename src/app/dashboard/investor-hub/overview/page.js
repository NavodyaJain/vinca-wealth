import Link from 'next/link';

export default function InvestorHubOverview() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <span className="inline-block">🌱</span> What is the Investor Hub?
        </h2>
        <p className="text-gray-700 text-base max-w-2xl">
          Investor Hub is your premium community for learning, connecting, and discussing retirement planning with like-minded investors. Join focused groups, attend exclusive events, and access curated resources—all in one place.
        </p>
      </section>
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
          <span className="inline-block">🎁</span> What you’ll get
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Group discussions with investors like you</li>
          <li>Access to exclusive events and webinars</li>
          <li>Curated resources, guides, and checklists</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
          <span className="inline-block">🧭</span> How to participate
        </h3>
        <p className="text-gray-700 text-base max-w-2xl">
          Join the group that matches your investing style, register for events, and contribute to discussions. All participation is educational and SEBI-compliant.
        </p>
      </section>
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white border p-6 flex flex-col items-start shadow-sm min-h-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👥</span>
              <h4 className="font-bold text-green-800">Groups</h4>
            </div>
            <p className="text-gray-600 mb-4">Find your match and join a group to discuss with peers.</p>
            <Link href="/dashboard/investor-hub/groups" className="mt-auto px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 w-full text-center">Explore Groups</Link>
          </div>
          <div className="rounded-2xl bg-white border p-6 flex flex-col items-start shadow-sm min-h-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📅</span>
              <h4 className="font-bold text-green-800">Events</h4>
            </div>
            <p className="text-gray-600 mb-4">Attend upcoming events and webinars tailored for your group.</p>
            <Link href="/dashboard/investor-hub/events" className="mt-auto px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 w-full text-center">View Events</Link>
          </div>
          <div className="rounded-2xl bg-white border p-6 flex flex-col items-start shadow-sm min-h-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📚</span>
              <h4 className="font-bold text-green-800">Resources</h4>
            </div>
            <p className="text-gray-600 mb-4">Access articles, guides, and checklists for smarter investing.</p>
            <Link href="/dashboard/investor-hub/resources" className="mt-auto px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 w-full text-center">Browse Resources</Link>
          </div>
        </div>
      </section>
      <section className="pt-4">
        <p className="text-xs text-gray-500">This is an educational community. No investment recommendations or solicitations are made here. Please consult a SEBI-registered advisor for investment advice.</p>
      </section>
    </div>
  );
}
  