import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";

export default function StudentVerifyOTP() {
  const location = useLocation() as { state: { phone: string } };
  const navigate = useNavigate();
  const { login } = useAuth();

  const phone = location.state?.phone ?? localStorage.getItem("pendingPhone") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Auto-fill OTP from localStorage if available (for debugging)
  useEffect(() => {
    const storedOtp = localStorage.getItem("pendingOtp");
    if (storedOtp) {
      setOtp(storedOtp);
    }
  }, []);

  if (!phone) return <p>⚠️ Invalid session — go back and login.</p>;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      alert("Please enter a valid OTP (4-6 digits)");
      return;
    }

    setLoading(true);
    try {
      // Trim and ensure OTP is string
      const trimmedOtp = String(otp).trim();
      console.log(`Verifying OTP for phone: ${phone}, OTP: ${trimmedOtp}`);
      
      const data = await verifyOtp(phone, trimmedOtp);

      // Store in global auth context
      login(
        {
          id: data.user.id,
          role: "student",
          name: data.user.full_name,
          phone: data.user.phone,
        },
        data.token
      );

      // Clear stored OTP
      localStorage.removeItem("pendingOtp");

      // Redirect logic
      if (!data.user.is_profile_complete) {
        navigate("/student/complete-profile");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Invalid OTP";
      alert(`❌ ${errorMsg}`);
      
      // Show stored OTP for debugging (remove in production)
      const storedOtp = localStorage.getItem("pendingOtp");
      if (storedOtp) {
        console.log(`Expected OTP was: ${storedOtp}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-card p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
            Verify OTP
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 mt-1">Check your phone</h2>
          <p className="text-slate-600 text-sm mt-1">OTP sent to {phone}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">One-time password</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 4-6 digit code"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-card transition-all active:scale-[0.99]"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Didn’t get it? Wait a few seconds and request again from login.
        </p>
      </div>
    </div>
  );
}
