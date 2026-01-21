import React, { useState, useRef, useEffect } from "react";
import GroupDiscussionHeader from "./GroupDiscussionHeader";
import QuestionCard from "./QuestionCard";
import QuestionThread from "./QuestionThread";
import AskQuestionModal from "./AskQuestionModal";
import AskQuestionFAB from "./AskQuestionFAB";
import useGroupDiscussionState from "../../../hooks/useGroupDiscussionState";
import { toast } from "react-hot-toast";

const currentUser = { id: "me", name: "You" };

export default function GroupDiscussion({ groupId }) {
  const {
    questions,
    addQuestion,
    addAnswer,
    searchQuestions,
  } = useGroupDiscussionState(groupId, currentUser);

  const [search, setSearch] = useState("");
  const [openThreadId, setOpenThreadId] = useState(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [answeringId, setAnsweringId] = useState(null);

  const filtered = search ? searchQuestions(search) : questions;

  // Highlight new question
  useEffect(() => {
    if (highlightId) {
      const t = setTimeout(() => setHighlightId(null), 2200);
      return () => clearTimeout(t);
    }
  }, [highlightId]);

  // Handle ask question
  const handleAsk = async (data) => {
    setPosting(true);
    await new Promise((r) => setTimeout(r, 350));
    const q = {
      id: Date.now().toString(),
      groupId,
      title: data.title,
      body: data.body,
      tags: data.tags,
      author: currentUser,
      createdAt: Date.now(),
      answers: [],
    };
    addQuestion(q);
    setShowAskModal(false);
    setHighlightId(q.id);
    setOpenThreadId(q.id);
    setPosting(false);
    toast.success("Question posted");
  };

  // Handle answer
  const handleAddAnswer = async (questionId, answerText) => {
    setAnsweringId(questionId);
    await new Promise((r) => setTimeout(r, 350));
    addAnswer(questionId, {
      id: Date.now().toString(),
      author: currentUser,
      body: answerText,
      createdAt: Date.now(),
    });
    setAnsweringId(null);
    toast.success("Answer posted");
  };

  return (
    <div className="relative pb-0">
      <GroupDiscussionHeader onSearch={setSearch} />
      <div className="mt-2 relative">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">No questions found.</div>
        )}
        {filtered.map((q) => (
          <div key={q.id}>
            <QuestionCard
              question={q}
              onAnswer={() => {
                setOpenThreadId(q.id);
                setTimeout(() => {
                  const el = document.getElementById(`thread-${q.id}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
              onViewThread={() =>
                setOpenThreadId(openThreadId === q.id ? null : q.id)
              }
              isOpen={openThreadId === q.id}
              answerCount={q.answers?.length || 0}
              highlight={highlightId === q.id}
              currentUser={currentUser}
            />
            {openThreadId === q.id && (
              <div id={`thread-${q.id}`}>
                <QuestionThread
                  question={q}
                  onAddAnswer={(text) => handleAddAnswer(q.id, text)}
                  currentUser={currentUser}
                  autoFocus
                  loading={answeringId === q.id}
                />
              </div>
            )}
          </div>
        ))}
        <AskQuestionFAB onClick={() => setShowAskModal(true)} />
      </div>
      <AskQuestionModal
        open={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handleAsk}
        groupId={groupId}
        loading={posting}
      />
    </div>
  );
}
