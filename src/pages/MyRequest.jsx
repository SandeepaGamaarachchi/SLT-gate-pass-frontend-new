import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyRequest = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">My Requests</h2>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
          <thead className="bg-[#2A6BAC] text-white">
            <tr>
              <th className="py-3 px-4 border text-left">Ref No</th>
              <th className="py-3 px-4 border text-left">Items</th>
              <th className="py-3 px-4 border text-left">Status</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border font-mono">
                  {formatReferenceNumber(request._id, request.createdAt)}
                </td>
                <td className="py-2 px-4 border">
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
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'approved' ? 'bg-green-200 text-green-800' :
                    request.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/view-request/${request._id}`)}
                  >
                    View Details
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

export default MyRequest;