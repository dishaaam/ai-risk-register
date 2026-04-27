const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-7 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;