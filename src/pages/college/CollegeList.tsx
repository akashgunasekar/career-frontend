import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

export default function CollegeList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    loadColleges();
  }, [user, navigate]);

  const loadColleges = async () => {
    try {
      const res = await axiosClient.get("/college/all");
      setColleges(res.data || []);
    } catch (err) {
      console.error("Error loading colleges:", err);
    } finally {
      setLoading(false);
    }
  };

  const types = Array.from(new Set(colleges.map(c => c.type).filter(Boolean)));
  const locations = Array.from(new Set(colleges.map(c => c.location?.split(',')[0]).filter(Boolean)));

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || college.type === selectedType;
    const matchesLocation = selectedLocation === "all" || college.location?.includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading colleges...</p>
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">College Directory</h1>
          <p className="text-blue-200 text-lg sm:text-xl">
            Explore top colleges and universities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colleges Grid */}
        {filteredColleges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i className="fas fa-university text-6xl text-slate-300 mb-4"></i>
            <p className="text-xl font-semibold text-slate-700 mb-2">No colleges found</p>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => navigate(`/student/college/${college.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                    <i className="fas fa-university text-blue-600 text-xl"></i>
                  </div>
                  {college.rating && (
                    <div className="flex items-center gap-1">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span className="text-sm font-semibold text-slate-700">{college.rating}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {college.name}
                </h3>
                {college.location && (
                  <p className="text-slate-600 text-sm mb-2 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    {college.location}
                  </p>
                )}
                {college.type && (
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full mb-3">
                    {college.type}
                  </span>
                )}
                {college.fees_range && (
                  <p className="text-slate-600 text-sm mb-4">
                    <i className="fas fa-rupee-sign text-green-600"></i> {college.fees_range}
                  </p>
                )}
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {college.description || "A prestigious institution offering quality education."}
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
          Showing {filteredColleges.length} of {colleges.length} colleges
        </div>
      </div>
    </div>
  );
}

