import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };
 useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-left">
        <h1>Welcome to Our App 🚀</h1>
        <p>Track your shops, manage your products, and grow your business effortlessly.</p>
      </div>

    
      <div className="register-right">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="text-muted">Sign up to get started</p>

          {error && <div className="custom-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="form-control"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
              required
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="form-control"
              required
            />

            <button type="submit" className="btn">
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-light">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}
