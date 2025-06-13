import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ExecutiveApprove = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/executive', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/executive/${id}/status`, { status });
      setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Executive Approve</h2>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            className={`px-6 py-2 rounded-lg font-semibold text-lg focus:outline-none transition-all duration-200 ${
              filter === status ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

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
              <th className="py-3 px-4 border text-left">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(req => req.status === filter).map((request, index) => (
              
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                {/* ===== CHANGED REFERENCE NUMBER FORMAT ===== */}
                <td className="py-2 px-4 border text-left font-mono">
                  {(() => {
                    if (!request._id || !request.createdAt) return 'XXXXXX-XXXX';
                    const date = new Date(request.createdAt);
                    const dateStr = [
                      date.getFullYear(),
                      (date.getMonth() + 1).toString().padStart(2, '0'),
                      date.getDate().toString().padStart(2, '0')
                    ].join('');
                    const uniquePart = request._id.slice(-4).toUpperCase();
                    return `${dateStr}-${uniquePart}`;
                  })()}
                </td>
                {/* ===== END REFERENCE NUMBER FORMAT CHANGE ===== */}
                <td className="py-2 px-4 border text-left">{request.items && request.items.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {request.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.itemName} {item.quantity && `(Qty: ${item.quantity})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No items</span>
                )}</td>
                <td className="py-2 px-4 border text-left">{request.inLocation}</td>
                <td className="py-2 px-4 border text-left">{request.outLocation}</td>
                <td className="py-2 px-4 border text-left">{request.createdAt}</td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all duration-200"
                    onClick={() => navigate(`/view-executive-pending/${request._id}`, { state: { status: request.status } })}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutiveApprove;