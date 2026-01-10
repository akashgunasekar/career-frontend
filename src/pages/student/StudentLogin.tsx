import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/studentApi";

export default function StudentLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert("Enter phone");

    setLoading(true);
    try {
      const response = await sendOtp(phone);
      const receivedOtp = response.otp || "";
      
      if (!receivedOtp) {
        alert("OTP not received. Please try again.");
        setLoading(false);
        return;
      }
      
      // Show OTP in modal
      setOtp(receivedOtp);
      setShowOtpModal(true);
      
      localStorage.setItem("pendingPhone", phone); // optional safety
      localStorage.setItem("pendingOtp", receivedOtp); // Store OTP temporarily for debugging
      
      // Don't auto-navigate, let user click button
    } catch (err: any) {
      console.error("OTP send error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to send OTP";
      alert(`Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-card p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
            Student Login
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Sign in with your phone
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            We’ll send a one-time password to verify it’s you.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-card transition-all active:scale-[0.99]"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Mobile-first experience • Secure OTP • Fast verification
        </p>
      </div>

      {/* OTP Modal Popup */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-key text-blue-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">OTP Sent!</h2>
              <p className="text-slate-600 mb-6">
                Your OTP has been sent to <strong>{phone}</strong>
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border-2 border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Your OTP Code:</p>
                <div className="text-5xl font-bold text-blue-700 tracking-widest font-mono">
                  {otp}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <i className="fas fa-info-circle mr-1"></i>
                  This OTP is valid for 5 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    navigate("/student/verify-otp", { state: { phone } });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
                >
                  Continue to Verify
                </button>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                <i className="fas fa-terminal mr-1"></i>
                OTP also displayed in terminal/console
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
