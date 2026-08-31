import { useState } from "react";
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
import {
  MOCK_RESULTS,
  DAILY_BREAKDOWN,
  WEEKLY_BREAKDOWN,
  MONTHLY_BREAKDOWN,
} from "../services/resultsService";

const RANGE_OPTIONS = [
  { key: "daily", label: "Daily", data: DAILY_BREAKDOWN },
  { key: "weekly", label: "Weekly", data: WEEKLY_BREAKDOWN },
  { key: "monthly", label: "Monthly", data: MONTHLY_BREAKDOWN },
];

function DashboardPage() {
  const [range, setRange] = useState("daily");
  const passCount = MOCK_RESULTS.filter((result) => result.status === "PASS").length;
  const failCount = MOCK_RESULTS.filter((result) => result.status === "FAIL").length;
  const chartData = RANGE_OPTIONS.find((option) => option.key === range).data;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="mb-6 flex gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4">
          <p className="text-sm text-gray-500">Pass</p>
          <p className="text-2xl font-semibold text-green-600">{passCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4">
          <p className="text-sm text-gray-500">Fail</p>
          <p className="text-2xl font-semibold text-red-600">{failCount}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setRange(option.key)}
            className={
              range === option.key
                ? "rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4" style={{ height: 320 }}>
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
