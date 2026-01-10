import { useState } from "react";
import API from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/admin/login", { username, password });
      login(
        { id: data.admin.id, role: "admin", name: data.admin.name },
        data.token
      );
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-card p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
            Admin Login
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Secure sign-in
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Access the dashboard to manage students, tests, and bookings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-card transition-all active:scale-[0.99]"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Contact support if you have trouble accessing your account.
        </p>
      </div>
    </div>
  );
}
