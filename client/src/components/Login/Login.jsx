import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailValidator from "email-validator";
import "./Login.scss"; // Assuming you still want custom styles

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [error, setError] = useState(""); // Error state

  // Validate email using email-validator
  const isValidEmail = (str) => emailValidator.validate(str);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email is valid
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const loginData = { email, password };
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        loginData
      );

      // Store data in localStorage
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_name", response.data.user_name);

      console.log(`User is ${response.data.user_id}`);
      console.log(`Username is ${response.data.user_name}`);
      console.log(setIsAuthenticated); // Check if it is a function

      // Update authentication state and navigate to homepage
      setIsAuthenticated(true);
      navigate("/", { replace: true }); // Ensure navigation
      console.log("Navigating to HomePage...");

      console.log(localStorage.getItem("token"));
    } catch (err) {
      console.error(err);

      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label  className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(""); // Clear error on user input
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label  className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(""); // Clear error on user input
            }}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <div className="mt-3">
        <p>
          Don't have an account?{" "}
          <button
            className="btn login-link"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
