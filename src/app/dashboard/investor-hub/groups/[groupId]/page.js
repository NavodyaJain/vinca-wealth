"use client";
import groups from '../../../../../lib/investorHubGroups';
import { getJoinedGroups, joinGroup, isGroupJoined, leaveGroup } from '../../../../../lib/investorHubMembership';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

function getGroup(groupId) {
  return groups.find((g) => g.id === groupId);
}

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const group = getGroup(groupId);
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([
    { user: 'Alice', text: 'Welcome to the group!', time: '09:00' },
    { user: 'Bob', text: 'Excited to learn together.', time: '09:05' },
  ]);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('discussion');
  const handleExitGroup = () => {
    leaveGroup(groupId);
    setJoined(false);
    router.push('/dashboard/investor-hub/groups');
  };

  useEffect(() => {
    setJoined(isGroupJoined(groupId));
  }, [groupId]);

  const handleJoin = () => {
    joinGroup(groupId);
    setJoined(true);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInput('');
    }
  };

  if (!group) return <div className="p-6">Group not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-stretch gap-8 mb-6">
        <div className="w-full max-w-full">
          <div className="rounded-2xl border bg-white p-6 flex items-start gap-4 w-full">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{group.iconName}</span>
                <h2 className="font-bold text-xl text-green-800 leading-tight">{group.name}</h2>
              </div>
              <div className="text-green-700 font-medium text-sm leading-tight mb-1">{group.tagline}</div>
              <div className="text-gray-600 mb-1">{group.description}</div>
              <div className="text-xs text-gray-400">Topics: {group.primaryTopics.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
      {joined && (
        <div className="flex gap-2 mb-6 w-full items-center">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg border border-gray-200 hover:bg-gray-200 transition-all"
            onClick={() => router.push('/dashboard/investor-hub/groups')}
            aria-label="Back to Groups"
          >
            &lt;
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold border transition-all flex-1 ${tab === 'trending' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setTab('trending')}
          >Trending</button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold border transition-all flex-1 ${tab === 'discussion' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setTab('discussion')}
          >Discussion</button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold border transition-all flex-1 ${tab === 'stories' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setTab('stories')}
          >Member Stories</button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold border transition-all flex-1 ${tab === 'tools' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setTab('tools')}
          >Tools</button>
        </div>
      )}
      <div className="rounded-2xl border bg-white p-6">
        {(!joined || tab === 'discussion') && (
          <>
            <h3 className="font-semibold text-green-700 mb-2">Discussion</h3>
            {!joined ? (
              <div>
                <div className="text-gray-500 mb-4">Join this group to participate in the discussion.</div>
                <button onClick={handleJoin} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700">Join Group to Participate</button>
                <div className="mt-6">
                  <div className="text-gray-400 italic">Locked preview:</div>
                  <div className="bg-gray-50 rounded-lg p-3 mt-2 text-gray-500">{messages[0].text}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="font-semibold text-green-700">{msg.user}:</span>
                      <span className="text-gray-700">{msg.text}</span>
                      <span className="ml-auto text-xs text-gray-400">{msg.time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700">Send</button>
                </div>
              </div>
            )}
          </>
        )}
        {joined && tab === 'trending' && (
          <div>
            <h3 className="font-semibold text-green-700 mb-2">Trending</h3>
            <div className="text-gray-500">Trending content coming soon.</div>
          </div>
        )}
        {joined && tab === 'stories' && (
          <div>
            <h3 className="font-semibold text-green-700 mb-2">Member Stories</h3>
            <div className="text-gray-500">Member stories coming soon.</div>
          </div>
        )}
        {joined && tab === 'tools' && (
          <div>
            <h3 className="font-semibold text-green-700 mb-2">Tools</h3>
            <div className="text-gray-500">Group tools coming soon.</div>
          </div>
        )}
      </div>
    </div>
  );
}
