import React, { useState, useRef, useEffect } from "react";
import { X, Plus, HelpCircle } from "lucide-react";

const tagSuggestions = {
  "group-1": ["FIRE", "Withdrawal", "SIP", "Lifestyle"],
  "group-2": ["Healthcare", "Inflation", "Insurance"],
  "group-3": ["Travel", "Budgeting", "Adventure"],
};

export default function AskQuestionModal({
  open,
  onClose,
  onSubmit,
  groupId,
  loading,
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const titleRef = useRef();

  useEffect(() => {
    if (open && titleRef.current) titleRef.current.focus();
    if (!open) {
      setTitle("");
      setBody("");
      setTags([]);
      setTagInput("");
      setError("");
    }
  }, [open]);

  const handleAddTag = (tag) => {
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim().length < 5 || title.trim().length > 120) {
      setError("Title must be 5–120 characters");
      return;
    }
    if (!body.trim()) {
      setError("Description is required");
      return;
    }
    onSubmit({ title: title.trim(), body: body.trim(), tags });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="text-green-600" size={22} />
          <div className="text-lg font-bold">Ask a Question</div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              ref={titleRef}
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Question title (5–120 chars)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>
          <div>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 min-h-[80px]"
              placeholder="Describe your question in detail..."
              value={body}
              onChange={e => setBody(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex gap-2 flex-wrap mb-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs border border-green-100 flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-red-400"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Add tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(tagInput.trim());
                  }
                }}
              />
              <button
                type="button"
                className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium"
                onClick={() => handleAddTag(tagInput.trim())}
              >
                Add
              </button>
              {tagSuggestions[groupId]?.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs border border-gray-200 ml-1"
                  onClick={() => handleAddTag(tag)}
                  disabled={tags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-xs mb-1">{error}</div>}
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded-lg font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium disabled:opacity-60"
              disabled={loading || !title.trim() || !body.trim() || title.length < 5 || title.length > 120}
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
