import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, CircleCheck, CircleX, Clock, Monitor, Apple } from "lucide-react";
import {
  fetchResults,
  buildDailyBreakdown,
  buildWeeklyBreakdown,
  buildMonthlyBreakdown,
} from "../services/resultsService";
import Card from "../components/Card";

const RANGE_OPTIONS = [
  { key: "daily", label: "Daily", build: buildDailyBreakdown },
  { key: "weekly", label: "Weekly", build: buildWeeklyBreakdown },
  { key: "monthly", label: "Monthly", build: buildMonthlyBreakdown },
];

function DashboardPage() {
  const [results, setResults] = useState([]);
  const [range, setRange] = useState("daily");

  useEffect(() => {
    fetchResults().then(setResults);
  }, []);

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;
  const pendingCount = results.filter((result) => result.status === "PENDING").length;
  const windowsCount = results.filter((result) => result.osFamily === "windows").length;
  const macosCount = results.filter((result) => result.osFamily === "macos").length;
  const osPercent = (count) => (results.length ? Math.round((count / results.length) * 100) : 0);
  const chartData = useMemo(
    () => RANGE_OPTIONS.find((option) => option.key === range).build(results),
    [results, range],
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card label="Total" value={results.length} icon={Users} />
        <Card label="Pass" value={passCount} valueClassName="text-green-600" icon={CircleCheck} />
        <Card label="Fail" value={failCount} valueClassName="text-red-600" icon={CircleX} />
        <Card
          label="Pending"
          value={pendingCount}
          valueClassName="text-gray-600 dark:text-gray-400"
          icon={Clock}
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card
          label="Windows Submitted"
          value={`${windowsCount} (${osPercent(windowsCount)}%)`}
          icon={Monitor}
        />
        <Card
          label="Macbook Submitted"
          value={`${macosCount} (${osPercent(macosCount)}%)`}
          icon={Apple}
        />
      </div>

      <div className="mb-4 flex gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setRange(option.key)}
            className={
              range === option.key
                ? "cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                : "cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        style={{ height: 320 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pass" fill="#16a34a" name="Pass" />
            <Bar dataKey="fail" fill="#dc2626" name="Fail" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardPage;
