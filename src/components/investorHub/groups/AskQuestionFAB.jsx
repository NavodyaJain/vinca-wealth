import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

export default function AskQuestionFAB({ onClick }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <button
      className={`fixed bottom-7 right-7 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 ${show ? "opacity-100" : "opacity-0"}`}
      onClick={onClick}
      title="Ask a question"
      aria-label="Ask a question"
      style={{ boxShadow: "0 4px 24px 0 rgba(0,128,64,0.12)" }}
    >
      <Plus size={32} />
      <span className="sr-only">Ask a question</span>
    </button>
  );
}
