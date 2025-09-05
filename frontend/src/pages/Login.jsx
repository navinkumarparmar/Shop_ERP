import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const clearError = () => {
    if (error) setError("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Please login to continue</p>

        {error && <div className="custom-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={clearError}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={clearError}
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="btn mt-3">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-light">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
