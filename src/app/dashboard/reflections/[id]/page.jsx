"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GRADIENT_PLACEHOLDER = (
  <div className="w-full h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center rounded-t-2xl">
    <span className="text-5xl text-emerald-200">📝</span>
  </div>
);

export default function ReflectionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reflection, setReflection] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
      const found = all.find(r => r.id === id);
      setReflection(found || null);
    }
  }, [id]);

  if (!reflection) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 mb-4">Reflection not found.</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Reflections</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-0 max-w-xl w-full flex flex-col overflow-hidden">
        {reflection.photo ? (
          <img src={reflection.photo} alt="Reflection moment" className="w-full h-56 object-cover object-center rounded-t-2xl" />
        ) : (
          GRADIENT_PLACEHOLDER
        )}
        <div className="flex flex-col gap-6 p-8">
          {reflection.full.map((para, idx) => (
            <p key={idx} className="text-slate-800 text-base leading-relaxed">{para}</p>
          ))}
        </div>
        <div className="text-xs text-slate-400 text-center pb-6">Shared anonymously as a personal reflection.</div>
      </div>
      <button className="mt-8 text-emerald-700 font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Reflections</button>
    </div>
  );
}
