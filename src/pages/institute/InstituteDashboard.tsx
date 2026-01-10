import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InstituteDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "reports">("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fas fa-school"></i>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Institute Dashboard</h1>
                <p className="text-xs text-slate-500">{user?.name || "Institute"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            {(["overview", "students", "reports"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Students", value: "156", icon: "fa-user-graduate", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", iconColor: "text-blue-600" },
                { title: "Completed Tests", value: "98", icon: "fa-check-circle", color: "from-green-500 to-green-600", bg: "bg-green-50", iconColor: "text-green-600" },
                { title: "Pending", value: "58", icon: "fa-clock", color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-50", iconColor: "text-yellow-600" },
                { title: "Counsellor Sessions", value: "42", icon: "fa-user-tie", color: "from-purple-500 to-purple-600", bg: "bg-purple-50", iconColor: "text-purple-600" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}>
                      <i className={`fas ${stat.icon} ${stat.iconColor}`}></i>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition text-left">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shrink-0">
                    <i className="fas fa-plus"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Register Student</h3>
                    <p className="text-xs text-slate-600">Add new student</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition text-left">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl shrink-0">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">View Reports</h3>
                    <p className="text-xs text-slate-600">Student progress</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition text-left">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shrink-0">
                    <i className="fas fa-file-upload"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Bulk Upload</h3>
                    <p className="text-xs text-slate-600">Upload CSV</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Students</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 uppercase">Name</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 uppercase">Grade</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 uppercase">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-slate-600 uppercase">Progress</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-slate-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Arun Kumar", grade: "12th", status: "Completed", progress: 100 },
                      { name: "Priya Sharma", grade: "11th", status: "In Progress", progress: 75 },
                      { name: "Raj Patel", grade: "12th", status: "Pending", progress: 0 },
                      { name: "Meera Singh", grade: "10th", status: "In Progress", progress: 50 }
                    ].map((student, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-xs">
                              {student.name[0]}
                            </div>
                            <span className="font-medium text-slate-900 text-sm">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-slate-600">{student.grade}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              student.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : student.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 w-8">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <p className="text-slate-600 text-center py-12">Student management coming soon...</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <p className="text-slate-600 text-center py-12">Reports and analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
