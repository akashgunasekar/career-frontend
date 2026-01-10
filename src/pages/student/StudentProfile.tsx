import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "");
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-600">Unauthorized. Please login again.</p>
          <button
            onClick={() => navigate("/student/login")}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Enter full name");
      return;
    }

    setLoading(true);
    try {
      await completeProfile({
        studentId: user.id,
        full_name: fullName,
        grade,
        board,
        city,
      });

      // update auth state using context
      login(
        {
          ...user,
          name: fullName,
        },
        token!
      );

      navigate("/student/dashboard");
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Profile & Settings</h1>
          <p className="text-blue-200 text-lg">
            Manage your profile information and preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
            <p className="text-slate-600 text-sm">
              Update your profile to get better career recommendations.
            </p>
          </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Grade/Class</label>
            <input
              type="text"
              placeholder="e.g., 10th, 12th, Graduation"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Board/University</label>
            <input
              type="text"
              placeholder="e.g., CBSE, State Board"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Additional Settings */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/student/notifications")}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition text-left"
            >
              <i className="fas fa-bell text-blue-600 text-xl"></i>
              <div>
                <div className="font-semibold text-slate-900">Notifications</div>
                <div className="text-xs text-slate-600">Manage your notifications</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/student/premium")}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition text-left"
            >
              <i className="fas fa-crown text-purple-600 text-xl"></i>
              <div>
                <div className="font-semibold text-slate-900">Upgrade to Premium</div>
                <div className="text-xs text-slate-600">Unlock advanced features</div>
              </div>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
