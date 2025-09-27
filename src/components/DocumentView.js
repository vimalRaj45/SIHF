import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";

export default function DocumentView() {
  const { docId } = useParams();
  const [fileURL, setFileURL] = useState(null);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await API.get(`/document/${docId}`, { responseType: "blob" });
        const url = URL.createObjectURL(res.data);
        setFileURL(url);

        const disposition = res.headers["content-disposition"];
        if (disposition) {
          const match = disposition.match(/filename="?(.+)"?/);
          if (match && match[1]) setFilename(match[1]);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load document", "error");
      }
    };
    fetchDocument();
  }, [docId]);

  if (!fileURL)
    return (
      <>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-file-earmark-text me-2"></i>
              {filename || "Document"}
            </h5>
            <a href={fileURL} download={filename} className="btn btn-sm btn-outline-primary">
              Download
            </a>
          </div>
          <div className="card-body p-0" style={{ height: "80vh" }}>
            <iframe
              src={fileURL}
              title={filename}
              style={{ width: "100%", height: "100%", border: "none" }}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
