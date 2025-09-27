import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "emailjs-com";
import API from "../api/api";
import Navbar from "./Navbar";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
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

  // Step 1 - Send OTP
  const handleSendOtp = async () => {
    if (!email) return Swal.fire("Error", "Enter your email", "error");
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    setOtp(generatedOtp.toString());

    try {
      await emailjs.send(
        "service_gs473zw",
        "template_kmcrxnz",
        {
          from_name: "KMRCL",
          to_name: "User",
          otp_code: generatedOtp,
          email: email,
        },
        "W_iMgtG4kUORkD7in"
      );
      Swal.fire("Success", "OTP sent to your email!", "success");
      setStep(2);
    } catch (err) {
      Swal.fire("Error", "Failed to send OTP", "error");
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = () => {
    if (otp === enteredOtp) {
      Swal.fire("Success", "OTP verified successfully!", "success");
      setStep(3);
    } else {
      Swal.fire("Error", "Invalid OTP. Try again.", "error");
    }
  };

  // Step 3 - Login
  const handleLogin = async () => {
    if (!password) return Swal.fire("Error", "Enter your password", "error");

    try {
      const res = await API.post("/login", { username: email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      Swal.fire("Success", "Login successful", "success").then(() => {
        navigate("/upload");
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Login failed", "error");
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

        {/* White login card */}
        <div
          className="card shadow-lg p-4 bg-white"
          style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", zIndex: 2 }}
          data-aos="zoom-in"
        >
          <h4 className="text-center text-primary mb-4">
            <i className="bi bi-shield-lock-fill me-2"></i> KMRCL Login
          </h4>

          {/* Step 1 - Email */}
          {step === 1 && (
            <>
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
              <button className="btn btn-primary w-100" onClick={handleSendOtp}>
                Send OTP
              </button>
              <div className="mt-3 text-center">
                <span>Don’t have an account? </span>
                <Link to="/register">Register</Link>
              </div>
            </>
          )}

          {/* Step 2 - OTP */}
          {step === 2 && (
            <>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-123"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button className="btn btn-success w-100" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3 - Password */}
          {step === 3 && (
            <>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  readOnly
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
              <button className="btn btn-primary w-100" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
