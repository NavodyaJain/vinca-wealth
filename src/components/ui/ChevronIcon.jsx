// Simple chevron arrow icon for expand/collapse
export default function ChevronIcon({ direction = "down", className = "", ...props }) {
  // direction: "down" | "right"
  const rotation = direction === "right" ? "-rotate-90" : "";
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${rotation} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
