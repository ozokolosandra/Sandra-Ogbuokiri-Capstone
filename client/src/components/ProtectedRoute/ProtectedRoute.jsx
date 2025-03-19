import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect them to the /login page, or any route you want.
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
