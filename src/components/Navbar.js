import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Navbar() {
  const location = useLocation();
  const [newDocsCount, setNewDocsCount] = useState(0);
  const [lastDocId, setLastDocId] = useState(null);

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isActive = (path) => (location.pathname === path ? "active" : "");

  // Fetch recent docs
  const fetchNewDocs = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://127.0.0.1:5000/recent_docs");
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        const latestDocId = data.documents[0].id;
        if (lastDocId && latestDocId !== lastDocId) {
          const newDocs = data.documents.filter(doc => doc.id > lastDocId);
          setNewDocsCount(newDocs.length);
        }
        setLastDocId(latestDocId);
      }
    } catch (err) {
      console.error("Failed to fetch new documents:", err);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchNewDocs();
    const interval = setInterval(fetchNewDocs, 60000); // poll every 60s
    return () => clearInterval(interval);
  }, [user, lastDocId]);

  // Close collapse menu on link click
  const handleLinkClick = () => {
    const bsCollapse = document.getElementById("navbarNav");
    if (bsCollapse && bsCollapse.classList.contains("show")) {
      const collapse = new window.bootstrap.Collapse(bsCollapse, { toggle: false });
      collapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow" data-aos="fade-down">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ fontSize: "1.4rem" }}>
          <i className="bi bi-shield-lock-fill text-warning me-2" style={{ fontSize: "1.6rem" }}></i>
          <span style={{ letterSpacing: "1px" }}>KMRCL Docs</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/upload")}`} to="/upload" onClick={handleLinkClick}>
                    <i className="bi bi-upload me-1"></i>Upload
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/search")}`} to="/search" onClick={handleLinkClick}>
                    <i className="bi bi-search me-1"></i>Search
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/profile")}`} to="/profile" onClick={handleLinkClick}>
                    <i className="bi bi-person-circle me-1"></i>Profile
                  </Link>
                </li>

                <li className="nav-item position-relative">
                  <Link className={`nav-link ${isActive("/notifications")}`} to="/notifications" onClick={() => {handleLinkClick(); setNewDocsCount(0);}}>
                    <i className="bi bi-bell-fill me-1"></i>Notifications
                    {newDocsCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {newDocsCount}
                        <span className="visually-hidden">new documents</span>
                      </span>
                    )}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/emails")}`} to="/emails" onClick={handleLinkClick}>
                    <i className="bi bi-envelope-fill me-1"></i>Emails
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/home")}`} to="/home" onClick={handleLinkClick}>
                    <i className="bi bi-house-fill me-1"></i>Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={() => {
                      localStorage.removeItem("user");
                      handleLinkClick();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/login")}`} to="/login" onClick={handleLinkClick}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/register")}`} to="/register" onClick={handleLinkClick}>
                    <i className="bi bi-pencil-square me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <style jsx="true">{`
        .nav-link {
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #ffc107 !important;
        }
        .nav-link.active {
          font-weight: bold;
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
}
