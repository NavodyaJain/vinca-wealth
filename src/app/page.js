import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
            <div className="w-full lg:w-1/2 text-left">
              <p className="text-sm font-semibold text-green-700 mb-3">Premium tools for modern investors</p>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900 mb-6 leading-tight">
                Achieve Financial Freedom
                <span className="block text-green-600 mt-2">On Your Terms</span>
              </h1>
              <p className="text-xl text-slate-600">
                Calculate, plan, and track your journey to financial independence with our smart, personalized tools.
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium stock market dashboard"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Calculator</h3>
              <p className="text-slate-600">
                Project your wealth journey with our advanced retirement calculator
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Visual Dashboard</h3>
              <p className="text-slate-600">
                Track your progress with interactive charts and detailed projections
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Checklist</h3>
              <p className="text-slate-600">
                Ensure you're covered with our financial protection checklist
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-slate-900 mb-6">
              Ready to take control of your financial future?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands who have planned their path to financial freedom with Vinca Wealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator" className="btn-cta">
                Calculate My Freedom Age
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                View Sample Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}