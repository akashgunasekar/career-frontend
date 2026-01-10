import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCounselors, createCounselor, updateCounselor, deleteCounselor } from "../../api/adminApi";

interface Counsellor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  specialization: string;
  experience_years?: number;
  qualification?: string;
  bio?: string;
  fee_per_session?: number;
  is_active?: boolean;
  rating?: number; // Not in DB, but used in UI
  total_sessions?: number; // Not in DB, but used in UI
  created_at?: string;
}

export default function AdminCounsellors() {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCounsellor, setEditingCounsellor] = useState<Counsellor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience_years: 0
  });

  const specializations = [
    "Career Counselling",
    "Educational Guidance",
    "Psychology",
    "Skill Development",
    "College Admissions",
    "Study Abroad",
    "Entrepreneurship",
    "Other"
  ];

  useEffect(() => {
    loadCounsellors();
  }, [searchTerm]);

  const loadCounsellors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCounselors({
        search: searchTerm || undefined,
      });
      // Map database fields to UI format
      const mappedCounsellors = (response.counselors || []).map((c: any) => ({
        ...c,
        rating: c.rating || 0,
        total_sessions: c.total_sessions || 0,
        is_active: c.is_active !== undefined ? c.is_active : true
      }));
      setCounsellors(mappedCounsellors);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load counselors");
      console.error("Error loading counselors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingCounsellor) {
        await updateCounselor(editingCounsellor.id, {
          name: formData.name,
          specialization: formData.specialization,
          experience_years: formData.experience_years,
          ...(formData.email ? { email: formData.email } : {}),
          ...(formData.phone ? { phone: formData.phone } : {})
        });
      } else {
        await createCounselor({
          name: formData.name,
          specialization: formData.specialization,
          experience_years: formData.experience_years,
          ...(formData.email ? { email: formData.email } : {}),
          ...(formData.phone ? { phone: formData.phone } : {}),
          is_active: true
        });
      }
      closeModal();
      loadCounsellors();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save counselor");
      console.error("Error saving counselor:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this counsellor?")) {
      try {
        setError(null);
        await deleteCounselor(id);
        loadCounsellors();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete counselor");
        console.error("Error deleting counselor:", err);
      }
    }
  };

  const toggleActive = async (id: number) => {
    try {
      const counsellor = counsellors.find(c => c.id === id);
      if (counsellor) {
        await updateCounselor(id, { is_active: !counsellor.is_active });
        loadCounsellors();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update counselor");
      console.error("Error updating counselor:", err);
    }
  };

  const openModal = (counsellor?: Counsellor) => {
    if (counsellor) {
      setEditingCounsellor(counsellor);
      setFormData({
        name: counsellor.name,
        email: counsellor.email || "",
        phone: counsellor.phone || "",
        specialization: counsellor.specialization,
        experience_years: counsellor.experience_years || 0
      });
    } else {
      setEditingCounsellor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience_years: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCounsellor(null);
  };

  const filteredCounsellors = counsellors.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Manage Counsellors</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition"
            >
              + Add Counsellor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search counsellors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-slate-900">{counsellors.length}</p>
            <p className="text-sm text-slate-600">Total Counsellors</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {counsellors.filter(c => c.is_active).length}
            </p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Loading counselors...</p>
          </div>
        ) : (
          <>
            {/* Counsellors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCounsellors.map((counsellor) => (
            <div
              key={counsellor.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {counsellor.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{counsellor.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span className="font-medium text-slate-700">{counsellor.rating}</span>
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={counsellor.is_active}
                    onChange={() => toggleActive(counsellor.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">📧</span>
                  <span className="text-slate-700 truncate">{counsellor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">📞</span>
                  <span className="text-slate-700">{counsellor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-briefcase text-slate-500"></i>
                  <span className="text-slate-700">{counsellor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">📅</span>
                  <span className="text-slate-700">{counsellor.experience_years} years exp</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-blue-700">{counsellor.total_sessions}</p>
                  <p className="text-xs text-blue-600">Sessions</p>
                </div>
                <div className={`rounded-lg p-2 text-center ${
                  counsellor.is_active ? "bg-green-50" : "bg-slate-50"
                }`}>
                  <p className={`text-xs font-semibold ${
                    counsellor.is_active ? "text-green-700" : "text-slate-500"
                  }`}>
                    {counsellor.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(counsellor)}
                  className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(counsellor.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          </div>

          {filteredCounsellors.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
              No counselors found. Try adjusting your search or add a new counselor.
            </div>
          )}
        </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCounsellor ? "Edit Counsellor" : "Add Counsellor"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="counsellor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Specialization *
                </label>
                <select
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter years of experience"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-card transition"
                >
                  {editingCounsellor ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
