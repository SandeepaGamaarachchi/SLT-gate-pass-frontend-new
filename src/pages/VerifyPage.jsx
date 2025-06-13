import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [serviceNumber, setServiceNumber] = useState('');
  const [officerDetails, setOfficerDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/verify'); 
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.response ? error.response.data : error.message);
    }
  };

  const handleAssignClick = (request) => {
    setSelectedRequest(request);
    setServiceNumber(request.assignedOfficerServiceNo || '');
    setOfficerDetails(request.assignedOfficer ? {
      _id: request.assignedOfficer,
      sender_name: request.assignedOfficerName,
      service_no: request.assignedOfficerServiceNo
    } : null);
    setShowAssignForm(true);
  };

  const fetchOfficerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/service/${serviceNumber}`);
      setOfficerDetails(response.data);
    } catch (error) {
      console.error("Error fetching officer details:", error);
      setOfficerDetails(null);
      alert("Officer not found with the provided service number");
    }
  };

  const handleAssignSubmit = async () => {
    try {
      if (!officerDetails) {
        alert("Please fetch officer details first");
        return;
      }

      await axios.put(`http://localhost:5000/api/verify/${selectedRequest._id}/assign`, {
        assignedOfficer: officerDetails._id,
        assignedOfficerName: officerDetails.sender_name,
        assignedOfficerServiceNo: officerDetails.service_no
      });

      alert("Request assigned successfully");
      setShowAssignForm(false);
      fetchRequests();
    } catch (error) {
      console.error("Error assigning request:", error);
      alert("Failed to assign request");
    }
  };

  const handleUnassign = async () => {
    try {
      await axios.put(`http://localhost:5000/api/verify/${selectedRequest._id}/assign`, {
        assignedOfficer: null,
        assignedOfficerName: null,
        assignedOfficerServiceNo: null
      });

      alert("Assignment removed successfully");
      setShowAssignForm(false);
      fetchRequests();
    } catch (error) {
      console.error("Error unassigning request:", error);
      alert("Failed to remove assignment");
    }
  };
  
  //change Ref format 
  const formatReferenceNumber = (id, createdAt) => {
    if (!id || !createdAt) return 'XXXXXX-XXXX';
    const date = new Date(createdAt);
    const dateStr = [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0')
    ].join('');
    const uniquePart = id.slice(-4).toUpperCase();
    return `${dateStr}-${uniquePart}`;
  };

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Verify</h2>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['Pending', 'Verified', 'Rejected'].map((verify) => (
          <button
            key={verify}
            className={`px-6 py-2 rounded-lg font-semibold text-lg focus:outline-none transition-all duration-200 ${
              filter === verify ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
            onClick={() => setFilter(verify)}
          >
            {verify}
          </button>
        ))}
      </div>

      {/* Assign Officer Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {selectedRequest.assignedOfficerName ? 'Update Assignment' : 'Assign Request to Officer'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Service Number</label>
              <div className="flex">
                <input
                  type="text"
                  value={serviceNumber}
                  onChange={(e) => setServiceNumber(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter service number"
                />
                <button 
                  onClick={fetchOfficerDetails}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Find
                </button>
              </div>
            </div>

            {selectedRequest.assignedOfficerName && (
              <div className="mb-4 p-4 bg-yellow-100 rounded">
                <h4 className="font-bold mb-2">Currently Assigned</h4>
                <p><span className="font-semibold">Name:</span> {selectedRequest.assignedOfficerName}</p>
                <p><span className="font-semibold">Service No:</span> {selectedRequest.assignedOfficerServiceNo}</p>
              </div>
            )}

            {officerDetails && (
              <div className="mb-4 p-4 bg-gray-100 rounded">
                <h4 className="font-bold mb-2">
                  {selectedRequest.assignedOfficerName ? 'New Officer Details' : 'Officer Details'}
                </h4>
                <p><span className="font-semibold">Name:</span> {officerDetails.sender_name}</p>
                <p><span className="font-semibold">Designation:</span> {officerDetails.designation}</p>
                <p><span className="font-semibold">Service No:</span> {officerDetails.service_no}</p>
                <p><span className="font-semibold">Section:</span> {officerDetails.section}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {selectedRequest.assignedOfficerName && (
                <button
                  onClick={handleUnassign}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove Assignment
                </button>
              )}
              <button
                onClick={() => setShowAssignForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={!officerDetails}
              >
                {selectedRequest.assignedOfficerName ? 'Reassign' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#2A6BAC] text-white text-lg">
              <th className="py-3 px-4 border text-left">Ref.No</th>
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Created Date Time</th>       
              <th className="py-3 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(req => req.verify === filter).map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border text-left font-mono">
                  {formatReferenceNumber(request._id, request.createdAt)}
                </td>
                <td className="py-2 px-4 border text-left">
                  {request.items && request.items.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {request.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.itemName} {item.quantity && `(Qty: ${item.quantity})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No items</span>
                  )}
                </td>
                <td className="py-2 px-4 border text-left">{request.inLocation}</td>
                <td className="py-2 px-4 border text-left">{request.outLocation}</td>
                <td className="py-2 px-4 border text-left">{request.createdAt}</td>
                <td className="py-2 px-4 border text-center space-x-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all duration-200"
                    onClick={() => navigate(`/view-verify/${request._id}`, { state: { verify: request.verify } })}
                  >
                    View
                  </button>
                  
                  {/* Only show Assign button for Pending requests */}
                  {request.verify === 'Pending' && (
                    <button
                      className={`${
                        request.assignedOfficerName 
                          ? 'bg-orange-700 hover:bg-orange-800' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-4 py-1 rounded transition-all duration-200`}
                      onClick={() => handleAssignClick(request)}
                    >
                      {request.assignedOfficerName ? 'Assigned' : 'Assign'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Verify;