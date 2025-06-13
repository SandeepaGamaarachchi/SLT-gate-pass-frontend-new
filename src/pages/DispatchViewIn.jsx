import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from "../assets/laptop.jpg";
import { jsPDF } from "jspdf";

const DispatchViewIn = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const [dispatchStatusIn, setStatusDispatchIn] = useState("");
  const [approverNameIn, setapproverNameIn] = useState("");
  const [serviceNoIn, setserviceNoIn] = useState("");
  const [commentIn, setcommentIn] = useState("");
  const [employeeTypeIn, setemployeeTypeIn] = useState("SLT");
  const [nonSltNameIn, setNonSltNameIn] = useState("");
  const [nicNumberIn, setNicNumberIn] = useState("");
  const [companyNameIn, setCompanyNameIn] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dispatch/getDispatchById/${id}`
      );
      setRequest(response.data);
      setStatusDispatchIn(response.data.dispatchStatusIn);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  // PDF Download Function
  const downloadPdf = () => {
    if (!request) return;
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const boxWidth = pageWidth - 2 * margin;
    const columnWidth = (boxWidth - 20) / 2;
    const textPadding = 6;
    const LABEL_VALUE_GAP = 0.5;
    let pageCount = 1;
  
    // Colors
    const colors = {
      primary: [42, 107, 172],
      success: [0, 128, 0],
      danger: [255, 0, 0],
      warning: [255, 165, 0],
      darkBlue: [27, 61, 129],
      darkGreen: [22, 163, 74],
      gray: [209, 213, 219],
      white: [255, 255, 255]
    };
  
    // Draw rounded box with fill and border
    const roundedRectWithBorder = (x, y, width, height, radius, fillColor, borderColor = colors.gray) => {
      doc.setDrawColor(...borderColor);
      doc.setFillColor(...fillColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, width, height, radius, radius, 'FD');
    };
  
    // Create standard box container with consistent title style
    const createBoxContainer = (title, content, yPos, titleColor = colors.darkBlue) => {
      let contentHeight = textPadding;
      content.forEach(item => {
        const text = `${item.label}: ${item.value}`;
        contentHeight += Math.max(
          doc.splitTextToSize(text, boxWidth - textPadding * 2).length * 5.5,
          12
        );
      });
  
      const boxHeight = 15 + contentHeight + (textPadding / 2);
      
      if (yPos + boxHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("DISPATCH IN DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      roundedRectWithBorder(margin, yPos, boxWidth, boxHeight, 3, colors.white);
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, titleColor, titleColor);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, margin + textPadding, yPos + 8);
      
      let currentY = yPos + 17;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      content.forEach((item, index) => {
        const fullText = `${item.label}: ${item.value}`;
        const lines = doc.splitTextToSize(fullText, boxWidth - textPadding * 2);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, margin + textPadding, currentY);
        
        const labelWidth = doc.getTextWidth(`${item.label}: `) + LABEL_VALUE_GAP;
        
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(item.value, boxWidth - textPadding * 2 - labelWidth);
        
        doc.text(valueLines[0], margin + textPadding + labelWidth, currentY);
        
        let yOffset = 0;
        for (let i = 1; i < valueLines.length; i++) {
          yOffset += 5;
          doc.text(valueLines[i], margin + textPadding + labelWidth, currentY + yOffset);
        }
        
        currentY += Math.max(valueLines.length * 5.5, 12);
        
        if (index < content.length - 1) {
          doc.setDrawColor(...colors.gray);
          doc.setLineWidth(0.1);
          doc.line(
            margin + textPadding, 
            currentY - 0.5, 
            margin + boxWidth - textPadding, 
            currentY - 0.5
          );
          currentY += 2;
        }
      });
  
      return yPos + boxHeight + 8;
    };
  
    // Create item box with consistent title style
    const createItemBox = (item, index, yPos) => {
      const itemTitle = `Item ${index + 1}`;
      const itemHeight = 70;
      
      if (yPos + itemHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("DISPATCH IN DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      roundedRectWithBorder(margin, yPos, boxWidth, itemHeight, 3, colors.white);
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, colors.darkBlue, colors.darkBlue);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(itemTitle, margin + textPadding, yPos + 8);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(item.itemName, margin + textPadding, yPos + 20);
      
      const leftColumn = [
        { label: "Serial No", value: item.serialNo || 'N/A' },
        { label: "Category", value: item.category || 'N/A' },
        { label: "Condition", value: item.condition || 'N/A' }
      ];
      
      const rightColumn = [
        { label: "Quantity", value: item.quantity || '1' },
        { label: "Returnable", value: item.returnable === 'yes' ? 'Yes' : 'No' },
        { label: "Remarks", value: item.remarks || 'N/A' }
      ];
      
      let currentY = yPos + 25;
      doc.setFontSize(10);
      
      leftColumn.forEach((field, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${field.label}:`, margin + 10, currentY + (i * 15));
        
        doc.setFont('helvetica', 'normal');
        const labelWidth = doc.getTextWidth(`${field.label}: `) + LABEL_VALUE_GAP;
        const valueLines = doc.splitTextToSize(field.value, columnWidth - labelWidth - 5);
        
        let yOffset = 0;
        valueLines.forEach((line, lineIndex) => {
          doc.text(line, margin + 10 + labelWidth, currentY + (i * 15) + yOffset);
          yOffset += 5;
        });
      });
      
      rightColumn.forEach((field, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${field.label}:`, margin + 10 + columnWidth, currentY + (i * 15));
        
        doc.setFont('helvetica', 'normal');
        const labelWidth = doc.getTextWidth(`${field.label}: `) + LABEL_VALUE_GAP;
        const valueLines = doc.splitTextToSize(field.value, columnWidth - labelWidth - 5);
        
        let yOffset = 0;
        valueLines.forEach((line, lineIndex) => {
          doc.text(line, margin + 10 + columnWidth + labelWidth, currentY + (i * 15) + yOffset);
          yOffset += 5;
        });
      });
      
      doc.setFont('helvetica', 'bold');
      doc.text("Description:", margin + 10, yPos + 50);
      
      doc.setFont('helvetica', 'normal');
      const descLabelWidth = doc.getTextWidth("Description:") + LABEL_VALUE_GAP;
      const descLines = doc.splitTextToSize(item.description || 'N/A', boxWidth - 20 - descLabelWidth);
      
      descLines.forEach((line, i) => {
        doc.text(line, margin + 10 + descLabelWidth, yPos + 50 + (i * 5));
      });
      
      return yPos + itemHeight + 10;
    };
  
    // Header
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text("DISPATCH IN DETAILS", pageWidth / 2, 20, { align: 'center' });
  
    // Reference Number
    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    roundedRectWithBorder(margin, 30, boxWidth, 12, 3, colors.primary);
    doc.text(`Ref. No: ${request._id}`, pageWidth / 2, 37, { align: 'center' });
  
    // Status
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Status: ${request.dispatchStatusIn || 'Pending'}`, margin + doc.getTextWidth("Status: ") + LABEL_VALUE_GAP, 55);
  
    let yPosition = 65;
  
    // Sender Details
    yPosition = createBoxContainer(
      "Sender Details",
      [
        { label: "Name", value: request.sender_name || "N/A" },
        { label: "Designation", value: request.designation || "N/A" },
        { label: "Contact Number", value: request.contact_number || "N/A" },
        { label: "Email", value: request.email || "N/A" },
        { label: "Department", value: request.department || "N/A" }
      ],
      yPosition
    );
  
    // Location Details
    yPosition = createBoxContainer(
      "Location Details",
      [
        { label: "Out Location", value: request.outLocation || "N/A" },
        { label: "In Location", value: request.inLocation || "N/A" },
        ...(request.vehicleNumber ? [{ label: "Vehicle Number", value: request.vehicleNumber }] : []),
        { label: "By Hand", value: request.byHand || "No" },
        { label: "Purpose", value: request.purpose || "N/A" },
        { label: "Expected Return Date", value: request.expectedReturnDate || "N/A" }
      ],
      yPosition,
      colors.darkGreen
    );
  
    // Approval Details (if approved/rejected)
    if (request.dispatchStatusIn && request.dispatchStatusIn !== "Pending") {
      yPosition = createBoxContainer(
        "Dispatch Approval Details",
        [
          { label: "Status", value: request.dispatchStatusIn },
          { label: "Approver Name", value: request.approverNameIn || "N/A" },
          { label: "Service Number", value: request.serviceNoIn || "N/A" },
          { label: "Approval Date", value: new Date(request.updatedAt).toLocaleString() },
          ...(request.commentIn ? [{ label: "Comment", value: request.commentIn }] : [])
        ],
        yPosition,
        request.dispatchStatusIn === "Approved" ? colors.success : colors.danger
      );
    }
  
    // Items List
    if (request.items && request.items.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(...colors.darkBlue);
      doc.text("ITEMS LIST", margin, yPosition);
      yPosition += 8;
      
      request.items.forEach((item, index) => {
        yPosition = createItemBox(item, index, yPosition);
      });
    }
  
    // Additional Information
    yPosition = createBoxContainer(
      "Additional Information",
      [
        { label: "Created At", value: new Date(request.createdAt).toLocaleString() },
        { label: "Last Updated", value: new Date(request.updatedAt).toLocaleString() },
        ...(request.notes ? [{ label: "Notes", value: request.notes }] : [])
      ],
      yPosition,
      colors.darkBlue
    );
  
    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  
    // Save the PDF
    doc.save(`dispatch_in_${request._id}.pdf`);
  };

  const handleUpdateStatus = async (newStatus) => {
    // Validation
    if (newStatus === "Rejected" && !commentIn.trim()) {
      alert("comment is required for rejection!");
      return;
    }

    try {
      const payload = {
        dispatchStatusIn: newStatus,
        employeeTypeIn,
        commentIn,
      };
    
      if (employeeTypeIn === "SLT") {
        payload.approverNameIn = approverNameIn;
        payload.serviceNoIn = serviceNoIn;
        if (!approverNameIn.trim() || !serviceNoIn.trim()) {
          alert("Name and Service Number are required!");
          return;
        }
      } else if (employeeTypeIn === "Non-SLT") {
        payload.nonSltNameIn = nonSltNameIn;
        payload.nicNumberIn = nicNumberIn;
        payload.companyNameIn = companyNameIn;
        if (!nonSltNameIn.trim() || !nicNumberIn.trim() || !companyNameIn.trim()) {
          alert("Name, NIC Number and Company name are required!");
          return;
        }
      }
    
      // Send PUT request
      await axios.put(`http://localhost:5000/api/dispatch/updateApprovalIn/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      setStatusDispatchIn(newStatus);
      alert(`Request ${newStatus} successfully!`);
      fetchRequestDetails();
    } catch (error) {
      console.error(`Error updating status:`, error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
        {/* Header with PDF button */}
        <div className="lg:flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Dispatch In Location Details ➝{" "}
            <span
              className={`${
                dispatchStatusIn === "Approved"
                  ? "text-green-600"
                  : dispatchStatusIn === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {dispatchStatusIn}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            {dispatchStatusIn !== "Pending" && (
              <button 
                onClick={downloadPdf}
                className="bg-[#2A6BAC] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Request Details Section */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300">
          {/* Blue Header */}
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
            <span>Dispatch Details</span>
            <span>Ref. No: {request._id}</span>
          </div>

          {/* Item Details Box */}
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <div className="lg:flex flex-col lg:flex-row justify-between items-start  space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Left Section */}
              <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                Sender Details
              </h4>
              <p className="text-lg font-medium mb-1">
                Name:{" "}
                <span className="font-normal">{request.sender_name}</span>
              </p>
              <p className="text-lg font-medium mb-1">
                Designation:{" "}
                <span className="font-normal">{request.designation}</span>
              </p>
              <p className="text-lg font-medium mb-1">
                Service Number:{" "}
                <span className="font-normal">{request.service_no}</span>
              </p>
              <p className="text-lg font-medium mb-1">
                Contact Number:{" "}
                <span className="font-normal">{request.contact_number}</span>
              </p>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 my-4 mt-8">
                  Request Details
              </h4>
              <p className="text-lg font-medium mb-1">
                Out Location:{" "}
                <span className="font-normal">{request.outLocation}</span>
              </p>
              <p className="text-lg font-medium mb-1">
                In Location:{" "}
                <span className="font-normal">{request.inLocation}</span>
              </p>
              <p className="text-lg font-medium mb-1">
                Approved By:{" "}
                <span className="font-normal">
                  {request.executiveOfficer}
                </span>
              </p>
              <p className="text-lg font-medium mb-1">
                By Hand:{" "}
                <span className="font-normal">{request.byHand || "No"}</span>
              </p>
              {request.vehicleNumber && (
                <p className="text-lg font-medium mb-1">
                  Vehicle Number:{" "}
                  <span className="font-normal">{request.vehicleNumber}</span>
              </p>
              )}
              <br />
                {request.dispatchStatusOut !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch Out Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusOut === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Employee Type:{" "}
                      <span className="font-normal">
                        {request.employeeTypeOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameOut || request.nonSltNameOut}
                      </span>
                    </p>
                    {request.employeeTypeOut === "SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          Service No:{" "}
                          <span className="font-normal">{request.serviceNoOut}</span>
                        </p>
                      </>
                    )}
                    {request.employeeTypeOut === "Non-SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          NIC Number:{" "}
                          <span className="font-normal">{request.nicNumberOut}</span>
                        </p>
                      </>
                    )}
                    {request.commentOut && (
                      <p className="text-lg font-medium mb-1">
                        Comment:{" "}
                        <span className="font-normal">
                          {request.commentOut || "N/A"}
                        </span>
                      </p>
                    )}
                  </>
                )}
                <br />
                {request.dispatchStatusIn !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch In Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusIn === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Employee Type:{" "}
                      <span className="font-normal">
                        {request.employeeTypeIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameIn || request.nonSltNameIn}
                      </span>
                    </p>
                    {request.employeeTypeIn === "SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          Service No:{" "}
                          <span className="font-normal">{request.serviceNoIn}</span>
                        </p>
                      </>
                    )}
                    {request.employeeTypeIn === "Non-SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          NIC Number:{" "}
                          <span className="font-normal">{request.nicNumberIn}</span>
                        </p>
                      </>
                    )}
                    
                    {request.commentIn && (
                      <p className="text-lg font-medium mb-1">
                        Comment:{" "}
                        <span className="font-normal">
                          {request.commentIn || "N/A"}
                        </span>
                      </p>
                    )}
                  </>
                )}

                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mt-8 mb-3">
                  Receiver Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Name:{" "}
                  <span className="font-normal">
                    {request.receiverName
                      ? request.receiverName[0].toUpperCase() +
                        request.receiverName.slice(1)
                      : "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">
                    {request.receiverContact || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Service Number:{" "}
                  <span className="font-normal">
                    {request.receiverServiceNumber || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Receiver Group:{" "}
                  <span className="font-normal">
                    {request.receiverGroup || "N/A"}
                  </span>
                </p>
              </div>

              {/* Right Section - Items */}
              <div className="flex-1">
                {request.items && request.items.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                      Item Details
                    </h4>
                    <div className="space-y-3">
                      {request.items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <p>
                            <span className="text-lg font-medium">Name:</span> {item.itemName}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Serial No:</span> {item.serialNo}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Category:</span> {item.category}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Quantity:</span> {item.quantity}
                          </p>
                          <p>
                            <strong>Returnable:</strong> {item.returnable}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Description:</span>{" "}
                              {item.description || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image and View Button Section */}
                <div className="flex justify-start mt-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={laptopImage}
                      alt="Item"
                      className="w-24 h-24 object-cover border rounded-lg shadow-md"
                    />
                    <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">
                      View Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {dispatchStatusIn === "Pending" && (
            <>
            {/* Employee Type Selection (Radio Buttons) */}
            <label className="block font-bold mb-2 text-blue-700 mt-5">
              Employee Type
            </label>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="employeeType"
                  value="SLT"
                  checked={employeeTypeIn === "SLT"}
                  onChange={() => setemployeeTypeIn("SLT")}
                  className="mr-2"
                />
                SLT Employee
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="employeeType"
                  value="Non-SLT"
                  checked={employeeTypeIn === "Non-SLT"}
                  onChange={() => setemployeeTypeIn("Non-SLT")}
                  className="mr-2"
                />
                Non-SLT Employee
              </label>
            </div>

            {/* SLT Employee Section */}
            {employeeTypeIn === "SLT" && (
              <>
                <label className="block font-bold mb-2 text-blue-700">
                  Processed By
                </label>
                <input
                  type="text"
                  value={approverNameIn}
                  onChange={(e) => setapproverNameIn(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter Name"
                  required
                />

                <label className="block font-bold mb-2 text-blue-700 mt-3">
                  Service Number
                </label>
                <input
                  type="text"
                  value={serviceNoIn}
                  onChange={(e) => setserviceNoIn(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter Service Number"
                  required
                />
              </>
            )}

            {/* Non-SLT Employee Section */}
            {employeeTypeIn === "Non-SLT" && (
              <>
                <label className="block font-bold mb-2 text-blue-700">
                  Name
                </label>
                <input
                  type="text"
                  value={nonSltNameIn}
                  onChange={(e) => setNonSltNameIn(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter Full Name"
                  required
                />

                <label className="block font-bold mb-2 text-blue-700 mt-3">
                  NIC Number
                </label>
                <input
                  type="text"
                  value={nicNumberIn}
                  onChange={(e) => setNicNumberIn(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter NIC Number"
                  required
                />

                <label className="block font-bold mb-2 text-blue-700 mt-3">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyNameIn}
                  onChange={(e) => setCompanyNameIn(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter Company Name"
                  required
                />
              </>
            )}

            {/* Comment (Required for Rejection) */}
            <label className="block font-bold mb-2 text-blue-700 mt-3">
              Comment
            </label>
            <textarea
              value={commentIn}
              onChange={(e) => setcommentIn(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Comment Here"
            ></textarea>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
                  onClick={() => handleUpdateStatus("Approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-700 text-white px-8 py-2 rounded-lg shadow-md"
                  onClick={() => handleUpdateStatus("Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchViewIn;