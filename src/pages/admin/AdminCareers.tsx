import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCareers, createCareer, updateCareer, deleteCareer } from "../../api/adminApi";

interface Career {
  id: number;
  name: string;
  description: string;
  category: string;
  average_salary: string;
  growth_rate: string;
  education_required: string;
  skills_required: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminCareers() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    average_salary: "",
    growth_rate: "",
    education_required: "",
    skills_required: ""
  });

  const categories = ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts & Design", "Business", "Other"];

  useEffect(() => {
    loadCareers();
  }, [searchTerm, selectedCategory]);

  const loadCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCareers({
        search: searchTerm || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      });
      setCareers(response.careers || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load careers");
      console.error("Error loading careers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingCareer) {
        await updateCareer(editingCareer.id, { ...formData, is_active: editingCareer.is_active });
      } else {
        await createCareer({ ...formData, is_active: true });
      }
      closeModal();
      loadCareers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save career");
      console.error("Error saving career:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this career?")) {
      try {
        setError(null);
        await deleteCareer(id);
        loadCareers();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete career");
        console.error("Error deleting career:", err);
      }
    }
  };

  const toggleActive = async (id: number) => {
    const career = careers.find(c => c.id === id);
    if (!career) return;
    try {
      setError(null);
      await updateCareer(id, { is_active: !career.is_active });
      loadCareers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update career");
      console.error("Error updating career:", err);
    }
  };

  const openModal = (career?: Career) => {
    if (career) {
      setEditingCareer(career);
      setFormData({
        name: career.name,
        description: career.description,
        category: career.category,
        average_salary: career.average_salary,
        growth_rate: career.growth_rate,
        education_required: career.education_required,
        skills_required: career.skills_required
      });
    } else {
      setEditingCareer(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        average_salary: "",
        growth_rate: "",
        education_required: "",
        skills_required: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCareer(null);
  };

  const filteredCareers = careers.filter(c =>
    (selectedCategory === "All" || c.category === selectedCategory) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <h1 className="text-lg font-semibold text-slate-900">Manage Careers</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition"
            >
              + Add Career
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
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-slate-900">{careers.length}</p>
            <p className="text-sm text-slate-600">Total Careers</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {careers.filter(c => c.is_active).length}
            </p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
            <p className="text-sm text-slate-600">Categories</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{filteredCareers.length}</p>
            <p className="text-sm text-slate-600">Filtered</p>
          </div>
        </div>

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{career.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {career.category}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={career.is_active}
                    onChange={() => toggleActive(career.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{career.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500"><i className="fas fa-dollar-sign mr-1"></i> Avg Salary</span>
                  <span className="font-semibold text-slate-900">{career.average_salary}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500"><i className="fas fa-chart-line mr-1"></i> Growth Rate</span>
                  <span className="font-semibold text-green-600">{career.growth_rate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500"><i className="fas fa-graduation-cap mr-1"></i> Education</span>
                  <span className="font-semibold text-slate-900 text-right">{career.education_required}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">Required Skills:</p>
                <p className="text-sm text-slate-700">{career.skills_required}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(career)}
                  className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(career.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
            No careers found. Try adjusting your filters or add a new career.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCareer ? "Edit Career" : "Add Career"}
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
                    Career Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Software Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Brief description of the career"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Average Salary *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.average_salary}
                    onChange={(e) => setFormData({ ...formData, average_salary: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., ₹8-15 LPA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Growth Rate *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.growth_rate}
                    onChange={(e) => setFormData({ ...formData, growth_rate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., 22%"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Education Required *
                </label>
                <input
                  type="text"
                  required
                  value={formData.education_required}
                  onChange={(e) => setFormData({ ...formData, education_required: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., BTech/BCA/MCA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills Required *
                </label>
                <input
                  type="text"
                  required
                  value={formData.skills_required}
                  onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., Programming, Problem Solving, Algorithms"
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
                  {editingCareer ? "Update" : "Add"} Career
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
