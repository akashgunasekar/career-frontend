// src/router/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  role: "admin" | "student" | "institute";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { user, token } = useAuth();

  // Not logged in at all
  if (!token || !user) {
    const loginPath =
      role === "admin"
        ? "/admin/login"
        : role === "student"
        ? "/student/login"
        : "/institute/login";

    return <Navigate to={loginPath} replace />;
  }

  // Logged in but wrong role
  if (user.role !== role) {
    const loginPath =
      role === "admin"
        ? "/admin/login"
        : role === "student"
        ? "/student/login"
        : "/institute/login";

    return <Navigate to={loginPath} replace />;
  }

  // All good
  return <Outlet />;
};

export default ProtectedRoute;
