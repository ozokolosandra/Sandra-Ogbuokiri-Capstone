import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailValidator from "email-validator";
import "./Login.scss";

function LoginPage({ setIsAuthenticated }) {
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
      const response = await axios.post("http://localhost:8080/auth/login", loginData);

      // Store data in localStorage
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_name", response.data.user_name);

      console.log(`User is ${response.data.user_id}`);
      console.log(`Username is ${response.data.user_name}`);

      // Update authentication state and navigate to homepage
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          required
        />
        <button type="submit">Login</button>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="register-link" onClick={() => navigate("/register")}>
            Don't have an account? Register here
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
