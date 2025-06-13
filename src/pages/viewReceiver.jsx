import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ItemListModal from "./ItemListViewModal";

const ViewReceiver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
        setRequest(response.data);
      } catch (err) {
        console.error("Failed to fetch request:", err);
      }
    };

    fetchRequest();
  }, [id]);

  if (!request) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Request Details ➝{" "}
            <span className={`${request.dispatchStatusIn === "Approved"
              ? "text-green-600"
              : request.dispatchStatusIn === "Pending"
              ? "text-yellow-600"
              : "text-red-600"
            }`}>
              {request.dispatchStatusIn}
            </span>
          </h2>
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">
            ← Back
          </button>
        </div>

        {/* Request Full Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mt-6">
        {/* Reference Number Header */}
        <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Ref. No: {request._id}
        </div>

        <div className="p-4 space-y-6">

            {/* Sender Info */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Sender Information</h4>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>Name:</strong> {request.sender_name}</p>
                <p><strong>Designation:</strong> {request.designation}</p>
                <p><strong>Service No:</strong> {request.service_no}</p>
                <p><strong>Contact No:</strong> {request.contact_number}</p>
            </div>
            </section>

            {/* Item List */}
            {request.items?.length > 0 && (
            <section>
                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Item List</h4>
                <ul className="list-disc list-inside ml-4">
                {request.items.map((item, index) => (
                    <li key={index}>
                    {item.itemName} {item.quantity ? `(Qty: ${item.quantity})` : ""}
                    </li>
                ))}
                </ul>
            </section>
            )}

            {/* Locations & Logistics */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Logistics</h4>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>Out Location:</strong> {request.outLocation}</p>
                <p><strong>In Location:</strong> {request.inLocation}</p>
                <p><strong>Executive Officer:</strong> {request.executiveOfficer}</p>
                <p><strong>Vehicle Number:</strong> {request.vehicleNumber || "N/A"}</p>
            </div>
            </section>

            {/* Receiver Info */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Receiver Details</h4>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>Name:</strong> {request.receiverName}</p>
                <p><strong>Contact:</strong> {request.receiverContact}</p>
                <p><strong>Group:</strong> {request.receiverGroup}</p>
                <p><strong>Service No:</strong> {request.receiverServiceNumber}</p>
            </div>
            </section>

            {/* Statuses */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Request Status</h4>
            <div className="grid grid-cols-3 gap-4">
                <p><strong>Request Status:</strong> {request.verify}</p>
                <p><strong>Dispatch Out:</strong> {request.dispatchStatusOut}</p>
                <p><strong>Dispatch In:</strong> {request.dispatchStatusIn}</p>
            </div>
            </section>

            {/* Approver Info - Out */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Approved by (Out Location)</h4>
            <div className="grid grid-cols-3 gap-4">
                <p><strong>Employee Type:</strong> {request.employeeTypeOut}</p>
                <p><strong>Approver Name:</strong> {request.approverNameOut}</p>
                <p><strong>Service No:</strong> {request.serviceNoOut}</p>
                {request.commentOut && <p><strong>Comment:</strong> {request.commentOut}</p>}
            </div>
            </section>

            {/* Approver Info - In */}
            <section>
            <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Approved by (In Location)</h4>
            <div className="grid grid-cols-3 gap-4">
                <p><strong>Employee Type:</strong> {request.employeeTypeIn}</p>
                <p><strong>Approver Name:</strong> {request.approverNameIn}</p>
                <p><strong>Service No:</strong> {request.serviceNoIn}</p>
                {request.commentIn && <p><strong>Comment:</strong> {request.commentIn}</p>}
            </div>
            </section>

            <br/>
            <button
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
            >
            Return Items
            </button>

            {showModal && (
            <ItemListModal
                id={id}
                onClose={() => setShowModal(false)}
            />
            )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReceiver;
