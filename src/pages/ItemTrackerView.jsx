import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from '../assets/laptop.jpg';
// import companyLogo from '../assets/logo.png'; 
import companylogo from "../assets/companylogo.png";// Import your logo image
import { jsPDF } from "jspdf";

const ItemTrackerView = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError(error.response?.data?.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!request) return;

    const doc = new jsPDF();
    
    // Add logo to the PDF
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
        doc.text("ITEM TRACKING DETAILS", 105, 40, { align: "center" });

        // Add request overview section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Request Overview", 14, 50);
        doc.setFont("helvetica", "normal");
        
        // Request overview details
        doc.text(`Out Location: ${request.outLocation || "N/A"}`, 14, 60);
        doc.text(`In Location: ${request.inLocation || "N/A"}`, 105, 60);
        doc.text(`Dispatch Out Status: ${request.dispatchStatusOut || "N/A"}`, 14, 70);
        doc.text(`Dispatch In Status: ${request.dispatchStatusIn || "N/A"}`, 105, 70);

        // Add items section
        doc.setFont("helvetica", "bold");
        doc.text(`Items (${request.items?.length || 0})`, 14, 85);
        doc.setFont("helvetica", "normal");

        let yPosition = 95;
        
        // Add each item
        request.items?.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Item header
          doc.setFont("helvetica", "bold");
          doc.text(`Item #${index + 1}`, 14, yPosition);
          doc.text(`Ref: ${item.serialNo || "N/A"}`, 180, yPosition, { align: "right" });
          yPosition += 5;

          // Item details
          doc.setFont("helvetica", "normal");
          doc.text(`Name: ${item.itemName || "N/A"}`, 14, yPosition);
          doc.text(`Category: ${item.category || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Quantity: ${item.quantity || "N/A"}`, 14, yPosition);
          doc.text(`Returnable: ${item.returnable || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Description: ${item.description || "N/A"}`, 14, yPosition);
          yPosition += 10;
        });

        // Add additional information section
        doc.setFont("helvetica", "bold");
        doc.text("Additional Information", 14, yPosition);
        yPosition += 7;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Receiver Name: ${request.receiverName || "N/A"}`, 14, yPosition);
        doc.text(`Receiver Contact: ${request.receiverContact || "N/A"}`, 105, yPosition);
        yPosition += 7;

        const transportMethod = request.byHand 
          ? "By Hand" 
          : request.vehicleNumber 
            ? `Vehicle: ${request.vehicleNumber}` 
            : "Not specified";
        
        doc.text(`Transport Method: ${transportMethod}`, 14, yPosition);
        doc.text(`Created At: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}`, 105, yPosition);

        // Save the PDF
        doc.save(`item-tracking-${id}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback PDF without logo if there's an error
      generatePdfWithoutLogo(doc);
    }
  };

  // Fallback PDF generation without logo
  const generatePdfWithoutLogo = (doc) => {
    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Add title
    doc.setFontSize(18);
    doc.text("ITEM TRACKING DETAILS", 105, 15, { align: "center" });

    // Rest of the PDF content (same as before)
    // ... [rest of the PDF generation code]
    
    doc.save(`item-tracking-${id}.pdf`);
  };

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-center">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-red-500 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-center">No request data found.</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>Item Tracking Details</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPdf}
              className="bg-[#2A6BAC] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Out Location:</p>
              <p>{request.outLocation || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">In Location:</p>
              <p>{request.inLocation || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Dispatch Out Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusOut === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusOut === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusOut || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium">Dispatch In Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusIn === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusIn === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusIn || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Items ({request.items?.length || 0})</h3>
          
          {request.items?.map((item, index) => (
            <div key={index} className="p-4 rounded-lg shadow-md border border-gray-300">
              <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
                <span>Item #{index + 1}</span>
                <span>Ref: {item.serialNo || "N/A"}</span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-3">
                    <p className="font-medium">Name:</p>
                    <p>{item.itemName || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Category:</p>
                    <p>{item.category || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Quantity:</p>
                    <p>{item.quantity || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <p className="font-medium">Description:</p>
                    <p>{item.description || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Returnable:</p>
                    <p>{item.returnable || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Image:</p>
                    <div className="flex items-center mt-2">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.itemName || "Item"} 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      ) : (
                        <img 
                          src={laptopImage} 
                          alt="Default item" 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      )}
                      <button 
                        className="ml-2 bg-[#2A6BAC] text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                          if (item.image) window.open(item.image, '_blank');
                        }}
                      >
                        {item.image ? "View Full" : "No Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Receiver Name:</p>
              <p>{request.receiverName || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Receiver Contact:</p>
              <p>{request.receiverContact || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Transport Method:</p>
              <p>{request.byHand ? "By Hand" : request.vehicleNumber ? `Vehicle: ${request.vehicleNumber}` : "Not specified"}</p>
            </div>
            <div>
              <p className="font-medium">Created At:</p>
              <p>{request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTrackerView;