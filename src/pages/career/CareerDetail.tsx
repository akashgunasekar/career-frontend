import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import { getCollegesForCareer } from "../../api/careerApi";

interface Career {
  id: number;
  name: string;
  description?: string;
  category?: string;
  skills_required?: string;
}

interface College {
  id: number;
  name: string;
  location?: string;
  rating?: number;
  description?: string;
  type?: string;
}

export default function CareerDetail() {
  const { careerId } = useParams<{ careerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [career, setCareer] = useState<Career | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    if (careerId) {
      loadCareer();
      loadColleges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerId, user, navigate]);

  const loadCareer = async () => {
    try {
      const res = await axiosClient.get(`/career/${careerId}`);
      setCareer(res.data);
    } catch (err) {
      console.error("Error loading career:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadColleges = async () => {
    try {
      const res = await getCollegesForCareer(Number(careerId));
      setColleges(res.data || []);
    } catch (err) {
      console.error("Error loading colleges:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-slate-300 mb-4"></i>
          <p className="text-xl font-semibold text-slate-700 mb-2">Career not found</p>
          <button
            onClick={() => navigate("/student/career-library")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to Career Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/student/career-library")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to Career Library
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{career.name}</h1>
          {career.category && (
            <span className="inline-block px-4 py-2 bg-blue-500 rounded-full text-sm font-semibold mb-4">
              {career.category}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Career Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Career</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                {career.description || "This is an exciting career path with numerous opportunities for growth and development."}
              </p>

              {career.skills_required && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.skills_required.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colleges Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Top Colleges for {career.name}</h2>
                <button
                  onClick={() => navigate(`/student/colleges?career=${careerId}`)}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>

              {colleges.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-university text-6xl text-slate-300 mb-4"></i>
                  <p className="text-slate-600">No colleges available for this career yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {colleges.map((college) => (
                    <div
                      key={college.id}
                      onClick={() => navigate(`/student/college/${college.id}`)}
                      className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                            {college.name}
                          </h3>
                          {college.location && (
                            <p className="text-slate-600 text-sm mb-2 flex items-center gap-2">
                              <i className="fas fa-map-marker-alt text-blue-500"></i>
                              {college.location}
                            </p>
                          )}
                          {college.rating && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <i className="fas fa-star text-yellow-500"></i>
                                <span className="text-sm font-semibold text-slate-700">{college.rating}/5.0</span>
                              </div>
                            </div>
                          )}
                          {college.description && (
                            <p className="text-slate-600 text-sm line-clamp-2">{college.description}</p>
                          )}
                        </div>
                        <i className="fas fa-arrow-right text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition ml-4"></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/student/assessment/start")}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-clipboard-list"></i>
                  Take Assessment
                </button>
                <button
                  onClick={() => navigate("/student/counsellors")}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-user-tie"></i>
                  Book Counselor
                </button>
                <button
                  onClick={() => navigate("/student/career-library")}
                  className="w-full px-4 py-3 border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-briefcase"></i>
                  Explore More Careers
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get personalized guidance from our expert counselors
              </p>
              <button
                onClick={() => navigate("/student/counsellors")}
                className="w-full px-4 py-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl font-semibold transition"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
