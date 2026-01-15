'use client';

import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleContinue = () => {
    localStorage.setItem('vinca_signed_in', 'true');
    router.push('/dashboard/financial-readiness');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Sign In to Vinca Wealth</h1>
        <p className="text-slate-600">Save your plan and unlock detailed analysis</p>
        <button
          onClick={handleContinue}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
