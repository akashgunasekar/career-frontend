import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

interface College {
  id: number;
  name: string;
  location?: string;
  rating?: number;
  description?: string;
  type?: string;
  fees_range?: string;
  website?: string;
  courses_offered?: string;
}

export default function CollegeDetail() {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    if (collegeId) {
      loadCollege();
      checkShortlistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId, user, navigate]);

  const loadCollege = async () => {
    try {
      const res = await axiosClient.get(`/college/${collegeId}`);
      setCollege(res.data);
    } catch (err) {
      console.error("Error loading college:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkShortlistStatus = async () => {
    if (!user || !collegeId) return;
    try {
      const res = await axiosClient.get(`/college/shortlist/check/${user.id}/${collegeId}`);
      setShortlisted(res.data.shortlisted);
    } catch (err) {
      console.error("Error checking shortlist status:", err);
    }
  };

  const handleShortlist = async () => {
    if (!user || !collegeId) return;

    setShortlisting(true);
    try {
      if (shortlisted) {
        await axiosClient.delete("/college/shortlist", {
          data: { studentId: user.id, collegeId: Number(collegeId) }
        });
        setShortlisted(false);
      } else {
        await axiosClient.post("/college/shortlist", {
          studentId: user.id,
          collegeId: Number(collegeId)
        });
        setShortlisted(true);
      }
    } catch (err) {
      console.error("Error updating shortlist:", err);
      alert("Failed to update shortlist. Please try again.");
    } finally {
      setShortlisting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-slate-300 mb-4"></i>
          <p className="text-xl font-semibold text-slate-700 mb-2">College not found</p>
          <button
            onClick={() => navigate("/student/colleges")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to College List
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
            onClick={() => navigate("/student/colleges")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to College List
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">{college.name}</h1>
              {college.location && (
                <p className="text-blue-200 text-lg flex items-center gap-2 mb-4">
                  <i className="fas fa-map-marker-alt"></i>
                  {college.location}
                </p>
              )}
              {college.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span className="text-xl font-bold">{college.rating}</span>
                    <span className="text-blue-200">/5.0</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleShortlist}
              disabled={shortlisting}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                shortlisted
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-blue-500 hover:bg-blue-400 text-white"
              }`}
            >
              {shortlisting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : shortlisted ? (
                <>
                  <i className="fas fa-star"></i>
                  <span>Shortlisted</span>
                </>
              ) : (
                <>
                  <i className="far fa-star"></i>
                  <span>Shortlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - College Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {college.name}</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                {college.description || "A prestigious institution offering quality education and excellent career opportunities."}
              </p>

              {college.type && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Institution Type</h3>
                  <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold">
                    {college.type}
                  </span>
                </div>
              )}

              {college.courses_offered && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Courses Offered</h3>
                  <p className="text-slate-700">{college.courses_offered}</p>
                </div>
              )}
            </div>

            {college.fees_range && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Fee Structure</h2>
                <div className="flex items-center gap-2">
                  <i className="fas fa-rupee-sign text-green-600 text-2xl"></i>
                  <span className="text-3xl font-bold text-slate-900">{college.fees_range}</span>
                </div>
                <p className="text-slate-600 text-sm mt-2">Annual fees range</p>
              </div>
            )}

            {college.website && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Official Website</h2>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  <span>Visit Website</span>
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShortlist}
                  disabled={shortlisting}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    shortlisted
                      ? "bg-yellow-50 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {shortlisting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : shortlisted ? (
                    <>
                      <i className="fas fa-star"></i>
                      <span>Shortlisted</span>
                    </>
                  ) : (
                    <>
                      <i className="far fa-star"></i>
                      <span>Add to Shortlist</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate("/student/counsellors")}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-user-tie"></i>
                  Book Counselor
                </button>
                <button
                  onClick={() => navigate("/student/colleges")}
                  className="w-full px-4 py-3 border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-university"></i>
                  Explore More Colleges
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get personalized guidance about admissions and courses
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
