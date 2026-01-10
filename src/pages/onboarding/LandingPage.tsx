import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <i className="fas fa-bullseye text-2xl text-white"></i>
            </div>
            <span className="text-white font-bold text-xl">Career Clarity</span>
          </div>
          <button
            onClick={() => navigate("/student/login")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur transition"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-4 flex items-center gap-2">
              <i className="fas fa-rocket"></i> AI-Powered Career Guidance
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            <p className="text-xl text-blue-100">
              Take our comprehensive personality assessment and get personalized career recommendations tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/student/login")}
                className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free
                <span>→</span>
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2">
                Watch Demo
                <span>▶️</span>
              </button>
            </div>
            <div className="flex items-center gap-8 pt-6 text-sm">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-blue-200">Students Guided</p>
              </div>
              <div>
                <p className="text-3xl font-bold">95%</p>
                <p className="text-blue-200">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-blue-200">Career Paths</p>
              </div>
            </div>
          </div>

          {/* Right Content - Mock Dashboard */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur transform rotate-6"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 space-y-4 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"></div>
                <div>
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded mt-2"></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <p className="text-sm opacity-75 mb-2">Assessment Progress</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">75%</div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-white rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                    <div className="h-3 w-16 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to discover your ideal career path
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "fa-clipboard-list",
                title: "Take Assessment",
                desc: "Complete our comprehensive personality and aptitude test"
              },
              {
                step: "02",
                icon: "fa-bullseye",
                title: "Get Matches",
                desc: "Receive personalized career recommendations based on your profile"
              },
              {
                step: "03",
                icon: "fa-graduation-cap",
                title: "Explore Paths",
                desc: "Discover colleges, skills needed, and connect with counsellors"
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition">
                  <div className="text-6xl mb-4 text-blue-600">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <div className="text-sm font-bold text-blue-600 mb-2">STEP {feature.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Unlock Your Potential?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have discovered their perfect career path
          </p>
          <button
            onClick={() => navigate("/student/login")}
            className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2"
          >
            Start Your Journey
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-400">© 2024 Career Clarity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

