import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // No user or role mismatch
  if (!user || !allowedRoles.includes(user.role)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Role present but no ID
  if (!user.id) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  if (user.status === 1) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Check for session expiry
  if (user.expiryTime && Date.now() > user.expiryTime) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
