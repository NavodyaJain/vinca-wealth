import React, { useState, useMemo } from "react";

const groupFaqList = {
  fire: [
    {
      id: "fire-1",
      groupId: "fire",
      question: "What is the FIRE movement?",
      answer: "FIRE stands for Financial Independence, Retire Early. It focuses on aggressive saving and investing to retire before 50."
    },
    {
      id: "fire-2",
      groupId: "fire",
      question: "How much do I need to retire early?",
      answer: "A common rule is 25x your annual expenses, but adjust for inflation and your lifestyle."
    },
    {
      id: "fire-3",
      groupId: "fire",
      question: "What is a safe withdrawal rate?",
      answer: "The 4% rule is popular, but in India, 3.5% is often safer due to inflation and taxes."
    },
    {
      id: "fire-4",
      groupId: "fire",
      question: "How should I plan my SIPs for FIRE?",
      answer: "Diversify across equity and debt. Review SIPs annually. Example: 70% equity, 30% debt."
    }
  ],
  health: [
    {
      id: "health-1",
      groupId: "health",
      question: "Why is health planning important for retirement?",
      answer: "Medical inflation is high in India. Planning helps avoid financial shocks from health events."
    },
    {
      id: "health-2",
      groupId: "health",
      question: "How much health insurance do I need?",
      answer: "At least ₹10-20 lakh cover is recommended for urban families."
    }
  ],
  adventure: [
    {
      id: "adv-1",
      groupId: "adventure",
      question: "What is an adventure lifestyle retirement?",
      answer: "It means prioritizing travel, hobbies, and experiences in your retirement plan."
    },
    {
      id: "adv-2",
      groupId: "adventure",
      question: "How do I budget for frequent travel?",
      answer: "Estimate annual travel spend, add a buffer, and invest in liquid funds for flexibility."
    }
  ]
};

export default function GroupFaqSection({ groupId }) {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const faqs = groupFaqList[groupId] || [];
  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faqs;
    const s = search.toLowerCase();
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(s) || faq.answer.toLowerCase().includes(s)
    );
  }, [search, faqs]);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-4">
      <h2 className="font-semibold text-xl mb-1">Frequently Asked Questions</h2>
      <div className="text-xs text-gray-500 mb-4">Educational only. Not investment/medical advice. No stock recommendations.</div>
      <input
        className="w-full border rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="Search FAQs (e.g., safe withdrawal rate, SIP, healthcare inflation...)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        maxLength={100}
      />
      <div className="space-y-2">
        {filteredFaqs.length === 0 && (
          <div className="text-gray-400 text-sm py-8 text-center">No FAQs found for this search.</div>
        )}
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="border rounded-lg bg-white">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-blue-50 rounded-lg transition"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              aria-expanded={openId === faq.id}
            >
              <span className="break-words mr-2">{faq.question}</span>
              <span className={`ml-2 text-gray-400 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {openId === faq.id && (
              <div className="bg-blue-50 px-4 py-3 text-sm text-gray-700 rounded-b-lg border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
