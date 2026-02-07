import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserRegister = () => {
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
    const [users, setUsers] = useState([]);
    
    // Environment variable check
    // Localhost ko hata do aur direct apna live backend link likh do
const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-a6dy.vercel.app";

    const fetchUsers = async () => {
        try {
            // GET request to fetch users list
            const res = await axios.get(`${API_BASE}/api/auth/user/register`);
            setUsers(Array.isArray(res.data) ? res.data : (res.data.users || []));
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // POST request to save user
            await axios.post(`${API_BASE}/api/auth/user/register`, {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password // 'p' small kar diya hai
            });

            alert("✅ User Saved Successfully!");
            setFormData({ fullname: '', email: '', password: '' }); 
            fetchUsers(); 
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Check Console"));
        }
    };

    return (
        <div className="min-h-screen bg-[#031930] p-10 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center text-blue-400">User Management</h2>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-[#0a2540] p-6 shadow-2xl rounded-xl border border-blue-900/50">
                        <h3 className="text-lg font-bold mb-4 border-b border-blue-800 pb-2 text-blue-300">Register New User</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Full Name" required
                                className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none text-white"
                                value={formData.fullname}
                                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="Email Address" required
                                className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none text-white"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <input 
                                type="password" placeholder="Password" required
                                className="w-full p-2 bg-[#031930] border border-blue-800 rounded outline-none text-white"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                                Save to Database
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#0a2540] p-6 shadow-2xl rounded-xl border border-blue-900/50">
                        <h3 className="text-lg font-bold mb-4 border-b border-blue-800 pb-2 text-blue-300">Users in Atlas</h3>
                        <div className="max-h-64 overflow-y-auto">
                            {users.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-blue-400">
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user._id || index} className="border-b border-blue-900/30">
                                                <td className="p-3">{user.fullname}</td>
                                                <td className="p-3 text-gray-400">{user.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className="text-center py-10 text-gray-500">No users found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;