import React, { useState } from "react";

export default function GroupFaqAccordion({ categories }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="w-full">
      {categories.map((cat, idx) => (
        <div key={cat.name} className="mb-3">
          <button
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-t font-semibold text-left text-sm"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
          >
            <span>{cat.name}</span>
            <span className="text-xs text-gray-400">{open === idx ? "▲" : "▼"}</span>
          </button>
          {open === idx && (
            <div className="bg-white border border-t-0 rounded-b px-4 py-2">
              {cat.faqs.map((faq) => (
                <div key={faq.id} className="mb-3 last:mb-0">
                  <div className="font-medium text-gray-800 mb-1">Q: {faq.question}</div>
                  <div className="text-gray-700 text-sm">{faq.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
