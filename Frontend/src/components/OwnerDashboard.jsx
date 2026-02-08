import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Hotel, MapPin, IndianRupee, PlusCircle, LogOut, LayoutDashboard, Users, List, Trash2, ShieldCheck } from 'lucide-react';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-xqee.vercel.app";
    
    // --- States ---
    const [activeTab, setActiveTab] = useState('view'); // view, add, users
    const [myVenues, setMyVenues] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', tehsil: '', state: '', address: ''
    });

    // --- 1. Fetch Owner's Venues ---
    const fetchMyVenues = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/venue/my-venues`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyVenues(res.data);
        } catch (err) {
            console.error("Venues fetch error", err);
        }
    };

    // --- 2. Fetch All Users List ---
    const fetchAllUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(res.data);
        } catch (err) {
            console.error("Users fetch error", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchMyVenues();
            fetchAllUsers();
        } else {
            navigate('/login');
        }
    }, []);

    // --- 3. Save New Venue ---
    const handleSaveVenue = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE}/api/venue/register`, {
                name: venueData.name,
                price: Number(venueData.price), 
                location: {
                    address: venueData.address, city: venueData.city,
                    tehsil: venueData.tehsil, state: venueData.state
                }
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("✨ Hotel Registered Successfully!");
            setVenueData({ name: '', price: '', city: '', tehsil: '', state: '', address: '' });
            fetchMyVenues();
            setActiveTab('view'); 
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Failed to save"));
        } finally {
            setLoading(false);
        }
    };

    // --- 4. Delete Venue ---
    const handleDelete = async (id) => {
        if (window.confirm("Pakka delete karna hai?")) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${API_BASE}/api/venue/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🗑️ Deleted!");
                fetchMyVenues();
            } catch (err) {
                alert("Delete fail ho gaya");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#031930] text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-[#052b52] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-cyan-400" size={28} />
                    <span className="font-black tracking-tighter text-xl uppercase">Venue<span className="text-cyan-400">Hub</span></span>
                </div>
                <button onClick={() => {localStorage.clear(); navigate('/login');}} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                    LOGOUT
                </button>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                {/* Dashboard Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-[#052b52] p-2 rounded-2xl border border-white/5">
                    <button onClick={() => setActiveTab('view')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'view' ? 'bg-cyan-500 text-[#031930]' : 'text-gray-400 hover:bg-white/5'}`}>
                        <List size={16}/> My Venues
                    </button>
                    <button onClick={() => setActiveTab('add')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'add' ? 'bg-cyan-500 text-[#031930]' : 'text-gray-400 hover:bg-white/5'}`}>
                        <PlusCircle size={16}/> Add New
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'users' ? 'bg-cyan-500 text-[#031930]' : 'text-gray-400 hover:bg-white/5'}`}>
                        <Users size={16}/> Users List
                    </button>
                </div>

                {/* Tab 1: Venue Cards */}
                {activeTab === 'view' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myVenues.map((venue) => (
                            <div key={venue._id} className="bg-[#052b52] p-6 rounded-3xl border border-white/5 relative group hover:border-cyan-500/50 transition-all">
                                <button onClick={() => handleDelete(venue._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                                <div className="bg-cyan-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-cyan-400">
                                    <Hotel size={24} />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-tight mb-1">{venue.name}</h3>
                                <div className="flex items-center gap-1 text-cyan-400 font-bold mb-3">
                                    <IndianRupee size={14} /> <span>{venue.price} / Day</span>
                                </div>
                                <div className="text-gray-400 text-xs flex items-center gap-1 mb-4">
                                    <MapPin size={12} /> {venue.location?.city}, {venue.location?.state}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase border-t border-white/5 pt-3">
                                    {venue.location?.address}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab 2: Register Form */}
                {activeTab === 'add' && (
                    <div className="max-w-xl mx-auto bg-[#0a2540] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <h2 className="text-xl font-bold mb-8 text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <PlusCircle /> New Registration
                        </h2>
                        <form onSubmit={handleSaveVenue} className="space-y-4">
                            <input type="text" placeholder="HOTEL NAME" className="w-full p-4 bg-[#031930] border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-xs" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-4 text-gray-500" size={14} />
                                <input type="number" placeholder="PRICE" className="w-full p-4 pl-10 bg-[#031930] border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-xs" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="CITY" className="p-4 bg-[#031930] border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-xs" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                                <input type="text" placeholder="STATE" className="p-4 bg-[#031930] border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-xs" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                            </div>
                            <textarea placeholder="COMPLETE ADDRESS" rows="3" className="w-full p-4 bg-[#031930] border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-xs" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                            <button disabled={loading} className="w-full bg-cyan-500 text-[#031930] py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                                {loading ? "SAVING..." : "REGISTER NOW"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab 3: Users Table */}
                {activeTab === 'users' && (
                    <div className="bg-[#052b52] rounded-[2rem] border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5">
                                <tr className="text-cyan-400 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="p-6">Customer Name</th>
                                    <th className="p-6">Email</th>
                                    <th className="p-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-white/5">
                                {allUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 font-medium">{u.name || "User"}</td>
                                        <td className="p-6 text-gray-400">{u.email}</td>
                                        <td className="p-6"><span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Verified</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;