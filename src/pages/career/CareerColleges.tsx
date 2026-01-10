import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCollegesForCareer } from "../../api/careerApi";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

interface College {
  id: number;
  name: string;
  location?: string;
  rating?: number;
  description?: string;
}

export default function CareerColleges() {
  const { careerId } = useParams<{ careerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [careerName, setCareerName] = useState("Career");

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    async function loadColleges() {
      if (!careerId) return;

      try {
        // Load career name
        try {
          const careerRes = await axiosClient.get(`/career/${careerId}`);
          setCareerName(careerRes.data?.name || "Career");
        } catch (err) {
          console.error("Error loading career name:", err);
        }

        const res = await getCollegesForCareer(Number(careerId));
        setColleges(res.data || []);
      } catch (err) {
        console.error("Error loading colleges:", err);
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, [careerId, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-6 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-20 bg-slate-200 rounded-lg" />
              <div className="h-20 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">Colleges for {careerName}</h1>
          <p className="text-slate-600 text-sm mt-1">
            Explore colleges that offer programs aligned with this career path.
          </p>
        </div>

        {colleges.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-card text-center">
            <p className="text-slate-500">No colleges available for this career yet.</p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Return to dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:border-primary-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{college.name}</h3>
                    {college.location && (
                      <p className="text-sm text-slate-500 mt-1">📍 {college.location}</p>
                    )}
                    {college.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <i className="fas fa-star text-yellow-500"></i>
                        <span className="text-sm text-slate-600">{college.rating}/5.0</span>
                      </div>
                    )}
                    {college.description && (
                      <p className="text-sm text-slate-600 mt-2">{college.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/student/college/${college.id}`)}
                    className="ml-4 text-sm font-semibold text-primary-700 hover:text-primary-800 whitespace-nowrap"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/student/dashboard")}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-card transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
