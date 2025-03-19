import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import HomePage from "./pages/HomePage/HomePage";
import ReportPage from "./pages/ReportPage/ReportPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  // Manage the user's authentication state.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Checking authentication: token =", token);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path="logout" element={<LogoutPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>

        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
