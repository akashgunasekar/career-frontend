import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFinalResults } from "../../../api/testApi";
import { getRecommendedCareers, getCollegesForCareer } from "../../../api/careerApi";
import { useAuth } from "../../../context/AuthContext";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface Career {
  id: number;
  name: string;
  description?: string;
  category?: string;
  skills_required?: string;
  colleges?: College[];
}

interface College {
  id: number;
  name: string;
  description?: string;
  location?: string;
  type?: string;
}

export default function AssessmentResults() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    async function load() {
      if (!user) return;

      try {
        const res = await fetchFinalResults(user.id);
        const data = res.data || res; // Handle both axios response and direct data

        if (!data || !data.results || !data.results.length) {
          // If no results, show empty state instead of redirecting
          setScores({});
          setCareers([]);
          return;
        }

        const mapped = data.results.reduce((acc: Record<string, number>, row: any) => {
          acc[row.category] = row.total;
          return acc;
        }, {});
        setScores(mapped);

        const careerRes = await getRecommendedCareers(user.id);
        // Handle both array response and object with data property
        let careersData = [];
        if (Array.isArray(careerRes.data)) {
          careersData = careerRes.data;
        } else if (Array.isArray(careerRes)) {
          careersData = careerRes;
        } else if (careerRes.data && Array.isArray(careerRes.data)) {
          careersData = careerRes.data;
        }
        
        // Fetch colleges for each career (top 6)
        const careersWithColleges = await Promise.all(
          careersData.slice(0, 6).map(async (career: Career) => {
            try {
              const collegesRes = await getCollegesForCareer(career.id);
              // Handle both array response and object with data property
              let collegesData = [];
              if (Array.isArray(collegesRes.data)) {
                collegesData = collegesRes.data;
              } else if (Array.isArray(collegesRes)) {
                collegesData = collegesRes;
              } else if (collegesRes.data && Array.isArray(collegesRes.data)) {
                collegesData = collegesRes.data;
              }
              return { ...career, colleges: collegesData.slice(0, 5) || [] };
            } catch (err) {
              console.error(`Error fetching colleges for career ${career.id}:`, err);
              return { ...career, colleges: [] };
            }
          })
        );
        
        setCareers(careersWithColleges);
      } catch (err) {
        console.error("Error loading assessment results:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate, user]);

  // Prepare radar chart data for Big Five Traits
  const radarData = useMemo(() => {
    // Map to Big Five traits if available, otherwise use existing categories
    const bigFiveMap: Record<string, string> = {
      'Conscientiousness': 'Conscientiousness',
      'Openness': 'Openness',
      'Neuroticism': 'Neuroticism',
      'Agreeableness': 'Agreeableness',
      'Extraversion': 'Extraversion'
    };

    const defaultData = [
      { subject: 'Conscientiousness', score: 85, fullMark: 100 },
      { subject: 'Openness', score: 70, fullMark: 100 },
      { subject: 'Neuroticism', score: 30, fullMark: 100 },
      { subject: 'Agreeableness', score: 75, fullMark: 100 },
      { subject: 'Extraversion', score: 65, fullMark: 100 }
    ];

    // If we have actual scores, use them; otherwise use defaults
    if (Object.keys(scores).length > 0) {
      return Object.entries(scores).slice(0, 5).map(([category, score]) => ({
        subject: bigFiveMap[category] || category,
        score: Math.min(100, Math.max(0, score)),
        fullMark: 100
      }));
    }

    return defaultData;
  }, [scores]);

  // Prepare bar chart data for RIASEC
  const barData = useMemo(() => {
    const riasecCategories = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
    
    return riasecCategories.map(category => {
      const score = scores[category] || Math.floor(Math.random() * 40) + 40;
      return {
        name: category,
        value: Math.min(100, Math.max(0, score))
      };
    });
  }, [scores]);

  const barColors = ['#3b82f6', '#1d4ed8', '#60a5fa', '#2563eb', '#93c5fd', '#1e40af'];

  // Aptitude scores matching reference
  const aptitudeScores = [
    { name: 'Logical Reasoning', score: 88, icon: 'fa-brain', color: 'blue' },
    { name: 'Numerical Ability', score: 92, icon: 'fa-calculator', color: 'purple' },
    { name: 'Verbal Fluency', score: 75, icon: 'fa-comments', color: 'teal' }
  ];

  const getMatchPercentage = (index: number) => {
    const percentages = [98, 95, 92, 89, 87, 85, 83, 81, 80, 78];
    return percentages[index] || 75;
  };

  const getCareerDetails = (career: Career, index: number) => {
    const details: Record<string, { icon: string; desc: string }> = {
      'Software Architect': { icon: 'fa-code', desc: 'Tech • High Growth • Remote Friendly' },
      'Data Scientist': { icon: 'fa-database', desc: 'Analytics • High Salary • Research' },
      'Systems Analyst': { icon: 'fa-desktop', desc: 'IT • Problem Solving • Corporate' },
      'Product Manager': { icon: 'fa-rocket', desc: 'Leadership • Creative • Strategy' },
      'Cybersecurity Analyst': { icon: 'fa-shield-alt', desc: 'Security • Technical • Detail-Oriented' },
      'Financial Analyst': { icon: 'fa-briefcase', desc: 'Finance • Math • Corporate' }
    };

    return details[career.name] || {
      icon: getCareerIcon(career.category || ''),
      desc: career.skills_required?.split(',')[0] || career.category || 'Professional Career'
    };
  };

  const getCareerIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Technology': 'fa-code',
      'Business': 'fa-briefcase',
      'Design': 'fa-palette',
      'Marketing': 'fa-bullhorn',
      'Finance': 'fa-chart-line',
      'Engineering': 'fa-cogs',
      'Creative': 'fa-pen-fancy',
      'Healthcare': 'fa-heartbeat'
    };
    return icons[category || 'Technology'] || 'fa-star';
  };

  // Get top trait for the tag
  const topTrait = useMemo(() => {
    const entries = Object.entries(scores);
    if (!entries.length) return 'High Conscientiousness';
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return `High ${sorted[0][0]}`;
  }, [scores]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <i className="fas fa-bullseye text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-slate-900">Career Clarity</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate("/student/dashboard")} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
                Dashboard
              </button>
              <button className="text-sm font-medium text-blue-600">Assessments</button>
              <button className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
                Career Library
              </button>
              <button className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
                Coaching
              </button>
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">{user?.name || 'Student'}</div>
                <div className="text-xs text-slate-500">Premium Member</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.[0] || 'S'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Assessment Results</h1>
            <p className="text-slate-600">
              Completed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ID: #{user?.id || '0000'}-{Date.now() % 10000}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
              <i className="fas fa-share-alt"></i>
              Share
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 shadow-md">
              <i className="fas fa-download"></i>
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personality Profile */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Personality Profile</h2>
                  <p className="text-sm text-slate-600">Big Five Traits Analysis</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  {topTrait}
                </span>
              </div>

              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  {/* @ts-ignore */}
                  <RadarChart data={radarData}>
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
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickCount={6}
                    />
                    {/* @ts-ignore */}
                    <Radar
                      name="Score"
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

            {/* Aptitude Scores */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Aptitude Scores</h2>
                <p className="text-sm text-slate-600">Cognitive & Functional Abilities</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {aptitudeScores.map((apt, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      apt.color === 'blue' ? 'bg-blue-50' : apt.color === 'purple' ? 'bg-purple-50' : 'bg-teal-50'
                    }`}>
                      <i className={`fas ${apt.icon} ${
                        apt.color === 'blue' ? 'text-blue-600' : apt.color === 'purple' ? 'text-purple-600' : 'text-teal-600'
                      } text-2xl`}></i>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">{apt.score}%</div>
                    <p className="text-sm font-medium text-slate-700">{apt.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Profile */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Interest Profile</h2>
                <p className="text-sm text-slate-600">Holland Code (RIASEC) Breakdown</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                {/* @ts-ignore */}
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  {/* @ts-ignore */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  {/* @ts-ignore */}
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  {/* @ts-ignore */}
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickCount={6}
                  />
                  {/* @ts-ignore */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  {/* @ts-ignore */}
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Top 6 Career Matches */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Top 6 Career Matches</h2>
                  <p className="text-xs text-slate-600">Based on your combined assessment data</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {careers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <i className="fas fa-briefcase text-4xl mb-3 text-slate-300"></i>
                    <p className="text-sm">No career recommendations available yet.</p>
                    <p className="text-xs mt-1">Complete your assessment to see recommendations.</p>
                  </div>
                ) : (
                  careers.slice(0, 6).map((career, idx) => {
                  const matchPercent = getMatchPercentage(idx);
                  const details = getCareerDetails(career, idx);
                  return (
                    <div
                      key={career.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition"
                    >
                      <button
                        onClick={() => navigate(`/student/career/${career.id}`)}
                        className="w-full flex items-center gap-3 mb-3 group text-left"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
                          <i className={`fas ${details.icon} text-slate-600 group-hover:text-blue-600`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition truncate">
                            {career.name}
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {details.desc}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-green-600 mb-1">{matchPercent}% Match</div>
                          <i className="fas fa-arrow-right text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition text-xs"></i>
                        </div>
                      </button>
                      
                      {/* Top 5 Colleges for this Career */}
                      {career.colleges && career.colleges.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                            <i className="fas fa-graduation-cap text-blue-600"></i>
                            Top Colleges:
                          </p>
                          <div className="space-y-1">
                            {career.colleges.map((college: College) => (
                              <div key={college.id} className="text-xs text-slate-600 flex items-center gap-2 py-1">
                                <i className="fas fa-university text-blue-500 text-[10px]"></i>
                                <span className="truncate">{college.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
                )}
              </div>
            </div>

            {/* Premium Upgrade CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Want deeper insights?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Unlock the full 40-page report with detailed development plans and learning resources.
              </p>
              <button className="w-full px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-lg transition shadow-lg">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
