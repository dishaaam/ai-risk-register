const ScoreMeter = ({ score }) => {
  const getColor = () => {
    if (score >= 70) return { bar: "bg-red-500", text: "text-red-600", label: "High Risk" };
    if (score >= 50) return { bar: "bg-yellow-500", text: "text-yellow-600", label: "Medium Risk" };
    return { bar: "bg-green-500", text: "text-green-600", label: "Low Risk" };
  };

  const { bar, text, label } = getColor();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className={`text-2xl font-bold ${text}`}>{score}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          score >= 70 ? "bg-red-100 text-red-700" :
          score >= 50 ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700"
        }`}>
          {label}
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${bar}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default ScoreMeter;