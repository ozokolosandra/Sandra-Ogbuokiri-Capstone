import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setIsAuthenticated(false); // Update authentication state
    navigate("/login"); // Redirect to login page
  }, [setIsAuthenticated, navigate]);

  return <p>Logging out...</p>;
}

export default LogoutPage;