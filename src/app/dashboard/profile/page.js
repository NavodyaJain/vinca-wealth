// app/profile/page.js
'use client';

import UserProfile from '../../../components/UserProfile';

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
      <div className="mb-12 text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          User Profile
        </h1>
        <p className="text-slate-600 mt-2">
          These details power all your financial analyses
        </p>
      </div>
      
      <UserProfile />
    </div>
  );
}