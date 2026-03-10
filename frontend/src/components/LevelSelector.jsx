const levels = [
  {
    value: "beginner",
    label: "Beginner",
    emoji: "🌱",
    desc: "Just starting out",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    emoji: "🌿",
    desc: "Know the basics",
  },
  { value: "advanced", label: "Advanced", emoji: "🌳", desc: "Almost fluent" },
];

const LevelSelector = ({ selected, onChange, compact = false }) => {
  if (compact) {
    return (
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-nunito focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 transition-all"
      >
        {levels.map((l) => (
          <option key={l.value} value={l.value}>
            {l.emoji} {l.label} — {l.desc}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {levels.map((l) => (
        <button
          key={l.value}
          type="button"
          onClick={() => onChange(l.value)}
          className={`
            p-4 rounded-xl border-2 transition-all duration-200 text-center
            ${
              selected === l.value
                ? "border-saffron-500 bg-saffron-50 dark:bg-saffron-900/30 dark:border-saffron-500 shadow-md shadow-saffron-100 dark:shadow-none"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-saffron-300 dark:hover:border-saffron-600 hover:bg-saffron-50/30 dark:hover:bg-saffron-900/20"
            }
          `}
        >
          <span className="text-2xl block mb-1">{l.emoji}</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
            {l.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {l.desc}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
