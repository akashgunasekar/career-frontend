import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function InstituteVerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const phone = params.get("phone") || "";
  const name = params.get("name") || "";
  const navigate = useNavigate();
  const { login } = useAuth();

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post("/institute/verify-otp", { phone, otp });
      // backend returns institute object; create a simple token placeholder
      login(
        { id: data?.id || data?.institute?.id || Date.now(), role: "institute", name: data?.name || data?.institute?.name || name, phone },
        data.token || "institute-session"
      );
      navigate("/institute/dashboard");
    } catch {
      alert("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return <p className="p-6 text-center text-slate-600">Missing phone number. Please restart login.</p>;
  }

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

        <form onSubmit={verifyOTP} className="space-y-4">
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
