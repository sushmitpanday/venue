import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-xqee.vercel.app";

const UserRegister = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '', email: '', password: '',
        name: '', price: '', city: '', tehsil: '', state: '', address: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOnboard = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Data ko backend ke 'hotelDetails' format mein pack karna
            const payload = {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                hotelDetails: {
                    name: formData.name,
                    price: formData.price,
                    location: {
                        address: formData.address,
                        city: formData.city,
                        tehsil: formData.tehsil,
                        state: formData.state
                    }
                }
            };

            // SINGLE API CALL
            const res = await axios.post(`${API_BASE}/api/auth/owner/register`, payload);

            alert("✨ " + res.data.message);
            window.location.reload(); 
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Registration fail ho gayi"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020c1b] flex items-center justify-center p-4 md:p-10 text-white font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl w-full bg-[#0a192f] rounded-[2.5rem] shadow-2xl border border-blue-900/40 p-8 md:p-12">
                <form onSubmit={handleOnboard}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-blue-400">Owner & Hotel Registration</h2>
                        <p className="text-gray-400">Ek hi baar mein apna account aur hotel setup karein</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Owner Side */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-blue-300">Personal Details</h3>
                            <Input label="Full Name" name="fullname" onChange={handleChange} required />
                            <Input label="Email" name="email" type="email" onChange={handleChange} required />
                            <Input label="Password" name="password" type="password" onChange={handleChange} required />
                        </div>

                        {/* Hotel Side */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-cyan-400">Hotel Details</h3>
                            <Input label="Hotel Name" name="name" onChange={handleChange} required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Price" name="price" type="number" onChange={handleChange} required />
                                <Input label="City" name="city" onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Tehsil" name="tehsil" onChange={handleChange} />
                                <Input label="State" name="state" onChange={handleChange} required />
                            </div>
                            <textarea name="address" rows="2" placeholder="Full Address" className="w-full p-4 bg-[#112240] border border-blue-900/50 rounded-xl outline-none" onChange={handleChange} required />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full mt-10 bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all">
                        {loading ? "Registering..." : "Submit Registration"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-xs text-gray-500 uppercase mb-1">{label}</label>
        <input {...props} className="w-full p-4 bg-[#112240] border border-blue-900/50 rounded-xl text-white outline-none focus:border-blue-400" />
    </div>
);

export default UserRegister;