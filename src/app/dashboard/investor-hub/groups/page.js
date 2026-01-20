"use client";
import groups from '../../../../lib/investorHubGroups';
import { getJoinedGroups, joinGroup, isGroupJoined } from '../../../../lib/investorHubMembership';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GroupsPage() {
  const [joined, setJoined] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    setJoined(getJoinedGroups());
  }, []);

  const handleJoin = (groupId) => {
    joinGroup(groupId);
    setJoined(getJoinedGroups());
  };

  // Filter groups based on tab
  const displayedGroups = tab === 'joined' ? groups.filter(g => joined.includes(g.id)) : groups;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-xl font-semibold border transition-all ${tab === 'all' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setTab('all')}
        >
          All Groups
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold border transition-all ${tab === 'joined' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setTab('joined')}
        >
          Joined Groups
        </button>
      </div>
      <div className="flex flex-col gap-6 w-full">
        {displayedGroups.length === 0 ? (
          <div className="text-gray-500 text-center py-12 w-full">{tab === 'joined' ? 'You have not joined any groups yet.' : 'No groups found.'}</div>
        ) : (
          displayedGroups.map((group) => {
            const joinedGroup = joined.includes(group.id);
            return (
              <div key={group.id} className="w-full rounded-2xl border bg-white px-6 py-5 flex flex-col md:flex-row md:items-center shadow-sm">
                <div className="flex items-center gap-4 md:w-1/4 mb-2 md:mb-0">
                  <span className="text-3xl md:text-4xl">{group.iconName}</span>
                  <div>
                    <h3 className="font-bold text-xl text-green-800">{group.name}</h3>
                    <div className="text-green-700 font-medium">{group.tagline}</div>
                  </div>
                </div>
                <div className="flex-1 text-gray-600 mb-4 md:mb-0 md:pl-8">{group.description}</div>
                <div className="flex items-center md:w-1/5 justify-end">
                  {joinedGroup ? (
                    <Link href={`/dashboard/investor-hub/groups/${group.id}`} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 text-center w-full md:w-auto">Go to Discussions</Link>
                  ) : (
                    <button onClick={() => handleJoin(group.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 w-full md:w-auto">Join Group</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
