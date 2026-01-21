import React, { useRef, useEffect, useState } from "react";

export default function QuestionThread({
  question,
  onAddAnswer,
  currentUser,
  autoFocus,
  loading,
}) {
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef();
  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    onAddAnswer(answer.trim());
    setAnswer("");
    setSubmitting(false);
  };

  const timeAgo = (ts) => {
    const d = Date.now() - ts;
    if (d < 60000) return "just now";
    if (d < 3600000) return `${Math.floor(d / 60000)} min ago`;
    if (d < 86400000) return `${Math.floor(d / 3600000)} hr ago`;
    return `${Math.floor(d / 86400000)}d ago`;
  };

  return (
    <div className="bg-gray-50 border-l-4 border-green-200 rounded-xl px-6 py-4 mb-4 max-w-4xl mx-auto">
      <div className="mb-2">
        <div className="font-semibold text-base mb-1">{question.title}</div>
        <div className="text-gray-700 text-sm mb-2">{question.body}</div>
        <div className="text-xs text-gray-400 mb-2">
          Asked by <span className="font-medium text-gray-600">{question.author?.name}</span> • {timeAgo(question.createdAt)}
        </div>
        {question.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[11px] border border-green-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mb-3">
        {question.answers?.length === 0 && (
          <div className="text-gray-400 text-sm mb-2">No answers yet. Be the first to answer!</div>
        )}
        {question.answers?.map((a) => (
          <div key={a.id} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-green-700 text-xs">{a.author?.name}</span>
              <span className="text-xs text-gray-400">{timeAgo(a.createdAt)}</span>
            </div>
            <div className="text-gray-800 text-sm mb-1">{a.body}</div>
            <div className="border-b border-gray-200" />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 resize-none min-h-[60px]"
          placeholder="Add your answer..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={submitting || loading}
        />
        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-lg font-medium disabled:opacity-60"
            disabled={!answer.trim() || submitting || loading}
          >
            {submitting || loading ? "Posting..." : "Post Answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
