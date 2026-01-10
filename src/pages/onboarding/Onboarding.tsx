import { useState } from "react";
import { useNavigate } from "react-router-dom";

const onboardingData = [
  {
    id: 1,
    icon: "fa-compass",
    title: "Discover Your Career Path",
    description: "Take our comprehensive assessment to uncover careers that match your interests, personality, and aptitude.",
  },
  {
    id: 2,
    icon: "fa-user-tie",
    title: "Expert Guidance",
    description: "Connect with experienced career counsellors who can help you make informed decisions about your future.",
  },
  {
    id: 3,
    icon: "fa-graduation-cap",
    title: "Top Colleges Worldwide",
    description: "Explore the best colleges and universities that align with your chosen career path.",
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleSkip = () => {
    setCurrentScreen(3);
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  // Role Selection Screen (4th screen)
  if (currentScreen === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/40">
              <i className="fas fa-rocket text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Join Us</h1>
            <p className="text-slate-500">Select how you'd like to continue</p>
          </div>

          {/* Student Button */}
          <button
            onClick={() => navigate("/student/login")}
            className="w-full p-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl mb-4 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-user-graduate text-xl"></i>
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">I'm a Student</p>
                <p className="text-sm text-blue-100">Take assessment & explore careers</p>
              </div>
              <i className="fas fa-arrow-right ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
            </div>
          </button>

          {/* Institute Button */}
          <button
            onClick={() => navigate("/institute/login")}
            className="w-full p-5 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl mb-4 transition-all hover:border-primary-300 hover:bg-primary-50 group"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <i className="fas fa-building text-primary-600 text-xl"></i>
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">I'm an Institute</p>
                <p className="text-sm text-slate-500">Manage students & track progress</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"></i>
            </div>
          </button>

          {/* Admin Link */}
          {/* <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => navigate("/admin/login")}
              className="text-sm text-slate-400 hover:text-primary-600 transition-colors"
            >
              <i className="fas fa-shield-alt mr-2"></i>
              Admin Login
            </button>
          </div> */}

          {/* Back button */}
          <button
            onClick={handleBack}
            className="w-full mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Back to introduction
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Screens (1-3)
  const screen = onboardingData[currentScreen];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 flex flex-col p-4 sm:p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="fas fa-compass text-white"></i>
          </div>
          <span className="text-white font-semibold hidden sm:block">Careerclarity</span>
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center text-white max-w-lg mx-auto py-12">
        {/* Icon */}
        <div className="w-32 h-32 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-10 animate-bounce-slow">
          <i className={`fas ${screen.icon} text-5xl text-white`}></i>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-blue-200">Step {currentScreen + 1} of 3</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          {screen.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-blue-100 leading-relaxed max-w-md">
          {screen.description}
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="pb-8">
        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScreen === index 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          {currentScreen > 0 && (
            <button
              onClick={handleBack}
              className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            {currentScreen === 2 ? (
              <>
                Get Started
                <i className="fas fa-rocket"></i>
              </>
            ) : (
              <>
                Next
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
