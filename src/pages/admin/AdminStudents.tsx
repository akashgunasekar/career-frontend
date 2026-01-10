import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../../api/adminApi";

interface Student {
  id: number;
  registration_number: string;
  phone: string;
  full_name: string;
  grade: string;
  board: string;
  city: string;
  is_profile_complete: boolean;
  created_at: string;
}

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    phone: "",
    full_name: "",
    grade: "",
    board: "",
    city: ""
  });

  useEffect(() => {
    loadStudents();
  }, [searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents({ search: searchTerm || undefined });
      setStudents(response.students || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load students");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await createStudent(formData);
      }
      closeModal();
      loadStudents();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save student");
      console.error("Error saving student:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        setError(null);
        await deleteStudent(id);
        loadStudents();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete student");
        console.error("Error deleting student:", err);
      }
    }
  };

  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        phone: student.phone,
        full_name: student.full_name,
        grade: student.grade,
        board: student.board,
        city: student.city
      });
    } else {
      setEditingStudent(null);
      setFormData({
        phone: "",
        full_name: "",
        grade: "",
        board: "",
        city: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      phone: "",
      full_name: "",
      grade: "",
      board: "",
      city: ""
    });
  };

  // Search is now handled server-side, but we keep this for client-side filtering if needed
  const filteredStudents = students;

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
              <h1 className="text-lg font-semibold text-slate-900">Manage Students</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition"
            >
              + Add Student
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-slate-900">{students.length}</p>
            <p className="text-sm text-slate-600">Total Students</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => s.is_profile_complete).length}
            </p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading students...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Reg. No</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Name</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Phone</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Grade</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">City</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-right py-4 px-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-slate-900">{student.registration_number}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-xs">
                          {student.full_name?.[0] || "S"}
                        </div>
                        <span className="font-medium text-slate-900">{student.full_name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">{student.phone}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{student.grade || "N/A"}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{student.city || "N/A"}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          student.is_profile_complete
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {student.is_profile_complete ? "Active" : "Incomplete"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingStudent ? "Edit Student" : "Add Student"}
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., 12th"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Board</label>
                  <input
                    type="text"
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., CBSE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter city"
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
                  {editingStudent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
