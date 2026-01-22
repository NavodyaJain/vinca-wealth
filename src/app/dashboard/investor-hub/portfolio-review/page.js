"use client";
import { useState } from 'react';

export default function PortfolioReviewPage() {
  const [files, setFiles] = useState([]);
  const [reviewed, setReviewed] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  const handleRemove = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-5xl md:max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Portfolio Review</h1>
      {!reviewed ? (
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center gap-6">
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl py-8 px-4 cursor-pointer hover:border-emerald-500 transition">
            <span className="text-emerald-700 font-semibold mb-2">Upload your portfolio (PDF or images)</span>
            <input type="file" accept=".pdf,image/*" multiple className="hidden" onChange={handleFileChange} />
            <span className="text-xs text-gray-500">Max 5 files. No data is uploaded to server.</span>
          </label>
          {files.length > 0 && (
            <div className="w-full mt-2">
              <div className="font-semibold text-sm mb-2 text-emerald-800">Files to review:</div>
              <ul className="space-y-2">
                {files.map((file, idx) => (
                  <li key={file.name} className="flex items-center gap-2 bg-emerald-50 rounded px-3 py-2">
                    <span className="flex-1 truncate text-gray-700 text-sm">{file.name}</span>
                    <button className="text-xs text-red-500 hover:underline" onClick={() => handleRemove(idx)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            className="mt-4 px-6 py-2 rounded bg-emerald-600 text-white font-semibold disabled:opacity-50"
            disabled={files.length === 0}
            onClick={() => setReviewed(true)}
          >
            Review My Portfolio
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center flex flex-col items-center gap-6">
          <div className="font-semibold text-lg mb-2 text-emerald-800">Portfolio Health Score: <span className="text-2xl">78/100</span></div>
          <div className="text-left w-full max-w-md mx-auto">
            <div className="font-semibold text-emerald-700 mb-1">Risk Flags</div>
            <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>High equity allocation for age group</li>
              <li>Insufficient emergency fund</li>
              <li>No health insurance listed</li>
            </ul>
          </div>
          <div className="text-left w-full max-w-md mx-auto">
            <div className="font-semibold text-emerald-700 mb-1">Improvement Suggestions</div>
            <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>Rebalance portfolio to reduce equity risk</li>
              <li>Increase emergency fund to 6+ months expenses</li>
              <li>Consider health insurance for all family members</li>
            </ul>
          </div>
          <div className="text-xs text-gray-500 mt-4">Educational only. No investment advice. Please consult a SEBI-registered advisor for personalized guidance.</div>
        </div>
      )}
    </div>
  );
}
