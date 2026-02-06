"use client";
import { useState } from "react";
import { BookOpen, BarChart3, MessageSquare, Shield, X, TrendingUp, CheckCircle, Zap, Target, Brain, ArrowDown } from "lucide-react";

export default function ElevatePage() {
  const [bookingPageOpen, setBookingPageOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "User Name",
    email: "user@example.com",
    note: "",
    selectedDate: null,
    selectedTime: null
  });

  // Custom styles for scrollbar hiding
  const scrollbarHideStyles = `
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `;

  const steps = [
    {
      id: 1,
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      heading: "Numbers, Sorted",
      description: "You understand your income, expenses, goals, and timelines with clarity."
    },
    {
      id: 2,
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      heading: "Discipline, Built",
      description: "You've stayed consistent and committed through structured sprints."
    },
    {
      id: 3,
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      heading: "Financial Maturity",
      description: "You understand the 'why' behind your decisions, not just the mechanics."
    },
    {
      id: 5,
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      heading: "Ready to Elevate",
      description: "Expert guidance adds validation, confidence, and clarity on next steps."
    }
  ];

  const features = [
    {
      id: 1,
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      title: "Portfolio Review",
      description: "Review your existing investments and understand how they align with your retirement goals."
    },
    {
      id: 2,
      icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
      title: "Q&A on Your Plan",
      description: "Ask questions about your calculations, assumptions, and scenarios you've explored inside Vinca."
    },
    {
      id: 3,
      icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
      title: "Retirement Roadmapping",
      description: "Clarify next steps to strengthen lifestyle sustainability, health robustness, or early retirement feasibility."
    },
    {
      id: 4,
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Confidence Check",
      description: "Validate what you're already doing right and identify where small improvements matter."
    }
  ];

  const handleBookingNext = () => {
    // No longer needed - single page approach
  };

  const handleBookingBack = () => {
    // No longer needed - single page approach
  };

  const handleConfirmBooking = () => {
    if (formData.selectedDate && formData.selectedTime) {
      setSuccessModalOpen(true);
      setBookingPageOpen(false);
      // Reset form
      setFormData({
        name: "User Name",
        email: "user@example.com",
        note: "",
        selectedDate: null,
        selectedTime: null
      });
    }
  };

  const handleCloseSuccess = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6">
      <style>{scrollbarHideStyles}</style>
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            You've already done the hard work
          </h1>

          {/* Horizontal Progress Flow - Moved Above CTA */}
          <div className="mb-10">
            {/* Scrollable Container */}
            <div className="relative overflow-hidden">
              {/* Horizontal Scroll Container */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 py-8 px-1 min-w-min">
                  {/* Progress Connector SVG Background */}
                  <svg
                    className="absolute top-0 left-0 w-full h-12 pointer-events-none"
                    style={{ minWidth: `${steps.length * 300}px`, height: '48px' }}
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="30"
                      y1="24"
                      x2={steps.length * 300 - 30}
                      y2="24"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Step Cards */}
                  {steps.map((step, index) => (
                    <div key={step.id} className="shrink-0 w-72">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative">
                        {/* Connector Icon */}
                        <div className="absolute -top-6 left-6 w-10 h-10 rounded-full bg-white border-4 border-emerald-200 flex items-center justify-center z-10">
                          {index === steps.length - 1 ? (
                            <ArrowDown className="h-6 w-6 text-emerald-600" />
                          ) : (
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="mt-2">
                          <h3 className="font-semibold text-slate-900 mb-2">
                            {step.heading}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card - Positioned After Progress Flow */}
          <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  Ready to elevate further?
                </h2>
                <p className="text-slate-700 text-base">
                  Discuss your journey with a wealth manager, validate your plan, and gain confidence on next steps.
                </p>
              </div>

              <button
                onClick={() => setBookingPageOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg w-full md:w-auto whitespace-nowrap"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>

        {/* What You Can Expect Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
            What this session helps you with
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Booking Page */}
      {bookingPageOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white">
          <div className="w-full px-6 lg:px-8 py-12">
            <div className="w-full max-w-6xl mx-auto">
              {/* Header with Close */}
              <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Book Your Guidance Session
                </h1>
                <button
                  onClick={() => setBookingPageOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Grid Layout: Summary + Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Session Summary (Sticky) */}
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Session Details</h2>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Session Type</p>
                          <p className="text-base font-medium text-slate-900">Financial Readiness Guidance</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Duration</p>
                          <p className="text-base font-medium text-slate-900">30–45 minutes</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mode</p>
                          <p className="text-base font-medium text-slate-900">Google Meet</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Booking Form */}
                <div className="lg:col-span-2">
                  {/* SECTION 1: Date & Time Selection */}
                  <div className="mb-12">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Choose Date & Time</h2>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Preferred Date</label>
                          <input
                            type="date"
                            value={formData.selectedDate || ""}
                            onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Preferred Time</label>
                          <select
                            value={formData.selectedTime || ""}
                            onChange={(e) => setFormData({ ...formData, selectedTime: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="">Select a time slot</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="02:00">2:00 PM</option>
                            <option value="02:30">2:30 PM</option>
                            <option value="03:00">3:00 PM</option>
                            <option value="04:00">4:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Primary CTA */}
                  <div>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={!formData.selectedDate || !formData.selectedTime}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg mb-3"
                    >
                      Confirm & Book Session
                    </button>
                    <p className="text-xs text-slate-500 text-center">
                      You'll receive a Google Meet link after confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Session booked successfully!
            </h2>

            <p className="text-slate-600 mb-8 leading-relaxed">
              Your guidance session has been scheduled. You'll receive the meeting link and details on your registered email shortly.
            </p>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ...existing code...
