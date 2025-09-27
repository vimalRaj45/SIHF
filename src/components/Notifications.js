import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../api/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
     try {
      const params = {};
      if (search) params.search = search;
      if (filterUser) params.user = filterUser;
      if (filterClass) params.classification = filterClass;
      if (filterDate) params.date = filterDate;

      // Use Axios with ngrok header
      const res = await API.get("/notifications", { params });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterUser, filterClass, filterDate]);

  useEffect(() => {
    fetchNotifications();
    AOS.init({ duration: 800 });
  }, [fetchNotifications]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchNotifications();
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-primary text-center" data-aos="fade-down">
        <i className="bi bi-bell-fill me-2"></i>Notifications
      </h3>

      {/* Filters */}
      <form className="row g-2 mb-4" onSubmit={handleFilter}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search filename or summary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Uploaded by"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classifications</option>
            <option value="Incident Report">Incident Report</option>
            <option value="Vendor Invoice">Vendor Invoice</option>
            <option value="Safety Bulletin">Safety Bulletin</option>
            <option value="HR Policy">HR Policy</option>
            <option value="Engineering Drawing">Engineering Drawing</option>
            <option value="Regulatory Directive">Regulatory Directive</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-funnel-fill me-1"></i>Filter
          </button>
        </div>
      </form>

      {/* Notifications List */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="alert alert-info">No notifications found.</div>
      ) : (
        <div className="row">
          {notifications.map((note) => (
            <div key={note.doc_id} className="col-12 mb-4" data-aos="fade-up">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    {note.filename}
                  </h5>
                  <p className="mb-1"><strong>Uploaded By:</strong> {note.uploaded_by}</p>
                  <p className="mb-1"><strong>Classification:</strong> {note.classification}</p>
                  <p className="mb-1"><strong>Summary:</strong> {note.summary}</p>
                  <p className="mb-3"><strong>Uploaded At:</strong> {new Date(note.created_at).toLocaleString()}</p>

                  <div className="ratio ratio-16x9 mb-3">
                    <iframe
                      src={"http://localhost:5000" + note.file_url}
                      title={note.filename}
                      style={{ border: "1px solid #ccc" }}
                    />
                  </div>
                  <a
                    href={"http://localhost:5000" + note.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>Open Document
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
