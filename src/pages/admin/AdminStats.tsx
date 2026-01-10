import { useEffect, useState } from "react";
import { getOverviewStats } from "../../api/adminApi";

interface Stats {
  total_students: number;
  students_completed_tests: number;
  total_bookings: number;
}

const StatCard = ({
  label,
  value,
  accent = "primary",
}: {
  label: string;
  value: number | string;
  accent?: "primary" | "green" | "purple";
}) => {
  const colors =
    accent === "green"
      ? "from-emerald-500 to-emerald-600"
      : accent === "purple"
      ? "from-indigo-500 to-indigo-600"
      : "from-primary-500 to-primary-600";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-4 flex items-center gap-3">
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors} text-white flex items-center justify-center font-semibold`}>
        ✦
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverviewStats()
      .then((res) => setStats(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
              Admin Overview
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Platform performance</h1>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse h-24" />
            ))}
          </div>
        )}

        {!loading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total students" value={stats.total_students} />
            <StatCard label="Completed tests" value={stats.students_completed_tests} accent="green" />
            <StatCard label="Counselor bookings" value={stats.total_bookings} accent="purple" />
          </div>
        )}
      </div>
    </div>
  );
}







