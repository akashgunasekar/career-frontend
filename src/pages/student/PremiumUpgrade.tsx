import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PremiumUpgrade() {
  const navigate = useNavigate();

  const features = [
    { icon: "fa-file-alt", title: "40-Page Detailed Report", desc: "Comprehensive analysis of your assessment results" },
    { icon: "fa-chart-line", title: "Advanced Analytics", desc: "Deep insights into your personality and career matches" },
    { icon: "fa-graduation-cap", title: "Personalized Learning Path", desc: "Customized courses and resources for your career" },
    { icon: "fa-user-tie", title: "Priority Counselor Access", desc: "Get priority booking with top-rated counselors" },
    { icon: "fa-briefcase", title: "Career Roadmap", desc: "Step-by-step guide to achieve your career goals" },
    { icon: "fa-star", title: "Exclusive Content", desc: "Access to premium articles, videos, and webinars" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2 justify-center"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Upgrade to Premium</h1>
          <p className="text-blue-100 text-lg sm:text-xl">
            Unlock the full potential of your career journey
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Premium Features</h2>
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <i className={`fas ${feature.icon} text-blue-600 text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Get</h2>
              <ul className="space-y-3">
                {[
                  "Complete personality and aptitude analysis",
                  "Top 20 career matches with detailed insights",
                  "College recommendations for each career",
                  "Personalized skill development plan",
                  "Unlimited access to career resources",
                  "Priority customer support"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Premium Plan</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold">₹999</span>
                  <span className="text-xl text-blue-200">/year</span>
                </div>
                <p className="text-blue-100">One-time payment, lifetime access</p>
              </div>

              <button
                onClick={() => {
                  // TODO: Integrate payment gateway (Razorpay)
                  alert("Payment integration coming soon!");
                }}
                className="w-full bg-white hover:bg-blue-50 text-blue-700 font-bold py-4 rounded-xl transition shadow-lg mb-4"
              >
                Upgrade Now
              </button>

              <div className="text-center text-blue-100 text-sm">
                <i className="fas fa-shield-alt mr-2"></i>
                Secure payment powered by Razorpay
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                {[
                  { icon: "fa-credit-card", name: "Credit/Debit Card" },
                  { icon: "fa-mobile-alt", name: "UPI" },
                  { icon: "fa-wallet", name: "Digital Wallets" },
                  { icon: "fa-university", name: "Net Banking" }
                ].map((method, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition">
                    <i className={`fas ${method.icon} text-blue-600`}></i>
                    <span className="text-slate-700 font-medium">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <i className="fas fa-gift text-yellow-600 text-2xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">Special Offer</h3>
                  <p className="text-yellow-800 text-sm">
                    Get 20% off on your first premium subscription. Use code <strong>PREMIUM20</strong> at checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

