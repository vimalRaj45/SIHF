import React, { useState, useEffect } from "react";
import API from "../api/api";
import Tesseract from "tesseract.js";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  // Handle file selection
  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setExtractedText("");
    if (!f) return;

    setLoading(true);

    try {
      if (f.type.startsWith("image/")) {
        const { data: { text } } = await Tesseract.recognize(f, "eng", {
          logger: (m) => console.log(m),
        });
        setExtractedText(text);
      } else {
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

    if (file.type.startsWith("image/")) {
      formData.append("extracted_text", extractedText);
    }

    setLoading(true);
    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded & processed successfully");

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
    <div className="d-flex justify-content-center mt-5" data-aos="fade-up">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "600px" }}>
        <h4 className="text-primary mb-4 text-center">
          <i className="bi bi-upload me-2"></i>
          Upload Document & Extract Text
        </h4>

        <input
          type="file"
          className="form-control mb-3"
          accept="image/*,application/pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {loading && (
          <div className="text-center mb-3">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Processing... Please wait</p>
          </div>
        )}

        {extractedText && (
          <div className="mb-3">
            <h5><i className="bi bi-file-earmark-text me-1"></i> Extracted Text:</h5>
            <textarea
              className="form-control"
              rows={8}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
            />
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={handleUpload}>
          <i className="bi bi-cloud-upload me-1"></i> Upload
        </button>
      </div>
    </div>
  );
}
