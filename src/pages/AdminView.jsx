import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaMapMarkerAlt, FaTags } from 'react-icons/fa';
import axios from 'axios';

const AdminView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
          Welcome to Admin as <span className="text-blue-600 font-extrabold">{user.username}</span>
        </h1>
        
        <div className="border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full p-8 mt-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h2>
          
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            {/* Add Users Button */}
            <button
              onClick={() => navigate('/admin-page')}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-900 text-white text-xl font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
            >
              <FaUserPlus className="text-xl" />
              Add Users
            </button>

            {user.role === 'super admin' && (
              <button
                onClick={() => navigate('/user-management')}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-900 text-white text-xl font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
              >
                <FaUserPlus className="text-xl" />
                user Management
              </button>
            )}

            {/* Add Location Button */}
            <button
              onClick={() => navigate('/admin-locations')}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-900 text-white text-xl font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
            >
              <FaMapMarkerAlt className="text-xl" />
              Add Locations
            </button>

            {/* Add Categories Button */}
            <button
              onClick={() => navigate('/admin-categories')}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-900 text-white text-xl font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
            >
              <FaTags className="text-xl" />
              Add Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;