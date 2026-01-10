import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/studentApi";
import { useAuth } from "../../context/AuthContext";

interface Booking {
  booking_id: number;
  status: string;
  payment_status: string;
  slot_time: string;
  counselor_name: string;
}

const statusChip = (label: string, tone: "blue" | "amber" | "green" = "blue") => {
  const tones =
    tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-primary-50 text-primary-700 border-primary-100";
  return `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${tones}`;
};

const CounsellorProfile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyBookings(user.id)
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-600 font-semibold">
            Your Sessions
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Counselor bookings & status
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track your upcoming calls and payment status.
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-5 animate-pulse h-40" />
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-5 text-sm text-slate-600">
            No bookings yet. Pick a slot to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white border border-slate-100 rounded-2xl shadow-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-sm text-slate-500">Counselor</p>
                  <p className="text-lg font-semibold text-slate-900">{b.counselor_name}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {new Date(b.slot_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={statusChip(b.status === "booked" ? "Booked" : b.status, "blue")}>
                    {b.status}
                  </span>
                  <span
                    className={statusChip(
                      b.payment_status,
                      b.payment_status === "paid" ? "green" : "amber"
                    )}
                  >
                    Payment: {b.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorProfile;
