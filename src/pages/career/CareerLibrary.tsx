import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

interface Career {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export default function CareerLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    loadCareers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const loadCareers = async () => {
    try {
      const res = await axiosClient.get("/career/all");
      setCareers(res.data || []);
    } catch (err) {
      console.error("Error loading careers:", err);
      // Fallback: try to get from recommended endpoint
      try {
        const res = await axiosClient.get(`/career/recommended/${user?.id}`);
        setCareers(res.data || []);
      } catch (err2) {
        console.error("Error loading recommended careers:", err2);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(careers.map(c => c.category).filter(Boolean)));

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading careers...</p>
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
            onClick={() => navigate("/student/dashboard")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Career Library</h1>
          <p className="text-blue-200 text-lg sm:text-xl">
            Explore hundreds of career paths and find your perfect match
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Careers Grid */}
        {filteredCareers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i className="fas fa-briefcase text-6xl text-slate-300 mb-4"></i>
            <p className="text-xl font-semibold text-slate-700 mb-2">No careers found</p>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <div
                key={career.id}
                onClick={() => navigate(`/student/career/${career.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                    <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                  </div>
                  {career.category && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                      {career.category}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {career.name}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {career.description || "Explore this exciting career path and discover opportunities that match your interests."}
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  <span>View Details</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-slate-600">
          Showing {filteredCareers.length} of {careers.length} careers
        </div>
      </div>
    </div>
  );
}

