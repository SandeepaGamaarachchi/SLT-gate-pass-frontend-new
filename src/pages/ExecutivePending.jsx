import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import laptopImage from '../assets/laptop.jpg';

const ViewExecutivePending = () => {
  const { id } = useParams();  // Get request ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState(location.state?.status || "Pending");  // Get status from navigation
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem('token'); const response = await axios.get(`http://localhost:5000/api/executive/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        })
        setRequest(response.data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    };
    fetchRequest();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      // Validate that comment exists if status is Rejected
      if (newStatus === "Rejected" && (!comment || comment.trim() === "")) {
        alert("Executive comment is required when rejecting a request");
        return;
      }
  
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/executive/${id}/status`, 
        { 
          status: newStatus,
          comment: comment // This will be stored as executiveComment in DB
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>Executive Approve ➝ <span className="text-[#CC5500]">{status}</span></h2>
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">← Back</button>
        </div>

        {/* Request Information */}
        
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Request Information
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Requested by: <span className="font-normal">{request.sender_name}</span></p>
            <p className="font-medium">Service No: <span className="font-normal">{request.service_no}</span></p>
            <p className="font-medium">From Location: <span className="font-normal">{request.outLocation}</span></p>
            <p className="font-medium">To Location: <span className="font-normal">{request.inLocation}</span></p>
            
            {status !== "Pending" &&  (
              <p className="font-medium">Executive Officer's Comment: <span className="font-normal">{request.executiveComment}</span></p>
            )}
               
            
          </div>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Items ({request.items.length})
          </div>
          
          {request.items.map((item, index) => (
            <div key={index} className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
              <div className="bg-gray-100 px-4 py-2 rounded-t-md font-bold text-gray-700">
                Item {index + 1}
              </div>
              <div className="p-3 bg-white rounded-b-md border border-gray-300">
                <div className="flex justify-between items-start space-x-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <p className="text-lg font-medium mb-1">Item Name: <span className="font-normal">{item.itemName}</span></p>
                    <p className="text-lg font-medium mb-1">Serial No: <span className="font-normal">{item.serialNo}</span></p>
                    <p className="text-lg font-medium mb-1">Category: <span className="font-normal">{item.category}</span></p>
                    <p className="text-lg font-medium mb-1">Quantity: <span className="font-normal">{item.quantity}</span></p>
                    <p className="text-lg font-medium mb-1">Description: <span className="font-normal">{item.description}</span></p>
                    <p className="text-lg font-medium mb-1">By Hand: <span className="font-normal">{request.byHand}</span></p>
                    <p className="text-lg font-medium mb-1">
                      Vehicle Number: <span className="font-normal">
                        {request.vehicleNumber ? request.vehicleNumber : "N/A"}
                      </span>
                    </p>

                    <p className="text-lg font-medium">Returnable: <span className="font-normal">{item.returnable}</span></p>
                  </div>

                  {/* Right Section (Image + Button) */}
                  <div className="flex flex-col items-center">
                    <img 
                      src={item.image || laptopImage} 
                      alt="Item" 
                      className="w-24 h-24 object-cover border rounded-lg shadow-md" 
                    />
                    {item.image && (
                      <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">
                        View Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Receiver details */}
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Receiver Details
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Receiver Name: <span className="font-normal">{request.receiverName ? request.receiverName[0].toUpperCase() + request.receiverName.slice(1) : 'N/A'}
            </span></p>
            <p className="font-medium">Receiver Contact: <span className="font-normal">{request.receiverContact ? request.receiverContact: "N/A"}</span></p>
            <p className="font-medium">Receiver Group: <span className="font-normal">{request.receiverGroup ? request.receiverGroup : "N/A"}</span></p>

            <p className="font-medium">Service No: <span className="font-normal">{request.receiverServiceNumber ? request.receiverServiceNumber : "N/A"}</span></p>
        
          </div>
        </div>

        {/* Action Buttons */}
        {status === "Pending" && (
          <div className="p-3 rounded-lg shadow-md border border-gray-300">
            <label className="block font-bold mb-2 text-blue-700">Comment</label>
            <textarea 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter Comment Here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors" 
                onClick={() => handleUpdateStatus("Approved")}
              >
                Approve
              </button>
              <button 
                className="bg-red-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-800 transition-colors" 
                onClick={() => handleUpdateStatus("Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExecutivePending;