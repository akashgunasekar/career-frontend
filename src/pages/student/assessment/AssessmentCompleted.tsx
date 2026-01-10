import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { fetchFinalResults } from "../../../api/testApi";
import { getRecommendedCareers } from "../../../api/careerApi";
import { useAuth } from "../../../context/AuthContext";

interface Career {
  id: number;
  name: string;
}

export default function AssessmentCompleted() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  const topCategory = useMemo(() => {
    const entries = Object.entries(scores);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [scores]);

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    async function load() {
      if (!user) return;
      
      try {
        const res = await fetchFinalResults(user.id);
        const data = res.data;

        if (!data || !data.results || !data.results.length) {
          navigate("/student/assessment/start");
          return;
        }

        const mapped = data.results.reduce((acc: Record<string, number>, row: any) => {
          acc[row.category] = row.total;
          return acc;
        }, {});
        setScores(mapped);

        const careerRes = await getRecommendedCareers(user.id);
        setCareers(careerRes.data || []);
      } catch (err) {
        console.error("Error loading assessment results:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="h-20 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
            Assessment Complete
          </p>
              <h1 className="text-2xl font-semibold text-slate-900 mt-2 flex items-center gap-2">
                <i className="fas fa-trophy text-primary-600"></i>
                Great job! Here's your spotlight category
              </h1>
          <p className="text-slate-600 mt-1">
            Based on your responses, this is where you shine the most.
          </p>

              {topCategory && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full border border-primary-100">
                  <i className="fas fa-star"></i>
                  <span className="font-semibold">{topCategory}</span>
                </div>
              )}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Score summary</h3>
            <div className="text-xs text-slate-500">Higher = stronger alignment</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(scores).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between"
              >
                <span className="font-medium text-slate-800">{key}</span>
                <span className="text-primary-700 font-semibold">{value}</span>
              </div>
        ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">Recommended careers</h3>
            <span className="text-xs text-slate-500">
              Tailored from your strongest categories
            </span>
          </div>

          {careers.length === 0 && (
            <p className="text-slate-500 text-sm">No matching careers yet. Check back soon.</p>
          )}

          <div className="space-y-3">
        {careers.map((career) => (
              <div
                key={career.id}
                className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 hover:border-primary-200 transition"
              >
                <div>
                  <p className="font-semibold text-slate-900">{career.name}</p>
                  <p className="text-xs text-slate-500">Tap to explore colleges</p>
                </div>
            <button
              onClick={() => navigate(`/student/career/${career.id}`)}
                  className="text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
                  View colleges →
            </button>
              </div>
        ))}
          </div>
        </div>

        <div className="flex gap-3">
              <button
                onClick={() => navigate("/student/assessment/results")}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-card transition"
              >
                View Detailed Results
              </button>
      <button
        onClick={() => navigate("/student/dashboard")}
                className="flex-1 bg-white border border-slate-200 text-slate-800 font-semibold py-3 rounded-xl hover:border-primary-200 transition"
      >
        Go to Dashboard
      </button>
        </div>
      </div>
    </div>
  );
}