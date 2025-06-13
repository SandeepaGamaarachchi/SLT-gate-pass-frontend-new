import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "/src/assets/SLTMobitel_logo.svg";
import PopupLogout from "../pages/PopupLogout";

const Navbar = ({ logout, role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setLogoutPopupOpen(false);
    logout();
  };

  const handleCancelLogout = () => {
    setLogoutPopupOpen(false);
  };

  // Define navigation links based on roles
  const getNavLinks = () => {
    const baseLinks = [
      { path: "/home", label: "Home", roles: ["user", "admin", "executive_officer", "duty_officer", "security_officer","super admin"] },
      { path: "/new-request", label: "New Request", roles: ["user", "admin", "executive_officer", "duty_officer", "security_officer","super admin"] },
      { path: "/my-request", label: "My Requests", roles: ["user", "admin", "executive_officer", "duty_officer", "security_officer","super admin"] },
      { path: "/executive-approve", label: "Executive Approve", roles: ["admin", "executive_officer","super admin"] },
      { path: "/verify", label: "Verify", roles: ["admin", "duty_officer","super admin"] },
      { path: "/receiver", label: "Receiver", roles: ["user", "admin", "security_officer","duty_officer","executive_officer","super admin"] },
      { path: "/dispatch", label: "Dispatch", roles: ["admin", "security_officer","super admin"] },
      { path: "/item-tracker", label: "Item Tracker", roles: ["admin", "security_officer","super admin"] },
      { path: "/admin", label: "Admin", roles: ["admin","super admin"] }
    ];

    return baseLinks.filter(link => link.roles.includes(role));
  };

  return (
    <nav className="p-4 flex justify-between items-center shadow-lg text-white">
      {/* Logo & Title */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold ml-4 text-[#1B3D81]">SLT Gate Pass</h1>
      </div>

      {/* Navigation Links */}
      <ul className={`flex-col md:flex-row md:flex md:items-center gap-2 md:gap-4 mt-4 md:mt-0`}>
        {getNavLinks().map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={`block px-4 py-2 rounded text-center font-medium shadow-md transition-all text-sm md:text-base ${
                location.pathname === path
                  ? "bg-[#1B3D81] text-white"
                  : "bg-white text-[#1b3d81] hover:bg-[#1B3D81] hover:text-white"
              }`}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* User Dropdown & Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <NavLink to="/notifications" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ml-2">
          <Bell size={20} className="text-[#1B3D81]" />
        </NavLink>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <User size={20} className="text-[#1B3D81]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-[#1B3D81]">
                Profile
              </NavLink>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1B3D81]"
                onClick={() => setLogoutPopupOpen(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PopupLogout Confirmation */}
      {isLogoutPopupOpen && (
        <PopupLogout
          onConfirm={handleLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;