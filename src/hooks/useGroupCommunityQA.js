import { useCallback, useEffect, useState } from "react";

function getStorageKey(groupId) {
  return `vinca.groupQA.${groupId}`;
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function useGroupCommunityQA(groupId) {
  const [questions, setQuestions] = useState([]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(getStorageKey(groupId));
    setQuestions(safeParse(raw, []));
  }, [groupId]);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(getStorageKey(groupId), JSON.stringify(questions));
  }, [groupId, questions]);

  // Add question
  const addQuestion = useCallback((q) => {
    setQuestions((prev) => [q, ...prev]);
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
  }, []);

  // Upvote question
  const upvoteQuestion = useCallback((questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q
      )
    );
  }, []);

  // Upvote answer
  const upvoteAnswer = useCallback((questionId, answerId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: (q.answers || []).map((a) =>
                a.id === answerId ? { ...a, upvotes: (a.upvotes || 0) + 1 } : a
              ),
            }
          : q
      )
    );
  }, []);

  return {
    questions,
    addQuestion,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
    setQuestions, // for admin/debug
  };
}
