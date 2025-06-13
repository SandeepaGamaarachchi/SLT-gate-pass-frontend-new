import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewRequest from "./pages/NewRequest";
import MyRequest from "./pages/MyRequest";
import UpdateRequest from "./pages/UpdateRequest";
import ItemTracker from "./pages/ItemTracker";
import ViewRequest from "./pages/ViewRequest";
import ExecutiveApprovePage from "./pages/ExecutiveApprove";

import AdminView from "./pages/AdminView";
import AdminPage from "./pages/AdminPage";
import AdminLocations from "./pages/AdminLocations";
import AdminCategories from "./pages/AdminCategories";


import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ViewExecutivePending from "./pages/ExecutivePending";

import VerifyPage from "./pages/VerifyPage";
import ViewVerify from "./pages/VerifyView";

import Dispatch from "./pages/Dispatch";
import ItemTrackerView from "./pages/ItemTrackerView";
import Receiver from "./pages/Receiver";
import DispatchView from "./pages/DispatchView";

import SenderDetails from "./pages/SenderDetails";

import ProfileCard from "./pages/ProfileCard";
import DispatchViewIn from "./pages/DispatchViewIn";

import ReturnItemsDetails from "./pages/ReturnItemsDetails";
import ViewReceiver from "./pages/viewReceiver";
import userManagement from "./pages/userManagement";

const App = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (token && storedRole && storedUsername) {
      setRole(storedRole);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ Component, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
    return <Component />;
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar role={role} username={username} logout={handleLogout} />}
        <Routes>
          {/* Routes accessible to all authenticated users */}
          <Route path="/home" element={<ProtectedRoute Component={HomePage} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/new-request" element={<ProtectedRoute Component={NewRequest} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/my-request" element={<ProtectedRoute Component={MyRequest} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/item-tracker" element={<ProtectedRoute Component={ItemTracker} allowedRoles={["user", "admin","security_officer","super admin"]} />} />
          <Route path="/view-request/:id" element={<ProtectedRoute Component={ViewRequest} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/update-request/:id" element={<ProtectedRoute Component={UpdateRequest} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/executive-approve" element={<ProtectedRoute Component={ExecutiveApprovePage} allowedRoles={["admin","executive_officer","super admin"]} />} />


          <Route path="/view-executive-pending/:id" element={<ProtectedRoute Component={ViewExecutivePending} allowedRoles={["admin","executive_officer","super admin"]} />} />
          <Route path="/verify" element={<ProtectedRoute Component={VerifyPage} allowedRoles={["admin","duty_officer","super admin"]} />} />
          <Route path="/view-verify/:id" element={<ProtectedRoute Component={ViewVerify} allowedRoles={[ "admin","duty_officer","super admin"]} />} />
          <Route path="/dispatch" element={<ProtectedRoute Component={Dispatch} allowedRoles={[ "admin","security_officer","super admin"]} />} />
          <Route path="/item-tracker-view/:id" element={<ProtectedRoute Component={ItemTrackerView} allowedRoles={["admin","security_officer","super admin"]} />} />
          <Route path="/receiver" element={<ProtectedRoute Component={Receiver} allowedRoles={["user", "admin","security_officer","super admin"]} />} />
          <Route path="/dispatch-view/:id" element={<ProtectedRoute Component={DispatchView} allowedRoles={["admin","security_officer","super admin"]} />} />
          <Route path="/profile" element={<ProtectedRoute Component={ProfileCard} allowedRoles={["user", "admin","executive_officer","duty_officer","security_officer","super admin"]} />} />
          <Route path="/dispatch-view-In/:id" element={<ProtectedRoute Component={DispatchViewIn} allowedRoles={["admin","security_officer","super admin"]} />} />
          <Route path="/return-items" element={<ProtectedRoute Component={ReturnItemsDetails} allowedRoles={["admin","security_officer","super admin"]} />} />
          <Route path="/view-receiver/:id" element={<ProtectedRoute Component={ViewReceiver} allowedRoles={["admin","security_officer","super admin","user"]} />} />
          

          {/* Admin-only route */}
          <Route path="/admin" element={<ProtectedRoute Component={AdminView} allowedRoles={["admin","super admin"]} />} />
          <Route path="/admin-page" element={<ProtectedRoute Component={AdminPage} allowedRoles={["admin","super admin"]} />} />
          <Route path="/admin-locations" element={<ProtectedRoute Component={AdminLocations} allowedRoles={["admin","super admin"]} />} />
          <Route path="/admin-categories" element={<ProtectedRoute Component={AdminCategories} allowedRoles={["admin","super admin"]} />} />
          <Route path="/user-management" element={<ProtectedRoute Component={userManagement} allowedRoles={["admin","super admin"]} />} />

          
          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to ="/home" />
              ) : (
                <Login setRole={setRole} setUsername={setUsername} setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Signup Route */}
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to={role === "admin" ? "/home" : "/admin"} />
              ) : (
                <Signup setRole={setRole} setUsername={setUsername} setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Home Redirect based on Role */}
          <Route path="/" element={isAuthenticated ? <Navigate to={role === "admin" ? "/login" : "/home"} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
