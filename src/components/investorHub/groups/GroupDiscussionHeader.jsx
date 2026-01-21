import React, { useState, useRef } from "react";
import { Search, Info } from "lucide-react";

export default function GroupDiscussionHeader({ onSearch }) {
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      <div className="relative mb-2">
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white text-sm shadow-sm"
          placeholder="Search questions (e.g., withdrawal rate, SIP, healthcare costs...)"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            onSearch && onSearch(e.target.value);
          }}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      </div>
    </div>
  );
}
