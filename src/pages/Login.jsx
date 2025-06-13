import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import slt from "../assets/SLTMobitel_logo.svg";
import sltHome from "../assets/sltHome.webp";
import PopupLogout from "./PopupLogout";

const Login = ({ setRole, setUsername, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      console.log("Login response:", res.data);
      const { username, role, token } = res.data;
      if (!username) {
        console.error("Username not found in response:", res.data);
        throw new Error("Username not found in response");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      setRole(role);
      setUsername(username);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole(null);
    setUsername(null);
    setIsAuthenticated(false);
    setShowLogoutPopup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative" style={{ backgroundImage: `url(${sltHome})` }}>
      {showLogoutPopup && <PopupLogout onConfirm={confirmLogout} onCancel={() => setShowLogoutPopup(false)} />}
      
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/4 -translate-y-1/4"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 0.5, scale: 1 }} 
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/4 translate-y-1/4"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 0.5, scale: 1 }} 
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="bg-white bg-opacity-75 backdrop-blur-lg rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src={slt} alt="SLT Logo" className="w-25 h-25" />
          <h1 className="text-2xl font-semibold text-blue-900">SLT GATE PASS</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="SLT"
            >
              <option value="SLT">SLT</option>
              <option value="User">NON SLT</option>
            </select>
          </motion.div>
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700">User Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter User Email"
            />
          </motion.div>
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Password"
            />
          </motion.div>
          <div className="flex justify-center">
            <motion.button
              type="submit"
              className="w-32 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-600">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  setRole: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
