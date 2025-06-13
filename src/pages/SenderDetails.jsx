import React, { useState, useEffect } from "react";
import axios from "axios";

const SenderDetails = ({ onSenderDetailsChange }) => {
  const [formData, setFormData] = useState({
    sender_name: "",
    designation: "",
    service_no: "",
    section: "",
    group_number: "",
    contact_number: "",
  });

  useEffect(() => {
    const fetchSenderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
        // Pass data back to parent
        if (onSenderDetailsChange) {
          onSenderDetailsChange(response.data);
        }
      } catch (error) {
        console.error("Error fetching sender details:", error);
      }
    };
    fetchSenderDetails();
  }, [onSenderDetailsChange]);

  return (
    <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Sender Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700">Sender Name</label>
          <input
            type="text"
            id="sender_name"
            value={formData.sender_name || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
          <input
            type="text"
            id="designation"
            value={formData.designation || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="service_no" className="block text-sm font-medium text-gray-700">Service No</label>
          <input
            type="text"
            id="service_no"
            value={formData.service_no || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
          <input
            type="text"
            id="section"
            value={formData.section || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="group_number" className="block text-sm font-medium text-gray-700">Group Number</label>
          <input
            type="text"
            id="group_number"
            value={formData.group_number || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            value={formData.contact_number || ""}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default SenderDetails;