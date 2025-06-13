import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const ProfileCard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
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
        fetchUser();
    }, []);

    if (!user) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-[500px] bg-gradient-to-r from-blue-100 to-blue-200 text-gray-900 shadow-lg rounded-2xl overflow-hidden p-8 border border-gray-300 transform transition duration-300 hover:scale-105">
                <div className="flex flex-col items-center">
                    <FaUserCircle className="text-7xl text-gray-700 mb-4" />
                    <h2 className="text-3xl font-bold">{user.username}</h2>
                    <p className="text-xl font-medium text-gray-600">{user.designation}</p>
                </div>
                <div className="mt-6 space-y-3 text-gray-700 text-lg">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Service No:</strong> {user.service_no}</p>
                    <p><strong>Section:</strong> {user.section}</p>
                    <p><strong>Group Number:</strong> {user.group_number}</p>
                    <p><strong>Contact:</strong> {user.contact_number}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;