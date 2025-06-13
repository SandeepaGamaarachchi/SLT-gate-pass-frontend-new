import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";

const UpdateRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [executiveOfficer, setExecutiveOfficer] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setItems(response.data.items.map(item => ({
        itemName: item.itemName || "",
        serialNo: item.serialNo || "",
        category: item.category || "",
        description: item.description || "",
        returnable: item.returnable || "no",
        quantity: item.quantity || 1,
      })));
      setExecutiveOfficer(response.data.executiveOfficer || "");
    } catch (error) {
      console.error("Error fetching request data:", error);
      setError("Failed to fetch request data.");
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setItems(newItems);
  };

  const handleExecutiveOfficerChange = (e) => {
    setExecutiveOfficer(e.target.value);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        serialNo: "",
        category: "",
        description: "",
        returnable: "no",
        quantity: 1,
      }
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add items
    items.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null) {
          formData.append(`items[${index}][${key}]`, item[key]);
        }
      });
    });

    // Add executive officer
    formData.append("executiveOfficer", executiveOfficer);

    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating request:", error);
      setError("Failed to update request. Please try again.");
    }
  };

  if (!items.length) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen py-8">
      {showPopup && <Popup setShowPopup={setShowPopup} />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="max-w-4xl mx-auto p-6 border-2 border-blue-400 rounded-md bg-white">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Update Request</h2>
        
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          {/* Render items */}
          {items.map((item, index) => (
            <div key={index} className="mb-6 border-2 border-blue-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Item {index + 1} Details</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    className="p-2 w-full border-2 border-blue-800 rounded-md"
                    required
                  />
                </div>

                {/* Serial No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serial No</label>
                  <input
                    type="text"
                    name="serialNo"
                    value={item.serialNo}
                    onChange={(e) => handleItemChange(index, e)}
                    className="p-2 w-full border-2 border-blue-800 rounded-md"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={item.category}
                    onChange={(e) => handleItemChange(index, e)}
                    className="p-2 w-full border-2 border-blue-800 rounded-md"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity || 1}
                    onChange={(e) => handleItemChange(index, e)}
                    className="p-2 w-full border-2 border-blue-800 rounded-md"
                    min="1"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="p-2 w-full border-2 border-blue-800 rounded-md"
                    rows="3"
                  />
                </div>

                {/* Returnable */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Returnable</label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="returnable"
                        value="yes"
                        checked={item.returnable === "yes"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="returnable"
                        value="no"
                        checked={item.returnable === "no"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}


          {/* Executive Officer */}
          <div className="border-2 border-blue-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Executive Officer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Executive Officer</label>
                <select
                  name="executiveOfficer"
                  value={executiveOfficer}
                  onChange={handleExecutiveOfficerChange}
                  className="p-2 w-full border-2 border-blue-800 rounded-md"
                >
                  <option value="">Select Executive Officer</option>
                  <option value="Mr. Gunawardana">Mr. Gunawardana</option>
                  <option value="Mr. Perera">Mr. Perera</option>
                  <option value="Ms. Silva">Ms. Silva</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/my-request")}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequest;