import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dispatch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [upcomingDispatches, setUpcomingDispatches] = useState([]);
  const [processedDispatches, setProcessedDispatches] = useState([]);
  const [inLocationDispatches, setInLocationDispatches] = useState([]);
  const [processedInLocation, setProcessedInLocation] = useState([]);
  const [activeTab, setActiveTab] = useState("out");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        let userBranch;
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1])); 
          userBranch = tokenPayload.branch_location;
        } catch (decodeError) {
          console.error("Invalid token:", decodeError);
          return;
        }
  
        console.log("User's Branch Location:", `"${userBranch}"`);
  
        const response = await axios.get("http://localhost:5000/api/dispatch/verified", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const allDispatches = Array.isArray(response.data) ? response.data : response.data.data;

        const pendingOutLocation = allDispatches.filter(item => {
          return (
            item.dispatchStatusOut?.trim().toLowerCase() === "pending" &&
            item.dispatchStatusIn?.trim().toLowerCase() === "pending" &&
            item.outLocation?.trim().toLowerCase() === userBranch.trim().toLowerCase()
          );
        });

        const approvedOutLocation = allDispatches.filter(item => {
          return (
            item.dispatchStatusOut?.trim().toLowerCase() !== "pending" &&
            item.outLocation?.trim().toLowerCase() === userBranch.trim().toLowerCase()
          );
        });

        const pendingInLocation = allDispatches.filter(item => {
          return (
            item.dispatchStatusOut?.trim().toLowerCase() === "approved" &&
            item.dispatchStatusIn?.trim().toLowerCase() === "pending" &&
            item.inLocation?.trim().toLowerCase() === userBranch.trim().toLowerCase()
          );
        });

        const approvedInLocation = allDispatches.filter(item => {
          return (
            item.dispatchStatusOut?.trim().toLowerCase() === "approved" &&
            item.dispatchStatusIn?.trim().toLowerCase() !== "pending" &&
            item.inLocation?.trim().toLowerCase() === userBranch.trim().toLowerCase()
          );
        });

        setUpcomingDispatches(pendingOutLocation);
        setProcessedDispatches(approvedOutLocation);
        setInLocationDispatches(pendingInLocation);
        setProcessedInLocation(approvedInLocation);

      } catch (error) {
        console.error("Error fetching dispatches:", error);
      }
    };
    fetchDispatches();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-200 text-green-800 font-bold";
    if (status === "Rejected") return "bg-red-200 text-red-800 font-bold";
    return "";
  };

  const filterDispatches = (dispatches) => {
    return dispatches.filter(dispatch => {
      // Filter items inside each dispatch
      const itemMatches = dispatch.items?.some(item =>
        item.serialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Filter based on dispatch-level properties
      const dispatchMatches =
        dispatch.inLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispatch.outLocation?.toLowerCase().includes(searchTerm.toLowerCase());
  
      // Check date filter
      const matchesDate = selectedDate 
        ? new Date(dispatch.createdAt).toISOString().split('T')[0] === selectedDate 
        : true;
  
      return (itemMatches || dispatchMatches) && matchesDate;
    });
  };

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Dispatch
      </h2>
      <div>
        <button className={`px-4 py-2 rounded-l-lg ${activeTab === "out" ? "bg-[#1B3D81] text-white" : "bg-gray-300"}`} onClick={() => setActiveTab("out")}>Out Location</button>
        <button className={`px-4 py-2 rounded-r-lg ${activeTab === "in" ? "bg-[#1B3D81] text-white" : "bg-gray-300"}`} onClick={() => setActiveTab("in")}>In Location</button>
      </div>
      </div>

      {/* Search and Date Picker Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-[28rem] mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[28rem]">
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {activeTab === "out" && (
      <>
      {/* Upcoming Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Category</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filterDispatches(upcomingDispatches).map((dispatch, index) => (
                <React.Fragment key={index}>
                  {dispatch.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                      <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                      <td className="py-2 px-4 border text-left">{item.itemName}</td>
                      <td className="py-2 px-4 border text-left">{item.category}</td>
                      <td className="py-2 px-4 border text-left">{dispatch.inLocation}</td>
                      <td className="py-2 px-4 border text-left">{dispatch.outLocation}</td>
                      <td className="py-2 px-4 border text-left">{new Date(dispatch.createdAt).toLocaleString()}</td>
                      {itemIndex === 0 && (
                        <td className="py-2 px-4 border text-center" rowSpan={dispatch.items.length}>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                            onClick={() => navigate(`/dispatch-view/${dispatch._id}`)}
                          >
                            View
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {filterDispatches(upcomingDispatches).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>

      {/* Processed Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-9">Processed Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full border-collapse border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#2A6BAC] text-white">
              <th className="py-3 px-4 border text-left">Ref.No</th>
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">Category</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Created Date</th>
              <th className="py-3 px-4 border text-center">Status</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {filterDispatches(processedDispatches).map((dispatch, index) => (
              <React.Fragment key={index}>
                {dispatch.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                    <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                    <td className="py-2 px-4 border text-left">{item.itemName}</td>
                    <td className="py-2 px-4 border text-left">{item.category}</td>
                    <td className="py-2 px-4 border text-left">{dispatch.inLocation}</td>
                    <td className="py-2 px-4 border text-left">{dispatch.outLocation}</td>
                    <td className="py-2 px-4 border text-left">{new Date(dispatch.createdAt).toLocaleString()}</td>
                    <td className={`py-2 px-4 border text-center ${getStatusStyle(dispatch.dispatchStatusOut)}`}>
                      {dispatch.dispatchStatusOut}
                    </td>
                    {itemIndex === 0 && (
                      <td className="py-2 px-4 border text-center" rowSpan={dispatch.items.length}>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                          onClick={() => navigate(`/dispatch-view/${dispatch._id}`)}
                        >
                          View
                        </button>
                      </td>
                    )}
                  </tr> ))}
              </React.Fragment>
            ))}
            {filterDispatches(processedDispatches).length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>)}
      
      {activeTab === "in" && (
      <>
      {/* Upcoming Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Category</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filterDispatches(inLocationDispatches).map((dispatch, index) => (
                  <React.Fragment key={index}>
                    {dispatch.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                        <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                        <td className="py-2 px-4 border text-left">{item.itemName}</td>
                        <td className="py-2 px-4 border text-left">{item.category}</td>
                        <td className="py-2 px-4 border text-left">{dispatch.inLocation}</td>
                        <td className="py-2 px-4 border text-left">{dispatch.outLocation}</td>
                        <td className="py-2 px-4 border text-left">{new Date(dispatch.createdAt).toLocaleString()}</td>
                        {itemIndex === 0 && (
                          <td className="py-2 px-4 border text-center" rowSpan={dispatch.items.length}>
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                              onClick={() => navigate(`/dispatch-view-In/${dispatch._id}`)}
                            >
                              View
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              {filterDispatches(inLocationDispatches).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>

      {/* Processed Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-9">Processed Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full border-collapse border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#2A6BAC] text-white">
              <th className="py-3 px-4 border text-left">Ref.No</th>
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">Category</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Created Date</th>
              <th className="py-3 px-4 border text-center">Status</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {filterDispatches(processedInLocation).map((dispatch, index) => (
              <React.Fragment key={index}>
                {dispatch.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                    <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                    <td className="py-2 px-4 border text-left">{item.itemName}</td>
                    <td className="py-2 px-4 border text-left">{item.category}</td>
                    <td className="py-2 px-4 border text-left">{dispatch.inLocation}</td>
                    <td className="py-2 px-4 border text-left">{dispatch.outLocation}</td>
                    <td className="py-2 px-4 border text-left">{new Date(dispatch.createdAt).toLocaleString()}</td>
                    <td className={`py-2 px-4 border text-center ${getStatusStyle(dispatch.dispatchStatusIn)}`}>
                      {dispatch.dispatchStatusIn}
                    </td>
                    {itemIndex === 0 && (
                      <td className="py-2 px-4 border text-center" rowSpan={dispatch.items.length}>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                          onClick={() => navigate(`/dispatch-view-In/${dispatch._id}`)}
                        >
                          View
                        </button>
                      </td>
                    )}
                  </tr> ))}
              </React.Fragment>
            ))}
            {filterDispatches(processedInLocation).length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};

export default Dispatch;
