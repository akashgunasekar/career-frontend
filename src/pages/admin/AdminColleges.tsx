import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getColleges, createCollege, updateCollege, deleteCollege } from "../../api/adminApi";

interface College {
  id: number;
  name: string;
  city?: string;
  state?: string;
  website?: string;
  location?: string; // Computed from city + state
  type?: string; // Not in DB, but used in UI
  rating?: number; // Not in DB, but used in UI
  fees_range?: string; // Not in DB, but used in UI
  description?: string; // Not in DB, but used in UI
  courses_offered?: string; // Not in DB, but used in UI
  is_active?: boolean; // Not in DB, but used in UI
  created_at?: string;
}

export default function AdminColleges() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    website: "",
    type: "",
    rating: 0,
    fees_range: "",
    description: "",
    courses_offered: ""
  });

  const collegeTypes = ["University", "Engineering", "Medical", "Management", "Arts & Science", "Law", "Design", "Other"];

  useEffect(() => {
    loadColleges();
  }, [searchTerm, selectedType]);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getColleges({
        search: searchTerm || undefined,
      });
      // Map database fields to UI format
      const mappedColleges = (response.colleges || []).map((college: any) => ({
        ...college,
        location: college.location || (college.city && college.state ? `${college.city}, ${college.state}` : college.city || college.state || ''),
        type: college.type || 'Other',
        rating: college.rating || 0,
        fees_range: college.fees_range || 'N/A',
        description: college.description || '',
        courses_offered: college.courses_offered || '',
        is_active: college.is_active !== undefined ? college.is_active : true
      }));
      setColleges(mappedColleges);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load colleges");
      console.error("Error loading colleges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      // Parse location into city and state
      const locationParts = formData.location.split(',').map(s => s.trim());
      const city = locationParts[0] || '';
      const state = locationParts[1] || '';
      
      if (editingCollege) {
        await updateCollege(editingCollege.id, {
          name: formData.name,
          location: formData.location,
          website: formData.website,
        });
      } else {
        await createCollege({
          name: formData.name,
          location: formData.location,
          website: formData.website,
        });
      }
      closeModal();
      loadColleges();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save college");
      console.error("Error saving college:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      try {
        setError(null);
        await deleteCollege(id);
        loadColleges();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete college");
        console.error("Error deleting college:", err);
      }
    }
  };

  const toggleActive = async (id: number) => {
    // Note: is_active is not in database schema, so this is a no-op
    // But we keep it for UI consistency
  };

  const openModal = (college?: College) => {
    if (college) {
      setEditingCollege(college);
      setFormData({
        name: college.name || "",
        location: college.location || (college.city && college.state ? `${college.city}, ${college.state}` : college.city || college.state || ''),
        website: college.website || '',
        type: college.type || '',
        rating: college.rating || 0,
        fees_range: college.fees_range || '',
        description: college.description || '',
        courses_offered: college.courses_offered || ''
      });
    } else {
      setEditingCollege(null);
      setFormData({
        name: "",
        location: "",
        website: "",
        type: "",
        rating: 0,
        fees_range: "",
        description: "",
        courses_offered: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCollege(null);
  };

  const filteredColleges = colleges.filter(c => {
    const location = c.location || (c.city && c.state ? `${c.city}, ${c.state}` : c.city || c.state || '');
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              <h1 className="text-lg font-semibold text-slate-900">Manage Colleges</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition"
            >
              + Add College
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="All">All Types</option>
              {collegeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-slate-900">{colleges.length}</p>
            <p className="text-sm text-slate-600">Total Colleges</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {colleges.filter(c => c.website).length}
            </p>
            <p className="text-sm text-slate-600">With Website</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{filteredColleges.length}</p>
            <p className="text-sm text-slate-600">Filtered</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Loading colleges...</p>
          </div>
        ) : (
          <>
            {/* Colleges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredColleges.map((college) => (
            <div
              key={college.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{college.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">
                    📍 {college.location || (college.city && college.state ? `${college.city}, ${college.state}` : college.city || college.state || 'N/A')}
                  </p>
                  {college.website && (
                    <div className="flex items-center gap-2">
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        <i className="fas fa-external-link-alt mr-1"></i>
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {college.website && (
                <div className="mb-4">
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Visit Website
                  </a>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(college)}
                  className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(college.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

            {filteredColleges.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                No colleges found. Try adjusting your filters or add a new college.
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCollege ? "Edit College" : "Add College"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., IIT Bombay"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://example.edu"
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
                  {editingCollege ? "Update" : "Add"} College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
