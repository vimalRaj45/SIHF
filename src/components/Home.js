import React, { useState, useEffect } from "react";
import Upload from "./Upload"; // optional reuse of your upload component
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [summaryData, setSummaryData] = useState({
    docName: "",
    category: "General",
    summary: "",
  });

  let user = { role: "guest" };
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : { role: "guest" };
  } catch (err) {
    console.error("Invalid user JSON in localStorage", err);
    user = { role: "guest" };
  }

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const saveSummary = () => {
    alert("Summary saved!");
    closeModal();
  };

  return (
    <>
      {/* Banner Section */}
      <div
        className="text-white text-center py-5 position-relative"
        style={{
          backgroundImage: `url('https://i.ibb.co/rGs6tSBf/kmrcl.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "300px",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
        ></div>
        <div className="position-relative" data-aos="fade-down">
          <h1>
            <i className="bi bi-building me-2"></i>
            Welcome to KMRL Document Intelligence Hub
          </h1>
          <p>
            Streamline your docs with AI summaries. | ഡോക്യുമെന്റ് ബുദ്ധിമുട്ടുകൾ AI സഹായത്തോടെ പരിഹരിക്കുക.
          </p>
        </div>
      </div>

      {/* Note Section */}
      <div className="container my-4" data-aos="fade-up">
        <div className="alert alert-warning text-center">
          Kindly upload documents strictly as per guidelines. Electronic aids like mobiles are not allowed in processing.
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4" data-aos="fade-right">
            <div className="list-group shadow-sm">
              <a href="#vision" className="list-group-item list-group-item-action">
                <i className="bi bi-eye-fill me-2"></i>Vision & Mission
              </a>
              <a href="#compliance" className="list-group-item list-group-item-action">
                <i className="bi bi-shield-fill-check me-2"></i>Compliance Charter
              </a>
              <a href="#rti" className="list-group-item list-group-item-action">
                <i className="bi bi-file-text-fill me-2"></i>RTI
              </a>
              <a href="#templates" className="list-group-item list-group-item-action">
                <i className="bi bi-download me-2"></i>Download Templates
              </a>
            </div>
          </div>

          {/* Main Panel */}
          <div className="col-lg-9" data-aos="fade-left">
            <div className="card mb-4 p-3 shadow-sm">
              <strong>
                <i className="bi bi-telephone-fill me-2"></i>Helpline No.
              </strong>{" "}
              1800-XXX-XXXX – Use this to report doc processing issues or compliance queries.
            </div>

            {user.role === "admin" && (
              <div className="card mb-4 p-3 shadow-sm" data-aos="zoom-in">
                <h5>
                  <i className="bi bi-upload me-2"></i>Upload Document / Notification
                </h5>
                <Upload />
                <button
                  className="btn btn-primary mt-3"
                  type="button"
                  onClick={openModal}
                  data-bs-toggle="modal"
                  data-bs-target="#aiSummaryModal"
                >
                  <i className="bi bi-journal-text me-2"></i>Review AI Summary
                </button>
              </div>
            )}

            <div className="card mb-4 p-3 shadow-sm" data-aos="fade-up">
              <h5>
                <i className="bi bi-bell-fill me-2"></i>Document Notifications
              </h5>
              <ul className="list-group">
                <li className="list-group-item">CEN No.01/2025 – New Safety Bulletin</li>
                <li className="list-group-item">CEN No.06/2024 – Vendor Invoice Summary</li>
                <li className="list-group-item">CEN No.02/2025 – Engineering Report</li>
              </ul>
            </div>

            <div className="card mb-4 p-3 shadow-sm" data-aos="fade-up">
              <h5>
                <i className="bi bi-newspaper me-2"></i>Latest News
              </h5>
              <p>CEN 06/2024 Notice on Summary Viewing (from 08-09-2025).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="container mb-5">
        <div className="row text-center">
          {[
            { icon: "bi-chat-dots-fill", title: "Feedback", text: "Suggest inclusion in future versions." },
            { icon: "bi-file-earmark-text-fill", title: "Right to Information (RTI)", text: "Citizens’ right to information." },
            { icon: "bi-bell-fill", title: "Alerts & Summaries", text: "Weekly journal of document insights." },
          ].map((card, idx) => (
            <div className="col-md-4 mb-3" key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="card shadow-sm p-3">
                <h6>
                  <i className={`${card.icon} me-2`}></i>
                  {card.title}
                </h6>
                <p>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-4" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6>About Us</h6>
              <p>Brief intro about KMRL.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#alerts" className="text-white">
                    Alerts
                  </a>
                </li>
                <li>
                  <a href="#rti" className="text-white">
                    RTI
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Policies</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#accessibility" className="text-white">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-3">
            &copy; {new Date().getFullYear()} KMRL. All Rights Reserved. |{" "}
            <a href="#faq" className="text-white">
              FAQs
            </a>{" "}
            |{" "}
            <a href="#webpolicy" className="text-white">
              Web Policy
            </a>
          </div>
        </div>
      </footer>

      {/* AI Summary Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-journal-text me-2"></i>
                  AI Document Summary
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Document Name</label>
                  <input
                    className="form-control"
                    value={summaryData.docName}
                    onChange={(e) => setSummaryData({ ...summaryData, docName: e.target.value })}
                    style={{ outline: "none", boxShadow: "none", borderColor: "#ced4da" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={summaryData.category}
                    onChange={(e) => setSummaryData({ ...summaryData, category: e.target.value })}
                  >
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Legal</option>
                    <option>Operations</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Summary</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={summaryData.summary}
                    onChange={(e) => setSummaryData({ ...summaryData, summary: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveSummary}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
