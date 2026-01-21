import React from "react";

export default function QuestionCard({
  question,
  onAnswer,
  onViewThread,
  isOpen,
  answerCount,
  highlight,
  currentUser,
}) {
  const { title, body, author, createdAt, tags = [] } = question;
  const preview = body.length > 80 ? body.slice(0, 80) + "..." : body;
  const timeAgo = (ts) => {
    const d = Date.now() - ts;
    if (d < 60000) return "just now";
    if (d < 3600000) return `${Math.floor(d / 60000)} min ago`;
    if (d < 86400000) return `${Math.floor(d / 3600000)} hr ago`;
    return `${Math.floor(d / 86400000)}d ago`;
  };
  return (
    <div
      className={
        `flex items-center gap-4 bg-white border rounded-xl px-4 py-3 mb-3 shadow-sm transition-all max-w-4xl mx-auto ` +
        (highlight ? "ring-2 ring-green-300" : "hover:shadow-md")
      }
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-lg">
        {author?.name?.[0] || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base truncate">{title}</div>
        <div className="text-gray-500 text-xs truncate">{preview}</div>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          Asked by <span className="font-medium text-gray-600">{author?.name}</span> • {timeAgo(createdAt)}
          {tags.length > 0 && (
            <span className="ml-2 flex gap-1 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[11px] border border-green-100"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[110px]">
        <button
          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-lg font-medium mb-1 w-full"
          onClick={onAnswer}
        >
          Answer
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg font-medium w-full"
          onClick={onViewThread}
        >
          {isOpen ? "Close thread" : "View thread"}
        </button>
        <span className="bg-gray-200 text-gray-700 text-[11px] px-2 py-0.5 rounded-full mt-1">
          {answerCount} {answerCount === 1 ? "reply" : "replies"}
        </span>
      </div>
    </div>
  );
}
