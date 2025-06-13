import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const closeModal = () => setEditingUser(null);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">User Management</h1>

      {/* Responsive table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border">Username</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Designation</th>
              <th className="py-3 px-4 border">Service No</th>
              <th className="py-3 px-4 border">Section</th>
              <th className="py-3 px-4 border">Branch</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border">{u.username}</td>
                <td className="py-3 px-4 border">{u.email}</td>
                <td className="py-3 px-4 border">{u.role}</td>
                <td className="py-3 px-4 border">{u.designation}</td>
                <td className="py-3 px-4 border">{u.service_no}</td>
                <td className="py-3 px-4 border">{u.section}</td>
                <td className="py-3 px-4 border">{u.branch_location}</td>
                <td className="py-3 px-4 border">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 text-xs md:text-sm"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs md:text-sm"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="username"
                value={editingUser.username}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Username"
              />
              <input
                name="email"
                value={editingUser.email}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Email"
              />
              <input
                name="designation"
                value={editingUser.designation}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Designation"
              />
              <input
                name="service_no"
                value={editingUser.service_no}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Service No"
              />
              <input
                name="section"
                value={editingUser.section}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Section"
              />
              <input
                name="branch_location"
                value={editingUser.branch_location}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
                placeholder="Branch Location"
              />
              <select
                name="role"
                value={editingUser.role}
                onChange={handleEditChange}
                className="block p-2 border rounded w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super admin">Super Admin</option>
                <option value="executive_officer">Executive Officer</option>
                <option value="duty_officer">Duty Officer</option>
                <option value="security_officer">Security Officer</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-3 rounded w-full hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
