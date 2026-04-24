const SortIcon = ({ column, sortBy, sortDir }) => {
  if (sortBy !== column) {
    return <span className="text-blue-300 ml-1">↕</span>;
  }
  return (
    <span className="text-white ml-1">
      {sortDir === "asc" ? "↑" : "↓"}
    </span>
  );
};

export default SortIcon;