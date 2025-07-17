import React, { useState } from "react";
import ExcelDropzone from "./ExcelDropzone";
import axios from "axios";

function ExcelUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Replace with your actual token retrieval logic
    const token = localStorage.getItem("token"); 

    await axios.post("/api/excel/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ExcelDropzone onFileUpload={handleFileUpload} />
      <button type="submit" disabled={!selectedFile}>
        Upload
      </button>
    </form>
  );
}

export default ExcelUploader;
