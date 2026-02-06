import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './auth.css'; 

const UserRegister = () => {
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
    const [users, setUsers] = useState([]);
    // Agar environment variable milta hai toh wo use hoga, warna localhost (development ke liye)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // 1. Data Fetch karne ka function
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/user/register`);
            // Backend agar seedha array bhej raha hai toh res.data, warna res.data.users
            setUsers(Array.isArray(res.data) ? res.data : (res.data.users || []));
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // 2. Form Submit handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/api/auth/user/register`, {
                fullname: formData.fullname,
                email: formData.email,
                Password: formData.password // Backend key match
            });

            alert("✅ User Saved in Atlas!");
            setFormData({ fullname: '', email: '', password: '' }); // Form clear
            fetchUsers(); // List refresh
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Check Console"));
        }
    };

    return (
        <div className="min-h-screen bg-[#031930] p-10 font-sans text-white">
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-400">User Management</h2>
        
        <div className="grid md:grid-cols-2 gap-10">
            {/* --- REGISTER FORM --- */}
            <div className="bg-[#0a2540] p-6 shadow-2xl rounded-xl border border-blue-900/50">
                <h3 className="text-lg font-bold mb-4 border-b border-blue-800 pb-2 text-blue-300">Register New User</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Full Name" required
                        className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                        value={formData.fullname}
                        onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                    />
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-all">
                        Save to Database
                    </button>
                </form>
            </div>

            {/* --- LIVE USER LIST --- */}
            <div className="bg-[#0a2540] p-6 shadow-2xl rounded-xl border border-blue-900/50">
                <h3 className="text-lg font-bold mb-4 border-b border-blue-800 pb-2 text-blue-300">Users in Atlas</h3>
                <div className="max-h-64 overflow-y-auto">
                    {users.length > 0 ? (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#102a43] sticky top-0">
                                <tr>
                                    <th className="p-3 text-blue-400">Name</th>
                                    <th className="p-3 text-blue-400">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id || index} className="border-b border-blue-900/30 hover:bg-blue-900/20">
                                        <td className="p-3 text-gray-200">{user.fullname}</td>
                                        <td className="p-3 text-gray-400">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-10">No users found in database.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
</div>
    );
};

export default UserRegister;