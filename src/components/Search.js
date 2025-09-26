import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async () => {
    try {
      const res = await API.post("/search", { query, user_id: user.user_id, role: user.role });
      setResults(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Search Documents</h3>
      <div className="mb-3">
        <input className="form-control" placeholder="Enter search query" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleSearch}>Search</button>

      <ul className="list-group">
        {results.map(doc => (
          <li key={doc.id} className="list-group-item list-group-item-action" onClick={() => navigate(`/document/${doc.id}`)}>
            <strong>{doc.filename}</strong><br />
            Summary: {doc.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
