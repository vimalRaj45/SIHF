import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

export default function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Categorize based on subject/body
  const categorizeEmail = (email) => {
    const text = (email.subject + " " + email.body).toLowerCase();
    if (text.includes("invoice") || text.includes("payment") || text.includes("due")) {
      return "Important";
    } else if (text.includes("offer") || text.includes("discount") || text.includes("sale")) {
      return "Promotion";
    } else if (text.includes("alert") || text.includes("notification") || text.includes("update")) {
      return "Notification";
    }
    return "Other";
  };

  // Fetch emails with useCallback to satisfy ESLint
  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/last_emails");
      const data = await res.json();
      if (data.emails) {
        const categorized = data.emails.map((email) => ({
          ...email,
          category: categorizeEmail(email),
        }));
        setEmails(categorized);
      } else {
        setEmails([]);
      }
    } catch (err) {
      console.error("Error fetching emails:", err);
      Swal.fire("Error", "Failed to fetch emails", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Call fetchEmails on mount and auto-refresh every 1 min
  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 60000);
    return () => clearInterval(interval);
  }, [fetchEmails]);

  const filteredEmails = emails.filter((email) => {
    const matchesFilter = filter === "All" || email.category === filter;
    const matchesSearch =
      email.subject.toLowerCase().includes(search.toLowerCase()) ||
      email.body.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeClass = (category) => {
    switch (category) {
      case "Important":
        return "badge bg-danger";
      case "Promotion":
        return "badge bg-success";
      case "Notification":
        return "badge bg-info text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">Recent Emails</h3>

      {/* Filter & Search */}
      <div className="d-flex flex-column flex-md-row mb-3 gap-2">
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Important">Important</option>
          <option value="Promotion">Promotion</option>
          <option value="Notification">Notification</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Search emails..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="alert alert-info">No emails found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">From</th>
                <th scope="col">Subject</th>
                <th scope="col">Body</th>
                <th scope="col">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email, index) => (
                <tr key={index}>
                  <td>{email.from}</td>
                  <td>{email.subject}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div
                      style={{
                        maxHeight: expandedIndex === index ? "none" : "80px",
                        overflow: "hidden",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {email.body}
                    </div>
                  </td>
                  <td>
                    <span className={getBadgeClass(email.category)}>{email.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
