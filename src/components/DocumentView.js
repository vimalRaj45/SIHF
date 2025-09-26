import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function DocumentView() {
  const { docId } = useParams();
  const [fileURL, setFileURL] = useState(null);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await API.get(`/document/${docId}`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        setFileURL(url);

        const disposition = res.headers['content-disposition'];
        if (disposition) {
          const match = disposition.match(/filename="?(.+)"?/);
          if (match && match[1]) setFilename(match[1]);
        }
      } catch (err) {
        alert("Failed to load document");
      }
    };
    fetchDocument();
  }, [docId]);

  if (!fileURL) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h5>{filename}</h5>
      <iframe src={fileURL} style={{ width: '100%', height: '80vh' }} title={filename}></iframe>
    </div>
  );
}
