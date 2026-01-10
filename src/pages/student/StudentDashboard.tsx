import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchFinalResults } from "../../api/testApi";
import { getRecommendedCareers } from "../../api/careerApi";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

interface Career {
  id: number;
  name: string;
  match_percentage?: number;
  category?: string;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [careers, setCareers] = useState<Career[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    async function loadData() {
      if (!user) return;
      
      try {
        const res = await fetchFinalResults(user.id);
        if (res.data && res.data.results && res.data.results.length > 0) {
          const mapped = res.data.results.reduce((acc: Record<string, number>, row: any) => {
            acc[row.category] = row.total;
            return acc;
          }, {});
          setScores(mapped);
          setHasCompletedAssessment(true);

          const careerRes = await getRecommendedCareers(user.id);
          const careersData = Array.isArray(careerRes.data) ? careerRes.data : (Array.isArray(careerRes) ? careerRes : []);
          setCareers(careersData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    loadData();
  }, [user, navigate]);

  // Skill Growth Radar Chart Data
  const skillGrowthData = useMemo(() => {
    const skills = ['Creative', 'Analytic', 'Leadership', 'Technical', 'Social'];
    return skills.map(skill => {
      // Map from assessment scores or use defaults
      const score = scores[skill] || Math.floor(Math.random() * 30) + 60;
      return {
        subject: skill,
        score: Math.min(100, Math.max(0, score)),
        fullMark: 100
      };
    });
  }, [scores]);

  // Top career matches with specific details
  const topCareers = useMemo(() => {
    const careerDetails: Record<string, { icon: string; category: string; info: string; match: number }> = {
      'UX Engineer': { icon: 'fa-code', category: 'Tech & Design', info: 'High Demand', match: 98 },
      'Product Designer': { icon: 'fa-palette', category: 'Creative', info: '$85k-$120k', match: 92 },
      'Data Analyst': { icon: 'fa-chart-line', category: 'Analytics', info: 'Remote Options', match: 88 }
    };

    if (careers.length > 0) {
      return careers.slice(0, 3).map((career, idx) => {
        const details = careerDetails[career.name] || {
          icon: 'fa-briefcase',
          category: career.category || 'Professional',
          info: 'High Growth',
          match: 85 - idx * 5
        };
        return { ...career, ...details };
      });
    }

    // Default careers if none available
    return [
      { id: 1, name: 'UX Engineer', icon: 'fa-code', category: 'Tech & Design', info: 'High Demand', match: 98 },
      { id: 2, name: 'Product Designer', icon: 'fa-palette', category: 'Creative', info: '$85k-$120k', match: 92 },
      { id: 3, name: 'Data Analyst', icon: 'fa-chart-line', category: 'Analytics', info: 'Remote Options', match: 88 }
    ];
  }, [careers]);

  const assessmentProgress = hasCompletedAssessment ? 75 : 0;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <i className="fas fa-bullseye text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-slate-900">Career Clarity</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveNav("Dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeNav === "Dashboard"
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <i className="fas fa-home w-5"></i>
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveNav("Assessments");
              navigate("/student/assessment/start");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeNav === "Assessments"
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <i className="fas fa-clipboard-list w-5"></i>
            <span className="font-medium">Assessments</span>
          </button>
          <button
            onClick={() => {
              setActiveNav("Career Paths");
              navigate("/student/career-library");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeNav === "Career Paths"
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <i className="fas fa-route w-5"></i>
            <span className="font-medium">Career Library</span>
          </button>
          <button
            onClick={() => setActiveNav("Learning")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeNav === "Learning"
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <i className="fas fa-book w-5"></i>
            <span className="font-medium">Learning</span>
          </button>
          <button
            onClick={() => {
              setActiveNav("Mentors");
              navigate("/student/counsellors");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeNav === "Mentors"
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <i className="fas fa-user-tie w-5"></i>
            <span className="font-medium">Mentors</span>
          </button>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => navigate("/student/profile")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          >
            <i className="fas fa-cog w-5"></i>
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={() => navigate("/student/notifications")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition relative"
          >
            <i className="fas fa-bell w-5"></i>
            <span className="font-medium">Notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => navigate("/student/premium")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          >
            <i className="fas fa-crown w-5 text-yellow-500"></i>
            <span className="font-medium">Upgrade Premium</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hi, {user?.name || "Student"}! <i className="fas fa-hand-wave text-yellow-500"></i>
              </h1>
              <p className="text-slate-600 mt-1">Let's discover your perfect career path today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">{user?.name || "Student"}</div>
                <div className="text-xs text-slate-500">Premium Member</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.[0] || "S"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Top Section - AI Recommendation & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendation Card */}
              {!hasCompletedAssessment ? (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <i className="fas fa-rocket text-8xl"></i>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium mb-4">
                      + AI Recommendation
                    </span>
                    <h2 className="text-2xl font-bold mb-3">Ready to unlock your potential?</h2>
                    <p className="text-slate-300 text-sm mb-6">
                      Complete your personality assessment to get personalized career matches tailored just for you.
                    </p>
                    <button
                      onClick={() => navigate("/student/assessment/start")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
                    >
                      Start Assessment <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <i className="fas fa-rocket text-8xl"></i>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium mb-4">
                      + AI Recommendation
                    </span>
                    <h2 className="text-2xl font-bold mb-3">Assessment Complete!</h2>
                    <p className="text-slate-300 text-sm mb-6">
                      View your detailed results and personalized career recommendations.
                    </p>
                    <button
                      onClick={() => navigate("/student/assessment/results")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
                    >
                      View Results <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment Progress Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">Assessment Progress</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6">Weekly Goal</p>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${assessmentProgress * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">{assessmentProgress}%</div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Personality Test</span>
                    <span className={`font-semibold ${hasCompletedAssessment ? 'text-blue-600' : 'text-slate-400'}`}>
                      {hasCompletedAssessment ? "Done" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Skills Analysis</span>
                    <span className="font-semibold text-orange-600">In Progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Career Matches & Skill Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Career Matches */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Your Top Career Matches</h3>
                  <button
                    onClick={() => navigate("/student/career-library")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {topCareers.map((career) => (
                    <div
                      key={career.id}
                      onClick={() => navigate(`/student/career/${career.id}`)}
                      className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <i className={`fas ${career.icon} text-slate-600`}></i>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          career.match >= 95 ? 'bg-green-50 text-green-600' : 
                          career.match >= 90 ? 'bg-green-50 text-green-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {career.match}% Match
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{career.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{career.category}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        {career.info.includes('$') ? (
                          <>
                            <i className="fas fa-dollar-sign"></i>
                            <span>{career.info}</span>
                          </>
                        ) : career.info.includes('High') ? (
                          <>
                            <i className="fas fa-arrow-trend-up"></i>
                            <span>{career.info}</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-building"></i>
                            <span>{career.info}</span>
        </>
      )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Growth */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Skill Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  {/* @ts-ignore */}
                  <RadarChart data={skillGrowthData}>
                    {/* @ts-ignore */}
                    <PolarGrid stroke="#e2e8f0" />
                    {/* @ts-ignore */}
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    {/* @ts-ignore */}
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                      tickCount={5}
                    />
                    {/* @ts-ignore */}
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Available Counselors */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Available Counselors</h3>
                  <p className="text-sm text-slate-500 mt-1">Book a session with our expert career counselors</p>
                </div>
                <button
                  onClick={() => navigate("/student/counsellors")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Dr. Sarah Williams", specialization: "Career Counselling", experience: "10 years", icon: "fa-user-tie", bgClass: "bg-blue-100", textClass: "text-blue-600" },
                  { name: "Prof. Raj Kumar", specialization: "Educational Guidance", experience: "8 years", icon: "fa-graduation-cap", bgClass: "bg-green-100", textClass: "text-green-600" },
                  { name: "Ms. Priya Sharma", specialization: "Psychology", experience: "12 years", icon: "fa-brain", bgClass: "bg-purple-100", textClass: "text-purple-600" }
                ].map((counselor, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate("/student/counsellors")}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 ${counselor.bgClass} rounded-lg flex items-center justify-center shrink-0`}>
                        <i className={`fas ${counselor.icon} ${counselor.textClass} text-lg`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">{counselor.name}</h4>
                        <p className="text-xs text-slate-600 mb-1">{counselor.specialization}</p>
                        <p className="text-xs text-slate-500">{counselor.experience} experience</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore Career Fields */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Explore Career Fields</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition">
                    <i className="fas fa-chevron-left text-slate-600"></i>
                  </button>
                  <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition">
                    <i className="fas fa-chevron-right text-slate-600"></i>
          </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "fa-laptop-code", name: "Technology", sub: "Software, Data, AI", bgClass: "bg-blue-50", hoverClass: "group-hover:bg-blue-100", textClass: "text-blue-600" },
                  { icon: "fa-heartbeat", name: "Healthcare", sub: "Medical, Research", bgClass: "bg-red-50", hoverClass: "group-hover:bg-red-100", textClass: "text-red-600" },
                  { icon: "fa-chart-line", name: "Finance", sub: "Banking, Investment", bgClass: "bg-green-50", hoverClass: "group-hover:bg-green-100", textClass: "text-green-600" },
                  { icon: "fa-book", name: "Education", sub: "Teaching, Admin", bgClass: "bg-purple-50", hoverClass: "group-hover:bg-purple-100", textClass: "text-purple-600" }
                ].map((field) => (
                  <div
                    key={field.name}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className={`w-16 h-16 ${field.bgClass} ${field.hoverClass} rounded-xl flex items-center justify-center mb-3 transition`}>
                      <i className={`fas ${field.icon} ${field.textClass} text-2xl`}></i>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{field.name}</h4>
                    <p className="text-xs text-slate-500">{field.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
