import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = (groupId) => `vinca.groupDiscussion.${groupId}`;
const NOTIF_KEY = (userId) => `vinca.notifications.${userId}`;

const demoUsers = [
  { id: "me", name: "You" },
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "nupur", name: "Nupur" },
];

const groupSeed = {
  "group-1": [
    {
      id: "q1",
      groupId: "group-1",
      title: "Is 4% rule safe for India?",
      body: "I've read about the 4% rule for retirement withdrawals. Is it safe to use in India given inflation and taxes?",
      tags: ["FIRE", "Withdrawal"],
      author: demoUsers[1],
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      answers: [
        {
          id: "a1",
          author: demoUsers[2],
          body: "In India, 3.5% is safer due to higher inflation. Consider your asset allocation too.",
          createdAt: Date.now() - 1000 * 60 * 60 * 24,
        },
      ],
    },
    {
      id: "q2",
      groupId: "group-1",
      title: "How do I plan SIP increase without disturbing lifestyle?",
      body: "I want to increase my SIPs every year but also want to maintain my current lifestyle. Any tips?",
      tags: ["SIP", "Lifestyle"],
      author: demoUsers[2],
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
      answers: [],
    },
  ],
  "group-2": [
    {
      id: "q3",
      groupId: "group-2",
      title: "How much buffer for healthcare inflation?",
      body: "What percentage buffer should I keep for healthcare inflation in my retirement plan?",
      tags: ["Healthcare", "Inflation"],
      author: demoUsers[3],
      createdAt: Date.now() - 1000 * 60 * 60 * 36,
      answers: [],
    },
  ],
  "group-3": [
    {
      id: "q4",
      groupId: "group-3",
      title: "Best way to budget for travel in retirement?",
      body: "I want to travel every year after retirement. How should I budget for this?",
      tags: ["Travel", "Budgeting"],
      author: demoUsers[1],
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      answers: [],
    },
  ],
};

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function useGroupDiscussionState(groupId, currentUser) {
  const [questions, setQuestions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load questions from localStorage or seed
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY(groupId));
    if (raw) setQuestions(safeParse(raw, []));
    else setQuestions(groupSeed[groupId] ? [...groupSeed[groupId]] : []);
  }, [groupId]);

  // Persist questions
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY(groupId), JSON.stringify(questions));
  }, [groupId, questions]);

  // Notifications
  useEffect(() => {
    if (!currentUser) return;
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(NOTIF_KEY(currentUser.id));
    setNotifications(safeParse(raw, []));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(NOTIF_KEY(currentUser.id), JSON.stringify(notifications));
  }, [currentUser, notifications]);

  // Add question
  const addQuestion = useCallback((q) => {
    setQuestions((prev) => [{ ...q, answers: [] }, ...prev]);
  }, []);

  // Add answer
  const addAnswer = useCallback((questionId, answer) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...(q.answers || []), answer] }
          : q
      )
    );
    // Notify question author if not self
    setTimeout(() => {
      setQuestions((prev) => {
        const q = prev.find((q) => q.id === questionId);
        if (q && q.author && q.author.id !== currentUser.id) {
          setNotifications((n) => [
            {
              id: Date.now().toString(),
              type: "answer",
              message: `${currentUser.name} answered your question: ${q.title}`,
              questionId,
              groupId,
              createdAt: Date.now(),
              isRead: false,
            },
            ...n,
          ]);
        }
        return prev;
      });
    }, 0);
  }, [currentUser, groupId]);

  // Mark notifications read
  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  // Search
  const searchQuestions = useCallback((query) => {
    const s = query.toLowerCase();
    return questions.filter((q) =>
      q.title.toLowerCase().includes(s) ||
      q.body.toLowerCase().includes(s) ||
      (q.tags || []).some((tag) => tag.toLowerCase().includes(s)) ||
      (q.answers || []).some((a) => a.body.toLowerCase().includes(s))
    );
  }, [questions]);

  return {
    questions,
    addQuestion,
    addAnswer,
    searchQuestions,
    notifications,
    markNotificationsRead,
    setQuestions, // for admin/debug
    setNotifications,
  };
}
