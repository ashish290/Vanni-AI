const ProgressBar = ({ value, max, label, colorClass = "bg-saffron-500" }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 font-medium">{label}</span>
          <span className="text-gray-400">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
