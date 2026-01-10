import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../../api/adminApi";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: number;
  created_at: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, is_read: 1 } : notif)
      );
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: 1 })));
    } catch (err: any) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return "fa-check-circle";
      case "warning": return "fa-exclamation-triangle";
      case "error": return "fa-times-circle";
      default: return "fa-info-circle";
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600 bg-green-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "error": return "text-red-600 bg-red-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mb-4 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">Notifications</h1>
              <p className="text-blue-200 text-lg">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i className="fas fa-bell-slash text-6xl text-slate-300 mb-4"></i>
            <p className="text-xl font-semibold text-slate-700 mb-2">No notifications</p>
            <p className="text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition ${
                  notification.is_read
                    ? "border-slate-200"
                    : "border-blue-300 bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${getColor(notification.type)} rounded-xl flex items-center justify-center shrink-0`}>
                    <i className={`fas ${getIcon(notification.type)} text-xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900">{notification.title}</h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-slate-700 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold ml-auto"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

