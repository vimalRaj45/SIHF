import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      return alert("Enter a search query");
    }

    if (!user) {
      return alert("Please log in first");
    }

    setLoading(true);

    try {
      const res = await API.post("/search", {
        query,
        user_id: user.user_id,
        role: user.role,
      });

      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-primary text-center" data-aos="fade-down">
        <i className="bi bi-search me-2"></i>
        Search Documents
      </h3>

      <div className="input-group mb-4" data-aos="fade-up">
        <input
          type="text"
          className="form-control"
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          {loading ? <i className="bi bi-arrow-repeat spin me-1"></i> : <i className="bi bi-search me-1"></i>}
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="list-group mb-5" data-aos="fade-up">
          {results.map((doc) => (
            <button
              key={doc.id}
              className="list-group-item list-group-item-action mb-2 shadow-sm text-start"
              onClick={() => navigate(`/document/${doc.id}`)}
            >
              <strong><i className="bi bi-file-earmark-text me-1"></i>{doc.filename}</strong>
              <p className="mb-0">Summary: {doc.summary}</p>
              <p className="mb-0 text-muted">
                Classification: {doc.classification} | Similarity: {doc.similarity.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="text-center text-muted" data-aos="fade-up">No documents found.</p>
      )}
    </div>
  );
}
