import React, { useEffect, useState } from "react";
import API from "../api/api";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Profile() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });

    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/${user.user_id}`);
        setProfileData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <h3 className="text-danger mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            No user data found
          </h3>
          <p>Please log in again.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <h4>
            <i className="bi bi-arrow-repeat spin me-2"></i>
            Loading profile...
          </h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center text-danger">
          <h4>{error}</h4>
        </div>
      </div>
    );
  }

  // Filtered documents for search
  const filteredDocs = profileData.documents?.filter(
    (doc) =>
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.classification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-primary text-center" data-aos="fade-down">
        <i className="bi bi-person-circle me-2"></i>
        Profile Dashboard
      </h3>

      <div className="row">
        {/* Left Column: Profile Info */}
        <div className="col-lg-4 mb-4" data-aos="fade-right">
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="mb-3"><i className="bi bi-person-fill me-2"></i>User Info</h5>
            <p><i className="bi bi-hash me-1"></i><strong>ID:</strong> {profileData.user_id}</p>
            <p><i className="bi bi-envelope-fill me-1"></i><strong>Username:</strong> {profileData.username}</p>
            <p><i className="bi bi-person-badge-fill me-1"></i><strong>Role:</strong> {profileData.role}</p>
            <p><i className="bi bi-journal-bookmark-fill me-1"></i><strong>Total Docs:</strong> {profileData.total_docs}</p>
          </div>
        </div>

        {/* Right Column: Search Documents */}
        <div className="col-lg-8 mb-4" data-aos="fade-left">
          <h5 className="mb-3 text-center"><i className="bi bi-search me-2"></i>Search Documents</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by filename, summary, or classification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredDocs && filteredDocs.length > 0 ? (
            <div className="list-group">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="list-group-item shadow-sm mb-2">
                  <strong><i className="bi bi-file-earmark-text me-1"></i>{doc.filename}</strong>
                  <p className="mb-1"><i className="bi bi-card-text me-1"></i><strong>Summary:</strong> {doc.summary}</p>
                  <p className="mb-0"><i className="bi bi-tags-fill me-1"></i><strong>Classification:</strong> {doc.classification}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No documents match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
