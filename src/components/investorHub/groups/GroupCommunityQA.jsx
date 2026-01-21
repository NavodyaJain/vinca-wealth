import React, { useState } from "react";
import useGroupCommunityQA from "@/hooks/useGroupCommunityQA";

function timeAgo(date) {
  const now = Date.now();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
}

export default function GroupCommunityQA({ groupId, joined }) {
  const {
    questions,
    addQuestion,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
  } = useGroupCommunityQA(groupId);
  const [showAsk, setShowAsk] = useState(false);
  const [askTitle, setAskTitle] = useState("");
  const [askBody, setAskBody] = useState("");
  const [askTags, setAskTags] = useState("");
  const [askError, setAskError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [answerText, setAnswerText] = useState({});
  const [answerError, setAnswerError] = useState({});

  // Ask Question
  function handleAsk() {
    if (!askTitle.trim() || !askBody.trim()) {
      setAskError("Title and body required");
      return;
    }
    addQuestion({
      id: Date.now().toString(),
      groupId,
      title: askTitle,
      body: askBody,
      tags: askTags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: Date.now(),
      createdBy: "Anonymous Investor",
      upvotes: 0,
      answers: [],
    });
    setAskTitle("");
    setAskBody("");
    setAskTags("");
    setAskError("");
    setShowAsk(false);
  }

  // Add Answer
  function handleAnswer(qid) {
    if (!answerText[qid] || !answerText[qid].trim()) {
      setAnswerError((e) => ({ ...e, [qid]: "Answer required" }));
      return;
    }
    addAnswer(qid, {
      id: Date.now().toString(),
      body: answerText[qid],
      createdAt: Date.now(),
      createdBy: "Anonymous Investor",
      upvotes: 0,
    });
    setAnswerText((t) => ({ ...t, [qid]: "" }));
    setAnswerError((e) => ({ ...e, [qid]: "" }));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-green-700">Community Q&amp;A</h3>
        <button
          className="text-xs px-3 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowAsk((v) => !v)}
          disabled={!joined}
        >
          Ask Question
        </button>
      </div>
      {!joined && (
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
            <div className="text-gray-500 text-sm mb-2">Join this group to ask &amp; answer questions</div>
            <button className="px-3 py-1 rounded bg-green-600 text-white text-xs font-medium" disabled>Join to Participate</button>
          </div>
        </div>
      )}
      {showAsk && joined && (
        <div className="mb-4 border rounded-lg p-3 bg-gray-50">
          <div className="mb-2">
            <input
              className="w-full border rounded px-2 py-1 text-sm mb-1"
              placeholder="Question Title"
              value={askTitle}
              onChange={(e) => setAskTitle(e.target.value)}
              maxLength={100}
            />
            <textarea
              className="w-full border rounded px-2 py-1 text-sm mb-1"
              placeholder="Details (optional)"
              value={askBody}
              onChange={(e) => setAskBody(e.target.value)}
              rows={2}
              maxLength={500}
            />
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              placeholder="Tags (comma separated)"
              value={askTags}
              onChange={(e) => setAskTags(e.target.value)}
              maxLength={60}
            />
            {askError && <div className="text-xs text-red-500 mt-1">{askError}</div>}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium"
              onClick={handleAsk}
            >
              Submit
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium"
              onClick={() => setShowAsk(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {questions.length === 0 && (
          <div className="text-gray-400 text-sm">No questions yet. Be the first to ask!</div>
        )}
        {questions.map((q) => (
          <div key={q.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <button
                className="text-xs px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-blue-50"
                onClick={() => joined && upvoteQuestion(q.id)}
                disabled={!joined}
              >
                ▲ {q.upvotes || 0}
              </button>
              <span className="font-medium text-sm break-words line-clamp-2">{q.title}</span>
              {q.tags && q.tags.length > 0 && (
                <span className="ml-2 flex flex-wrap gap-1">
                  {q.tags.map((tag) => (
                    <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </span>
              )}
              <span className="ml-auto text-xs text-gray-400">{timeAgo(q.createdAt)}</span>
            </div>
            <div className="text-gray-700 text-sm mb-1 break-words line-clamp-3">{q.body}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>{q.createdBy}</span>
              <span>•</span>
              <span>{(q.answers || []).length} answers</span>
              <button
                className="ml-auto text-blue-600 hover:underline text-xs"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                {expanded === q.id ? "Hide Thread" : "View Thread"}
              </button>
            </div>
            {expanded === q.id && (
              <div className="mt-2 border-t pt-2">
                <div className="mb-2">
                  {(q.answers || []).length === 0 && <div className="text-gray-400 text-xs">No answers yet.</div>}
                  {(q.answers || []).map((a) => (
                    <div key={a.id} className="mb-2 border-b pb-2 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          className="text-xs px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-blue-50"
                          onClick={() => joined && upvoteAnswer(q.id, a.id)}
                          disabled={!joined}
                        >
                          ▲ {a.upvotes || 0}
                        </button>
                        <span className="font-medium text-xs">{a.createdBy}</span>
                        <span className="ml-auto text-xs text-gray-400">{timeAgo(a.createdAt)}</span>
                      </div>
                      <div className="text-gray-700 text-xs break-words line-clamp-4">{a.body}</div>
                    </div>
                  ))}
                </div>
                {joined && (
                  <div className="mt-2">
                    <textarea
                      className="w-full border rounded px-2 py-1 text-xs mb-1"
                      placeholder="Write your answer..."
                      value={answerText[q.id] || ""}
                      onChange={(e) => setAnswerText((t) => ({ ...t, [q.id]: e.target.value }))}
                      rows={2}
                      maxLength={400}
                    />
                    {answerError[q.id] && <div className="text-xs text-red-500 mb-1">{answerError[q.id]}</div>}
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium"
                      onClick={() => handleAnswer(q.id)}
                    >
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
