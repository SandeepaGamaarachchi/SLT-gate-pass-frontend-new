import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";
import companylogo from "../assets/companylogo.png";

const ViewRequest = () => {
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
    fetchUser();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        navigate("/my-request");
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/update-request/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadPdf = async () => {
    if (!request || !user) return;

    const doc = new jsPDF();
    
    try {
      // Convert logo image to base64
      const response = await fetch(companylogo);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = function() {
        const logoDataUrl = reader.result;
        
        // Set font styles
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Add logo (width: 50, height: auto maintains aspect ratio)
        doc.addImage(logoDataUrl, 'PNG', 80, 10, 50, 20);

        // Add title below logo
        doc.setFontSize(18);
        doc.text("REQUEST DETAILS", 105, 40, { align: "center" });

        // Reference Number
        doc.setFontSize(14);
        doc.setTextColor(42, 107, 172); // Blue color
        doc.text(`Ref. No: ${request._id}`, 105, 50, { align: "center" });

        // Status
        doc.setFontSize(12);
        let statusColor;
        if (request.status === 'Approved') {
          statusColor = [0, 128, 0]; // Green
        } else if (request.status === 'Rejected') {
          statusColor = [255, 0, 0]; // Red
        } else {
          statusColor = [255, 165, 0]; // Orange
        }
        doc.setTextColor(...statusColor);
        doc.text(`Status: ${request.status}`, 105, 58, { align: "center" });

        // Date
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${formatDate(request.createdAt)}`, 14, 70);

        // Sender Details
        doc.setFont("helvetica", "bold");
        doc.text("Sender Details", 14, 85);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${user.username}`, 14, 95);
        doc.text(`Email: ${user.email}`, 14, 105);
        doc.text(`Contact: ${user.contact_number}`, 14, 115);

        // Receiver Details
        doc.setFont("helvetica", "bold");
        doc.text("Receiver Details", 14, 130);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${request.receiverName}`, 14, 140);
        doc.text(`Contact No: ${request.receiverContact}`, 14, 150);
        doc.text(`Group: ${request.receiverGroup}`, 14, 160);
        if (request.receiverServiceNumber) {
          doc.text(`Service No: ${request.receiverServiceNumber}`, 14, 170);
        }

        let yPosition = request.receiverServiceNumber ? 180 : 170;

        // Items section
        doc.setFont("helvetica", "bold");
        doc.text(`Items (${request.items.length})`, 14, yPosition);
        yPosition += 10;

        request.items.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Item header
          doc.setFont("helvetica", "bold");
          doc.text(`Item #${index + 1}`, 14, yPosition);
          doc.text(`Ref: ${item.serialNo || "N/A"}`, 180, yPosition, { align: "right" });
          yPosition += 7;

          // Item details
          doc.setFont("helvetica", "normal");
          doc.text(`Name: ${item.itemName || "N/A"}`, 14, yPosition);
          doc.text(`Category: ${item.category || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Quantity: ${item.quantity || "1"}`, 14, yPosition);
          doc.text(`Returnable: ${item.returnable === 'yes' ? 'Yes' : 'No'}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Description: ${item.description || "N/A"}`, 14, yPosition);
          yPosition += 10;
        });

        // Location & Officer Details
        doc.setFont("helvetica", "bold");
        doc.text("Location & Officer Details", 14, yPosition);
        yPosition += 7;
        
        doc.setFont("helvetica", "normal");
        doc.text(`In Location: ${request.inLocation || "N/A"}`, 14, yPosition);
        doc.text(`Out Location: ${request.outLocation || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`Executive Officer: ${request.executiveOfficer || "N/A"}`, 14, yPosition);
        doc.text(`Vehicle Number: ${request.vehicleNumber || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`By Hand: ${request.byHand || "No"}`, 14, yPosition);

        // Save the PDF
        doc.save(`request_${request._id}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback PDF without logo if there's an error
      generatePdfWithoutLogo(doc);
    }
  };

  const generatePdfWithoutLogo = (doc) => {
    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Add title
    doc.setFontSize(18);
    doc.text("REQUEST DETAILS", 105, 15, { align: "center" });

    // Reference Number
    doc.setFontSize(14);
    doc.setTextColor(42, 107, 172); // Blue color
    doc.text(`Ref. No: ${request._id}`, 105, 25, { align: "center" });

    // Status
    doc.setFontSize(12);
    let statusColor;
    if (request.status === 'Approved') {
      statusColor = [0, 128, 0]; // Green
    } else if (request.status === 'Rejected') {
      statusColor = [255, 0, 0]; // Red
    } else {
      statusColor = [255, 165, 0]; // Orange
    }
    doc.setTextColor(...statusColor);
    doc.text(`Status: ${request.status}`, 105, 33, { align: "center" });

    // Date
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${formatDate(request.createdAt)}`, 14, 45);

    // Rest of the content (same as above)
    // ... [rest of the PDF generation code]
    
    doc.save(`request_${request._id}.pdf`);
  };

  if (!request || !user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6 relative">
        {/* Back Arrow Button */}
        <button 
          onClick={() => navigate("/my-request")}
          className="absolute top-4 right-4 bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
          aria-label="Back to My Requests"
        >
          <FaArrowLeft className="text-lg" />
        </button>
        
        {/* Request Details Heading */}
        <div className="text-blue-700 font-bold text-lg text-center my-4">Request Details</div>
        
        {/* Reference Number as Title */}
        <div className="bg-[#2A6BAC] text-white text-center font-bold text-lg py-2 rounded-t-md">
          Ref. No: {request._id}
        </div>

        {/* Status Badge */}
        <div className={`text-center my-2 p-2 rounded-md font-bold ${
          request.status === 'Approved' ? 'bg-green-200 text-green-800' :
          request.status === 'Rejected' ? 'bg-red-200 text-red-800' :
          'bg-yellow-200 text-yellow-800'
        }`}>
          Status: {request.status}
        </div>

        {/* Sender Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Sender Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">Name: <span className="font-normal">{user.username}</span></p>
            <p className="text-lg font-medium">Email: <span className="font-normal">{user.email}</span></p>
            <p className="text-lg font-medium">Contact: <span className="font-normal">{user.contact_number}</span></p>
          </div>
        </div>

        {/* Receiver Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-green-700 px-4 py-2 rounded-t-md font-bold">Receiver Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">Name: <span className="font-normal">{request.receiverName}</span></p>
            <p className="text-lg font-medium">Contact No: <span className="font-normal">{request.receiverContact}</span></p>
            <p className="text-lg font-medium">Group: <span className="font-normal">{request.receiverGroup}</span></p>
            {request.receiverServiceNumber && (
              <p className="text-lg font-medium">Service No: <span className="font-normal">{request.receiverServiceNumber}</span></p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Items ({request.items.length})</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            {request.items.map((item, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                <h4 className="font-bold text-lg mb-2">Item {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-lg font-medium">Name: <span className="font-normal">{item.itemName}</span></p>
                  <p className="text-lg font-medium">Serial No: <span className="font-normal">{item.serialNo || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Category: <span className="font-normal">{item.category || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Quantity: <span className="font-normal">{item.quantity || '1'}</span></p>
                  <p className="text-lg font-medium">Description: <span className="font-normal">{item.description || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Returnable: <span className="font-normal">{item.returnable === 'yes' ? 'Yes' : 'No'}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Officer Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Location & Officer Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">In Location: <span className="font-normal">{request.inLocation || "N/A"}</span></p>
            <p className="text-lg font-medium">Out Location: <span className="font-normal">{request.outLocation || "N/A"}</span></p>
            <p className="text-lg font-medium">Executive Officer: <span className="font-normal">{request.executiveOfficer || "N/A"}</span></p>
            <p className="text-lg font-medium">Vehicle Number: <span className="font-normal">{request.vehicleNumber || "N/A"}</span></p>
            <p className="text-lg font-medium">By Hand: <span className="font-normal">{request.byHand || "No"}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
            onClick={downloadPdf}
          >
            <FaFilePdf className="text-lg" />
            Download PDF
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button 
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-md transition-colors" 
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;