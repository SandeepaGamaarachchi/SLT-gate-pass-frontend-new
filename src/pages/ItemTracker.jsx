import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemTracker = () => {
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
      // Filter requests that have at least one returnable item
      const returnableRequests = response.data.filter(request => 
        request.items.some(item => item.returnable === "yes")
      );
      setRequests(returnableRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Item Tracker (Returnable Items)</h2>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        {requests.length > 0 ? (
          <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead className="bg-[#2A6BAC] text-white">
              <tr>
                <th className="py-3 px-4 border text-left">Ref No</th>
                {/* <th className="py-3 px-4 border text-left">Item Name</th>
                <th className="py-3 px-4 border text-left">Category</th> */}
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Status</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => {
                // Find all returnable items in this request
                const returnableItems = request.items.filter(item => item.returnable === "yes");
                return returnableItems.map((item, itemIndex) => (
                  <tr 
                    key={`${request._id}-${itemIndex}`} 
                    className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                  >
                    <td className="py-2 px-4 border font-mono">
                    {formatReferenceNumber(request._id, request.createdAt)}
                  </td>
                    {/* <td className="py-2 px-4 border">{item.itemName}</td>
                    <td className="py-2 px-4 border">{item.category}</td> */}
                    <td className="py-2 px-4 border">{request.inLocation}</td>
                    <td className="py-2 px-4 border">{request.outLocation}</td>
                    <td className="py-2 px-4 border">{request.status || 'Pending'}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded"
                        onClick={() => navigate(`/item-tracker-view/${request._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No returnable items found
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemTracker;