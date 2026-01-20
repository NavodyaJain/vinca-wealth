// src/app/dashboard/investor-hub/page.js
'use client';

import { useState, useEffect } from 'react';
import HubTabs from '@/components/shared/HubTabs';
import EventCard from '@/components/shared/EventCard';
import TrackCard from '@/components/shared/TrackCard';
import { isInvestorHubJoined, setInvestorHubJoined, getRegisteredEvents, registerEvent, getFinancialReadiness, getLifestylePlanner, getHealthStress, hasAllReadings } from '@/lib/investorHubStorage';
import { getPersonalityTrack } from '@/lib/personalityTracks';

const TABS = [
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'discussions', label: 'Discussions', icon: '💬' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'resources', label: 'Resources', icon: '📚' },
  { id: 'my-track', label: 'My Track', icon: '🧭' },
];

const TRENDING_TOPICS = [
  { title: 'Can I retire by 50 with 30k SIP?', desc: 'Explore scenarios for early retirement with a 30k SIP.', tags: ['retirement', 'SIP', 'early'] },
  { title: 'How to handle healthcare inflation after retirement?', desc: 'Learn about planning for rising healthcare costs.', tags: ['healthcare', 'inflation', 'planning'] },
  { title: 'Is my retirement corpus enough if inflation goes up?', desc: 'Understand the impact of inflation on your corpus.', tags: ['corpus', 'inflation', 'awareness'] },
];

const DISCUSSIONS = [
  { user: 'Amit', question: 'How do you plan for medical emergencies post-retirement?', time: '2h ago' },
  { user: 'Priya', question: 'What is a safe withdrawal rate for India?', time: '5h ago' },
];

const LEADERBOARD = [
  { metric: 'Inflation risk awareness score', value: 92 },
  { metric: 'Emergency buffer discipline', value: 88 },
  { metric: 'Healthcare preparedness', value: 85 },
  { metric: 'Withdrawal discipline', value: 80 },
];

const EVENTS = [
  { id: 'event1', title: 'Retirement Planning Q&A', date: 'Feb 10', time: '6:00 PM', duration: '1h', host: 'Vinca Team', image: '/event1.jpg' },
  { id: 'event2', title: 'Understanding SWP & Withdrawal Strategy', date: 'Feb 18', time: '5:00 PM', duration: '1h', host: 'Vinca Team', image: '/event2.jpg' },
  { id: 'event3', title: 'Healthcare cost planning in retirement', date: 'Feb 25', time: '7:00 PM', duration: '1h', host: 'Vinca Team', image: '/event3.jpg' },
  { id: 'event4', title: 'FIRE vs Realistic Retirement India', date: 'Mar 2', time: '6:30 PM', duration: '1h', host: 'Vinca Team', image: '/event4.jpg' },
];

const RESOURCES = [
  { id: 'guide1', title: 'Retirement Planning Guide', desc: 'Step-by-step guide to retirement planning in India.' },
  { id: 'checklist1', title: 'Retirement Checklist', desc: 'Essential checklist for your retirement journey.' },
  { id: 'calc1', title: 'Calculators Explained', desc: 'How to use Vinca tools for your planning.' },
  { id: 'graph1', title: 'How to read your graphs', desc: 'Interpret your results and charts.' },
];

export default function InvestorHubPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [joined, setJoined] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showResource, setShowResource] = useState(null);
  const [discussionInput, setDiscussionInput] = useState('');
  const [discussionFeed, setDiscussionFeed] = useState(DISCUSSIONS);
  const [track, setTrack] = useState(null);
  const [readings, setReadings] = useState({});

  useEffect(() => {
    setJoined(isInvestorHubJoined());
    setRegisteredEvents(getRegisteredEvents());
    const f = getFinancialReadiness();
    const l = getLifestylePlanner();
    const h = getHealthStress();
    setReadings({ financial: f, lifestyle: l, health: h });
    if (f && l && h) setTrack(getPersonalityTrack({ financial: f, lifestyle: l, health: h }));
  }, []);

  const handleJoin = () => {
    setInvestorHubJoined(true);
    setJoined(true);
  };

  const handleRegisterEvent = (eventId) => {
    registerEvent(eventId);
    setRegisteredEvents(getRegisteredEvents());
  };

  const handlePostDiscussion = () => {
    if (discussionInput.trim()) {
      setDiscussionFeed([{ user: 'You', question: discussionInput, time: 'now' }, ...discussionFeed]);
      setDiscussionInput('');
    }
  };

  // Tab content renderers
  const renderTrending = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {TRENDING_TOPICS.map((topic, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-2 shadow-sm">
          <div className="text-lg font-semibold text-green-800 mb-1">{topic.title}</div>
          <div className="text-sm text-slate-700 mb-2">{topic.desc}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {topic.tags.map((tag) => (
              <span key={tag} className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">{tag}</span>
            ))}
          </div>
          <button className="mt-2 w-full h-10 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors">Open discussion</button>
        </div>
      ))}
    </div>
  );

  const renderDiscussions = () => (
    <div className="mt-6 max-w-2xl mx-auto">
      <div className="mb-4 text-xs text-slate-500">This is an educational community. Not investment advice.</div>
      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Post a question (local only)"
          value={discussionInput}
          onChange={e => setDiscussionInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePostDiscussion()}
        />
        <button
          className="rounded-lg bg-green-600 text-white px-4 py-2 font-semibold text-sm hover:bg-green-700"
          onClick={handlePostDiscussion}
        >Post</button>
      </div>
      <div className="space-y-4">
        {discussionFeed.map((d, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-800">{d.user}</div>
            <div className="text-slate-800 text-sm">{d.question}</div>
            <div className="text-xs text-slate-400">{d.time}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {LEADERBOARD.map((item, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-2 shadow-sm">
          <div className="text-lg font-semibold text-green-800 mb-1">{item.metric}</div>
          <div className="text-2xl font-bold text-green-700">{item.value}</div>
          <div className="text-xs text-slate-500">Educational metric only</div>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {EVENTS.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          registered={registeredEvents.includes(event.id)}
          onRegister={handleRegisterEvent}
        />
      ))}
    </div>
  );

  const renderResources = () => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {RESOURCES.map((res) => (
        <div key={res.id} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-2 shadow-sm">
          <div className="text-lg font-semibold text-green-800 mb-1">{res.title}</div>
          <div className="text-sm text-slate-700 mb-2">{res.desc}</div>
          <button className="mt-2 w-full h-10 rounded-xl bg-green-100 text-green-700 font-semibold text-sm hover:bg-green-200 transition-colors" onClick={() => setShowResource(res)}>
            View
          </button>
        </div>
      ))}
      {showResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl relative">
            <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={() => setShowResource(null)}>&times;</button>
            <div className="text-xl font-bold text-green-800 mb-2">{showResource.title}</div>
            <div className="text-slate-700 mb-4">{showResource.desc}</div>
            <div className="text-xs text-slate-500">(Sample content. Educational only.)</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMyTrack = () => (
    <div className="mt-6 flex flex-col items-center gap-6">
      {track ? (
        <TrackCard
          track={track}
          members={Math.floor(Math.random()*500+200)}
          onExplore={() => setActiveTab('discussions')}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-green-200 bg-green-50 p-8 text-center w-full max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Save all tool readings to unlock your track</h3>
          <p className="text-green-700 mb-6 max-w-md mx-auto">Complete and save readings for all 3 tools to see your personalized track.</p>
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Investor Hub</h1>
        <p className="text-slate-600 text-sm">Your single community for learning, sharing, and tracking your retirement journey. SEBI-safe, educational only.</p>
      </div>
      {!joined ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex flex-col items-center gap-3 shadow-sm mb-8">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-lg font-bold text-green-800 mb-1">Join Investor Hub to access discussions, events, resources and your track.</div>
          <button
            className="mt-2 w-full h-10 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
            onClick={handleJoin}
          >
            Join Investor Hub
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-2 text-green-700 font-semibold mb-8">
          You’re a member ✅
        </div>
      )}
      <HubTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div>
        {activeTab === 'trending' && renderTrending()}
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'resources' && renderResources()}
        {activeTab === 'my-track' && renderMyTrack()}
      </div>
    </div>
  );
}
