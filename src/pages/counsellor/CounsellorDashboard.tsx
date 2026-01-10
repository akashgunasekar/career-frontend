import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "availability">("upcoming");

  const upcomingBookings = [
    {
      id: 1,
      studentName: "Arun Kumar",
      time: "Today, 2:00 PM",
      duration: "45 mins",
      topic: "Career Guidance",
      status: "confirmed"
    },
    {
      id: 2,
      studentName: "Priya Sharma",
      time: "Today, 4:00 PM",
      duration: "30 mins",
      topic: "College Selection",
      status: "confirmed"
    },
    {
      id: 3,
      studentName: "Raj Patel",
      time: "Tomorrow, 10:00 AM",
      duration: "45 mins",
      topic: "Skills Assessment",
      status: "pending"
    }
  ];

  const completedSessions = [
    { id: 1, studentName: "Meera Singh", date: "Dec 10, 2024", rating: 5, feedback: "Very helpful!" },
    { id: 2, studentName: "Karan Verma", date: "Dec 9, 2024", rating: 5, feedback: "Great session" },
    { id: 3, studentName: "Sita Rao", date: "Dec 8, 2024", rating: 4, feedback: "Good advice" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fas fa-user-tie"></i>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Counsellor Dashboard</h1>
                <p className="text-xs text-slate-500">Dr. Sarah Williams</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/login")}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">45</p>
              <p className="text-xs text-slate-600">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">8</p>
              <p className="text-xs text-slate-600">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">4.9</p>
              <p className="text-xs text-slate-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-xs text-slate-600">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            {(["upcoming", "completed", "availability"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition capitalize ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Sessions</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition">
                + Block Time
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {booking.studentName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{booking.studentName}</h3>
                        <p className="text-sm text-slate-600 mb-2">{booking.topic}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            🕐 {booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {booking.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Completed Sessions</h2>

            <div className="grid grid-cols-1 gap-4">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {session.studentName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{session.studentName}</h3>
                        <p className="text-sm text-slate-500 mb-2">{session.date}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <i key={idx} className={`fas fa-star ${idx < session.rating ? "text-yellow-500" : "text-slate-300"}`}></i>
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 italic">"{session.feedback}"</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Manage Availability</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition">
                + Add Slot
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Weekly Schedule</h3>
              <div className="space-y-3">
                {[
                  { day: "Monday", slots: ["9:00 AM - 11:00 AM", "2:00 PM - 5:00 PM"] },
                  { day: "Tuesday", slots: ["10:00 AM - 12:00 PM", "3:00 PM - 6:00 PM"] },
                  { day: "Wednesday", slots: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"] },
                  { day: "Thursday", slots: ["10:00 AM - 1:00 PM", "3:00 PM - 5:00 PM"] },
                  { day: "Friday", slots: ["9:00 AM - 12:00 PM"] }
                ].map((schedule, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-28 font-semibold text-slate-900">{schedule.day}</div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {schedule.slots.map((slot, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 text-sm">✏️</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Session Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Default Session Duration</p>
                    <p className="text-sm text-slate-500">Standard length for new bookings</p>
                  </div>
                  <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>30 minutes</option>
                    <option selected>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Buffer Time</p>
                    <p className="text-sm text-slate-500">Time between sessions</p>
                  </div>
                  <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>5 minutes</option>
                    <option selected>15 minutes</option>
                    <option>30 minutes</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Auto-Accept Bookings</p>
                    <p className="text-sm text-slate-500">Automatically confirm new requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

