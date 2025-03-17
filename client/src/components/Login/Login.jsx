import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      // On successful login, save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to HomePage or wherever you want
      navigate("/");

    } catch (err) {
      // Set error message if login fails
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
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
        <div style={{ color: "red", marginTop: "10px" }}>
          <p>{error}</p>
          <button onClick={() => navigate("/register")}>
            Don't have an account? Register here
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
