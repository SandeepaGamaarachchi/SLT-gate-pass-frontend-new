import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminLocations = () => {
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(response.data.message);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl border-2 border-blue-900 relative">
        {/* Back Button - Moved to top right */}
        <button 
          onClick={() => navigate('/admin')}
          className="absolute top-4 right-4 flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="inline" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Add Users By CSV File</h1>

        <div className="space-y-6">
          <div className="mb-6">
            <label htmlFor="csv-upload" className="block text-lg text-gray-700 font-medium mb-2">
              Upload CSV File:
            </label>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleCsvFileChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLocations;