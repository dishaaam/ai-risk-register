import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { getStats } from "../services/riskService";
import KpiCard from "../components/KpiCard";
import CardSkeleton from "../components/CardSkeleton";
import ChartSkeleton from "../components/ChartSkeleton";

const PIE_COLORS = ["#EF4444", "#EAB308", "#22C55E"];
const BAR_COLOR = "#1B4F8A";
const LINE_COLOR = "#1B4F8A";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of all risks at a glance
          </p>
        </div>
        <button
          onClick={() => navigate("/risks")}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm"
        >
          View All Risks →
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              title="Total Risks"
              value={stats.totalRisks}
              subtitle="All time"
              icon="📋"
              color="blue"
            />
            <KpiCard
              title="Open Risks"
              value={stats.openRisks}
              subtitle="Needs attention"
              icon="🔴"
              color="red"
            />
            <KpiCard
              title="In Progress"
              value={stats.inProgressRisks}
              subtitle="Being handled"
              icon="🟡"
              color="yellow"
            />
            <KpiCard
              title="Resolved"
              value={stats.resolvedRisks}
              subtitle="Completed"
              icon="✅"
              color="green"
            />
          </>
        )}
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading ? (
          [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              title="High Priority"
              value={stats.highPriority}
              subtitle="Critical risks"
              icon="🚨"
              color="red"
            />
            <KpiCard
              title="Avg Risk Score"
              value={stats.averageScore}
              subtitle="Out of 100"
              icon="📊"
              color="blue"
            />
            <KpiCard
              title="Low Priority"
              value={stats.lowPriority}
              subtitle="Minor risks"
              icon="🟢"
              color="green"
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Bar Chart — Risks by Category */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Risks by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={stats.byCategory}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart — Risks by Status */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Risks by Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.byStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.byStatus.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: "12px" }}>{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Bar Chart — Risks by Priority */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Risks by Priority
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.byPriority}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.byPriority.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line Chart — Risk Trend */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Risk Trend (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={stats.recentTrend}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                  dot={{ r: 4, fill: LINE_COLOR }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!loading && stats && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/create")}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm"
            >
              + Add New Risk
            </button>
            <button
              onClick={() => navigate("/risks")}
              className="border border-blue-900 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
            >
              📋 View All Risks
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              📊 Full Analytics
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;