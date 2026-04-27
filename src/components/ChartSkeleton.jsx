const ChartSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="flex items-end gap-3 h-48">
        {[60, 90, 45, 75, 30, 55].map((h, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t flex-1"
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;