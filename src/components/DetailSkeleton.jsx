const DetailSkeleton = () => {
  return (
    <div className="animate-pulse max-w-4xl mx-auto p-6">
      {/* Back button skeleton */}
      <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>

      {/* Header skeleton */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3 flex-1">
            <div className="h-7 bg-gray-200 rounded w-2/3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded-lg w-16"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-16"></div>
          </div>
        </div>
      </div>

      {/* Fields skeleton */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-40"></div>
            </div>
          ))}
        </div>
      </div>

      {/* AI card skeleton */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;