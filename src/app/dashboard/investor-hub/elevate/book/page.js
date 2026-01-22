"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MANAGER_DATA = [
  {
    name: "Aarav Mehta",
    expertise: ["Retirement", "FIRE", "Tax Planning"],
    experience: 12,
    avatar: "/public/avatar1.png",
  },
  {
    name: "Priya Sharma",
    expertise: ["Health Planning", "Retirement"],
    experience: 9,
    avatar: "/public/avatar2.png",
  },
  {
    name: "Rahul Verma",
    expertise: ["Retirement", "Corpus", "Withdrawal"],
    experience: 15,
    avatar: "/public/avatar3.png",
  },
];


function ElevateBookPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedManager, setSelectedManager] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    slot: "",
    reason: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const managerName = searchParams.get("manager") || localStorage.getItem("vinca_elevate_selectedManager");
    const manager = MANAGER_DATA.find((m) => m.name === managerName) || MANAGER_DATA[0];
    setSelectedManager(manager);
    localStorage.setItem("vinca_elevate_selectedManager", manager.name);
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "vinca_elevate_booking",
      JSON.stringify({ ...form, manager: selectedManager.name })
    );
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className="bg-emerald-50 rounded-xl shadow p-8 mb-6">
          <div className="text-2xl font-bold text-emerald-800 mb-2">Appointment booked successfully ✅</div>
          <div className="text-emerald-700 mb-2">You will receive confirmation via email (mock)</div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <button
            className="px-5 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            onClick={() => router.push('/dashboard/investor-hub/elevate')}
          >
            Back to Elevate
          </button>
          <button
            className="px-5 py-2 rounded bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200"
            onClick={() => router.push('/dashboard/investor-hub/events')}
          >
            Explore Investor Hub Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Appointment Form */}
        <form
          className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="font-semibold text-emerald-800 text-lg mb-2">Book a Session</div>
          <label className="text-sm font-medium">Full Name
            <input
              type="text"
              name="name"
              required
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label className="text-sm font-medium">Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label className="text-sm font-medium">Phone (optional)
            <input
              type="tel"
              name="phone"
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
          <label className="text-sm font-medium">Preferred Time Slot
            <select
              name="slot"
              required
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.slot}
              onChange={handleChange}
            >
              <option value="">Select a slot</option>
              <option value="Morning">Morning (10am - 12pm)</option>
              <option value="Afternoon">Afternoon (2pm - 4pm)</option>
              <option value="Evening">Evening (5pm - 7pm)</option>
            </select>
          </label>
          <label className="text-sm font-medium">Reason for Session
            <textarea
              name="reason"
              required
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.reason}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="mt-2 px-6 py-2 rounded bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700"
          >
            Confirm Appointment
          </button>
        </form>
        {/* Right: Summary Card */}
        <div className="flex-1 bg-emerald-50 rounded-xl shadow p-6 flex flex-col gap-3 max-w-md mx-auto mt-8 md:mt-0">
          <div className="font-semibold text-emerald-900 text-lg mb-1">Session Summary</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
              <img
                src={selectedManager?.avatar}
                alt={selectedManager?.name}
                className="w-full h-full object-cover"
                onError={e => (e.target.style.display = 'none')}
              />
            </div>
            <div>
              <div className="font-semibold text-emerald-800">{selectedManager?.name}</div>
              <div className="text-xs text-emerald-700">Wealth Manager</div>
              <div className="text-xs text-gray-500">{selectedManager?.experience} yrs exp</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedManager?.expertise.map(tag => (
              <span key={tag} className="bg-white text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">{tag}</span>
            ))}
          </div>
          <div className="text-sm font-semibold text-emerald-800 mt-2 mb-1">What you’ll get:</div>
          <ul className="list-disc pl-5 text-sm text-emerald-900 mb-2">
            <li>Retirement plan review</li>
            <li>Inputs validation</li>
            <li>Risk awareness guidance</li>
            <li>Corpus & withdrawal clarity</li>
            <li>Action plan checklist</li>
          </ul>
          <div className="text-xs text-gray-500 mt-2">We do not provide investment advice or stock recommendations.</div>
        </div>
      </div>
    </div>
  );
}

export default function ElevateBookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ElevateBookPageInner />
    </Suspense>
  );
}
