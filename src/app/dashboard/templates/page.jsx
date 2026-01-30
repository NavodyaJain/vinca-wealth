
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_REFLECTIONS = [
  {
    id: 'reflection_1',
    name: 'Amit',
    avatar: '/images/templates/rolemodel-1.jpg',
    hook: '“I never thought I could start, but I did.”',
    preview: 'The first step was the hardest. I spent months just reading and worrying. What changed was... ',
    full: [
      'The first step was the hardest. I spent months just reading and worrying. What changed was a conversation with a friend who had started their own journey. Suddenly, it felt possible.',
      'I was confused about where to begin, and felt overwhelmed by all the advice online. I decided to focus on just one thing: tracking my expenses. That gave me a sense of control.',
      'If you’re just starting out, know that it’s normal to feel lost. Take one small step, and let yourself learn as you go.'
    ]
  },
  {
    id: 'reflection_2',
    name: 'Priya',
    avatar: '/images/templates/rolemodel-2.jpg',
    hook: '“Family security was my top priority.”',
    preview: 'I always worried about my kids’ future. The turning point was when I realized I could plan for them and myself at the same time...',
    full: [
      'I always worried about my kids’ future. The turning point was when I realized I could plan for them and myself at the same time. It wasn’t about big leaps, but small, steady changes.',
      'The hardest part was letting go of the idea that I had to do everything perfectly. I learned to ask for help and to celebrate small wins.',
      'If you’re feeling anxious, remember: you’re not alone. Everyone’s journey is different, and that’s okay.'
    ]
  },
  {
    id: 'reflection_3',
    name: 'Ravi',
    avatar: '',
    hook: '“I learned to talk about money openly.”',
    preview: 'Growing up, money was never discussed. When I started my journey, I had to unlearn a lot of fears...',
    full: [
      'Growing up, money was never discussed. When I started my journey, I had to unlearn a lot of fears. The best thing I did was to start talking about it with my partner.',
      'We made mistakes, but we learned together. The journey is ongoing, and that’s what makes it meaningful.',
      'To anyone starting out: be kind to yourself. Reflection is as important as action.'
    ]
  }
];

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vinca_reflections');
      if (saved) return JSON.parse(saved);
    }
    return MOCK_REFLECTIONS;
  });
  const router = useRouter();

  // Show only 3 most recent
  const feed = reflections.slice(0, 3);

  // Floating post button handler
  function goToPost() {
    router.push('/dashboard/templates/post');
  }

  function viewStory(id) {
    router.push(`/dashboard/templates/${id}`);
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 px-0 py-6 relative">
      <div className="px-4 sm:px-8 mb-8">
        <div className="rounded-2xl bg-white p-6 mb-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Reflections</h1>
          <p className="text-slate-600 mb-2">Real experiences from people navigating their financial readiness journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feed.map(story => (
            <div key={story.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden transition hover:shadow-md">
              <div className="flex flex-col items-center pt-6 pb-2 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden mb-3 border-2 border-emerald-100">
                  {story.avatar ? (
                    <img src={story.avatar} alt={story.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-slate-400">👤</div>
                  )}
                </div>
                <div className="font-bold text-slate-900 text-base text-center mb-1 truncate">{story.hook}</div>
                <div className="text-slate-500 text-sm text-center mb-3 line-clamp-2">{story.preview}</div>
                <button
                  className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-4 py-1.5 text-sm transition shadow"
                  onClick={() => viewStory(story.id)}
                >View Story</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating Post Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition text-3xl"
        onClick={goToPost}
        aria-label="Post Reflection"
      >
        +
      </button>
    </div>
  );
}
