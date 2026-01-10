import { useNavigate } from "react-router-dom";

export default function AssessmentStart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-card rounded-2xl p-6 sm:p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 text-xl">
            <i className="fas fa-bullseye"></i>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-600 font-semibold">
              Career Compass
            </p>
            <p className="text-sm text-slate-500">Personalized guidance in 20–30 min</p>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
          Ready to unlock your career potential?
        </h1>
        <p className="text-slate-600 mt-3">
          We’ll ask quick questions about your interests and strengths, then match you to the best paths.
        </p>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500"></span>
            <span>5 short sections (interests, aptitude, personality, values)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500"></span>
            <span>Pause-safe—pick up where you left off</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500"></span>
            <span>See your top matches instantly</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/student/assessment/test")}
          className="mt-8 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-card transition-all duration-150 active:scale-[0.99]"
        >
          Start Assessment
        </button>

        <p className="text-center text-xs text-slate-500 mt-3">
          Mobile-first experience optimized for quick taps and swipes.
        </p>
      </div>
    </div>
  );
}
