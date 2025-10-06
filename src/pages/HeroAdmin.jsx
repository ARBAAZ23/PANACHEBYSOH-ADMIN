import React, { useState } from "react";
import axios from "axios";

const HeroAdmin = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/")
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL + "/";

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      alert("Please provide both a title and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      await axios.post(`${backendUrl}api/hero`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Hero updated successfully!");
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Admin Panel: Update HomePage
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Title
            </label>
            <input
              type="text"
              placeholder="Enter hero title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image or Video
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroAdmin;
  