const KpiCard = ({ title, value, subtitle, icon, color }) => {
  const colorStyles = {
    blue: "bg-blue-900 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
    green: "bg-green-500 text-white",
  };

  const lightStyles = {
    blue: "bg-blue-50 text-blue-900",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${colorStyles[color]}`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        {subtitle && (
          <span className={`text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full w-fit ${lightStyles[color]}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;