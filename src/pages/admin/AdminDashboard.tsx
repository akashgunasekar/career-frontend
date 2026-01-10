import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOverviewStats } from "../../api/adminApi";

interface Stats {
  total_students: number;
  students_completed_tests: number;
  total_bookings: number;
  total_careers: number;
  total_colleges: number;
  total_counselors: number;
  total_institutes: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<Stats>({
    total_students: 0,
    students_completed_tests: 0,
    total_bookings: 0,
    total_careers: 0,
    total_colleges: 0,
    total_counselors: 0,
    total_institutes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getOverviewStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const menuItems = [
    { path: "/admin/dashboard", icon: "fa-home", label: "Dashboard" },
    { path: "/admin/students", icon: "fa-user-graduate", label: "Students" },
    { path: "/admin/questions", icon: "fa-question-circle", label: "Questions" },
    { path: "/admin/careers", icon: "fa-briefcase", label: "Career Paths" },
    { path: "/admin/colleges", icon: "fa-building-columns", label: "Colleges" },
    { path: "/admin/counsellors", icon: "fa-user-tie", label: "Counsellors" },
    { path: "/admin/stats", icon: "fa-chart-line", label: "Analytics" },
  ];

  const statCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: "fa-user-graduate",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      change: "+12%"
    },
    {
      title: "Total Careers",
      value: stats.total_careers,
      icon: "fa-briefcase",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      change: "+5%"
    },
    {
      title: "Total Colleges",
      value: stats.total_colleges,
      icon: "fa-building-columns",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      change: "+8%"
    },
    {
      title: "Total Counselors",
      value: stats.total_counselors,
      icon: "fa-user-tie",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      change: "+3%"
    },
    {
      title: "Completed Tests",
      value: stats.students_completed_tests,
      icon: "fa-clipboard-check",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      change: "+8%"
    },
    {
      title: "Counsellor Bookings",
      value: stats.total_bookings,
      icon: "fa-calendar-check",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      change: "+15%"
    },
    {
      title: "Active Institutes",
      value: stats.total_institutes,
      icon: "fa-school",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      change: "+3%"
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <i className="fas fa-compass text-white text-xl"></i>
            </div>
            <span className="font-bold text-xl text-slate-900">Career Clarity</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-600 transition"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hi, {user?.name || "Admin"}! <i className="fas fa-hand-wave text-yellow-500"></i>
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Here's what's happening with your platform today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-3 hover:bg-slate-100 rounded-xl transition">
                <i className="fas fa-bell text-slate-600 text-lg"></i>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-3 hover:bg-slate-100 rounded-xl transition">
                <i className="fas fa-cog text-slate-600 text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <i className={`fas ${stat.icon} ${stat.textColor} text-xl`}></i>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  {loading ? "..." : stat.value.toLocaleString()}
                </h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
                  <i className="fas fa-ellipsis-h text-slate-400"></i>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { path: "/admin/students", icon: "fa-user-plus", label: "Add Student", color: "blue", bgClass: "bg-blue-50", hoverBg: "hover:bg-blue-100", iconBg: "bg-blue-600" },
                    { path: "/admin/questions", icon: "fa-plus-circle", label: "Add Question", color: "green", bgClass: "bg-green-50", hoverBg: "hover:bg-green-100", iconBg: "bg-green-600" },
                    { path: "/admin/careers", icon: "fa-briefcase", label: "Add Career", color: "purple", bgClass: "bg-purple-50", hoverBg: "hover:bg-purple-100", iconBg: "bg-purple-600" },
                    { path: "/admin/colleges", icon: "fa-building-columns", label: "Add College", color: "orange", bgClass: "bg-orange-50", hoverBg: "hover:bg-orange-100", iconBg: "bg-orange-600" },
                    { path: "/admin/counsellors", icon: "fa-user-tie", label: "Add Counsellor", color: "pink", bgClass: "bg-pink-50", hoverBg: "hover:bg-pink-100", iconBg: "bg-pink-600" },
                    { path: "/admin/stats", icon: "fa-chart-line", label: "View Reports", color: "cyan", bgClass: "bg-cyan-50", hoverBg: "hover:bg-cyan-100", iconBg: "bg-cyan-600" },
                  ].map((action) => (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className={`flex flex-col items-center gap-3 p-4 ${action.bgClass} ${action.hoverBg} rounded-xl transition group border border-slate-100`}
                    >
                      <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition`}>
                        <i className={`fas ${action.icon} text-xl`}></i>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    <i className="fas fa-history text-blue-600 mr-2"></i>
                    Recent Activity
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { user: "Arun Kumar", action: "completed career assessment", time: "2 mins ago", icon: "fa-check-circle", color: "text-green-600 bg-green-50" },
                    { user: "Priya Sharma", action: "booked counsellor session", time: "15 mins ago", icon: "fa-calendar-check", color: "text-blue-600 bg-blue-50" },
                    { user: "Raj Institute", action: "registered 5 new students", time: "1 hour ago", icon: "fa-users", color: "text-purple-600 bg-purple-50" },
                    { user: "Dr. Mehta", action: "completed counselling session", time: "2 hours ago", icon: "fa-user-tie", color: "text-orange-600 bg-orange-50" }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group">
                      <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                        <i className={`fas ${activity.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{activity.user}</p>
                        <p className="text-xs text-slate-600">{activity.action}</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Growth Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  <i className="fas fa-chart-line text-blue-600 mr-2"></i>
                  User Growth
                </h3>
                <div className="flex items-end justify-between gap-2 h-32 mb-4">
                  {[40, 60, 45, 75, 55, 85, 70].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end group">
                      <div
                        className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 relative"
                        style={{ height: `${height}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 opacity-0 group-hover:opacity-100 transition">
                          {Math.round(height)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>

              {/* Top Counsellors */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                  Top Counsellors
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Dr. Sarah", sessions: 45, rating: 4.9, avatar: "S" },
                    { name: "Prof. Kumar", sessions: 38, rating: 4.8, avatar: "K" },
                    { name: "Ms. Priya", sessions: 32, rating: 4.7, avatar: "P" }
                  ].map((counsellor, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {counsellor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{counsellor.name}</p>
                        <p className="text-xs text-slate-500">{counsellor.sessions} sessions</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <i className="fas fa-star text-yellow-500 text-xs"></i>
                          <span className="text-xs font-semibold text-slate-900">{counsellor.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  <i className="fas fa-heartbeat text-red-600 mr-2"></i>
                  System Health
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "API Status", value: 98, status: "Healthy", color: "green" },
                    { label: "Database", value: 95, status: "Good", color: "green" },
                    { label: "Storage", value: 72, status: "72%", color: "blue" }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600">{item.label}</span>
                        <span className={`font-semibold text-${item.color}-600`}>{item.status}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
