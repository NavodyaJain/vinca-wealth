import { useEffect, useState } from "react";

const STORAGE_KEY = (userId = "default") => `vinca_investorhub_events_${userId}`;

export function useInvestorHubEventsState(userId = "default") {
  const [interested, setInterested] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        setInterested(parsed.interested || []);
        setRegistered(parsed.registered || []);
      }
    } catch {}
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY(userId),
        JSON.stringify({ interested, registered })
      );
    } catch {}
  }, [interested, registered, userId, hydrated]);

  const toggleInterested = (id) => {
    setInterested((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...new Set([...prev, id])]
    );
  };
  const toggleRegistered = (id) => {
    setRegistered((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...new Set([...prev, id])]
    );
    setInterested((prev) => (prev.includes(id) ? prev : [...new Set([...prev, id])]));
  };

  return {
    interestedEventIds: interested,
    registeredEventIds: registered,
    toggleInterested,
    toggleRegistered,
    hydrated,
  };
}
