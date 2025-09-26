import React, { useState } from "react";
import API from "../api/api";
import Tesseract from "tesseract.js";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setExtractedText("");
    if (!f) return;

    setLoading(true);

    try {
      if (f.type.startsWith("image/")) {
        // Frontend OCR for images
        const { data: { text } } = await Tesseract.recognize(f, "eng", {
          logger: (m) => console.log(m),
        });
        setExtractedText(text);
      } else {
        // For PDFs/DOCs, backend will extract text
        setExtractedText("Text will be extracted after upload by backend...");
      }
    } catch (err) {
      alert("OCR failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.user_id);

    // Only send extracted text for frontend OCR (images)
    if (file.type.startsWith("image/")) {
      formData.append("extracted_text", extractedText);
    }

    setLoading(true);
    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded & processed successfully");

      // If backend extracted text (PDF/DOCX), display it
      if (!file.type.startsWith("image/") && res.data.extracted_text) {
        setExtractedText(res.data.extracted_text);
      }

      setFile(null);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Upload Document & Extract Text</h3>
      <input
        type="file"
        className="form-control mb-3"
        accept="image/*,application/pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      {loading && <p>Processing... Please wait</p>}
      {extractedText && (
        <div className="mb-3">
          <h5>Extracted Text:</h5>
          <textarea
            className="form-control"
            rows={8}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
          />
        </div>
      )}
      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}
