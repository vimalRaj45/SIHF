import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Register() {
  const [email, setEmail] = useState(""); // username is email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const inputStyle = {
    outline: "none",
    boxShadow: "none",
    borderColor: "#ced4da",
  };

  const handleRegister = async () => {
    if (!email || !password) return Swal.fire("Error", "Fill all fields", "error");

    try {
      await API.post("/register", { username: email, password });
      Swal.fire("Success", "Registration successful", "success").then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Registration failed", "error");
    }
  };

  return (
    <>
      <Navbar />

      {/* Background with blur */}
      <div
        className="position-relative d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundImage:
            "url('https://media.istockphoto.com/id/2174551157/photo/cyber-security-data-protection-business-technology-privacy-concept.jpg?s=2048x2048&w=is&k=20&c=sCjAoM5vMvI7PXGFaTaOnRr1AppyOWmxPHkckruBq_A=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay with blur */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
          }}
        ></div>

        {/* White register card */}
        <div
          className="card shadow-lg p-4 bg-white"
          style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", zIndex: 2 }}
          data-aos="zoom-in"
        >
          <h4 className="text-center text-primary mb-4">
            <i className="bi bi-person-plus-fill me-2"></i> Register
          </h4>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-envelope-fill"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleRegister}>
            Register
          </button>

          <div className="mt-3 text-center">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
