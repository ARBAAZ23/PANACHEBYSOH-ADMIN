import React, { useState } from "react";
import axios from "axios";

const AboutAdmin = () => {
  const [file, setFile] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${backendUrl}api/about`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("About image updated successfully!");
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Admin Panel: Update About Image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
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
            Update About Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
    