import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailValidator from "email-validator"; // Import the email-validator
import "./Login.scss";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [error, setError] = useState(""); // Error state

  // Function to validate if the input is a valid email
  const isValidEmail = (str) => {
    return emailValidator.validate(str); // Returns true if valid email
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email is valid
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      
      const loginData = {
        email,
        password,
      };

      const response = await axios.post("http://localhost:8080/auth/login", loginData);

      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_name", response.data.user_name)
      console.log(`user  is ${response.data.user_id}`)
      console.log(`username is ${response.data.user_name}`)

      
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
          type="email" // Only email type now
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
