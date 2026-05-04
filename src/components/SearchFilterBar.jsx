import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STATUSES = ["All", "Open", "In Progress", "Resolved"];
const PRIORITIES = ["All", "High", "Medium", "Low"];
const CATEGORIES = ["All", "Security", "AI Risk", "Compliance", "Operational", "Financial", "Reputational"];

const SearchFilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "All");
  const [priority, setPriority] = useState(initialFilters.priority || "All");
  const [category, setCategory] = useState(initialFilters.category || "All");
  const [startDate, setStartDate] = useState(initialFilters.startDate || null);
  const [endDate, setEndDate] = useState(initialFilters.endDate || null);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef(null);

  // Count active filters
  const activeFilterCount = [
    status !== "All",
    priority !== "All",
    category !== "All",
    startDate !== null,
    endDate !== null,
  ].filter(Boolean).length;

  // Debounced search — waits 300ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ search, status, priority, category, startDate, endDate });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Instant update for dropdowns and dates
  useEffect(() => {
    onFilterChange({ search, status, priority, category, startDate, endDate });
  }, [status, priority, category, startDate, endDate]);

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setPriority("All");
    setCategory("All");
    setStartDate(null);
    setEndDate(null);
  };

  const hasAnyFilter =
    search || status !== "All" || priority !== "All" ||
    category !== "All" || startDate || endDate;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">

      {/* Top Row — Search + Filter Toggle */}
      <div className="flex gap-3 items-center">

        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search risks by title..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
            showFilters || activeFilterCount > 0
              ? "bg-blue-900 text-white border-blue-900"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span>⚙️</span>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Reset Button */}
        {hasAnyFilter && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Filter Panel — shown when toggle is on */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                From Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                placeholderText="Start date"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                To Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="End date"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {status !== "All" && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  Status: {status}
                  <button onClick={() => setStatus("All")} className="hover:text-blue-900 ml-1">✕</button>
                </span>
              )}
              {priority !== "All" && (
                <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  Priority: {priority}
                  <button onClick={() => setPriority("All")} className="hover:text-purple-900 ml-1">✕</button>
                </span>
              )}
              {category !== "All" && (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  Category: {category}
                  <button onClick={() => setCategory("All")} className="hover:text-green-900 ml-1">✕</button>
                </span>
              )}
              {startDate && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  From: {startDate.toLocaleDateString()}
                  <button onClick={() => setStartDate(null)} className="hover:text-yellow-900 ml-1">✕</button>
                </span>
              )}
              {endDate && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  To: {endDate.toLocaleDateString()}
                  <button onClick={() => setEndDate(null)} className="hover:text-yellow-900 ml-1">✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;