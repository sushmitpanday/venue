import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Trash2, ShieldCheck, List, PlusCircle, Users, Mail, Globe, Database, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-ldog.vercel.app";
    
    const [activeTab, setActiveTab] = useState('user-listings');
    const [userVenues, setUserVenues] = useState([]);
    const [adminVenues, setAdminVenues] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', tehsil: '', state: '', address: '', image: ''
    });

    const fetchVenues = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/venue/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserVenues(res.data);
        } catch (err) {
            console.error("Fetch Error:", err.response?.status);
        }
    }, [API_BASE]);

    const fetchAllUsers = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(res.data);
        } catch (err) {
            console.warn("User Route Error");
        }
    }, [API_BASE]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchVenues();
            fetchAllUsers();
        }
    }, [fetchVenues, fetchAllUsers, navigate]);

    const handleSaveVenue = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post(`${API_BASE}/api/venue/register`, {
                name: venueData.name,
                price: Number(venueData.price),
                image: venueData.image,
                location: {
                    address: venueData.address, 
                    city: venueData.city,
                    tehsil: venueData.tehsil || "N/A", 
                    state: venueData.state
                }
            }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            alert("✨ Admin Entry Saved!");
            setAdminVenues(prev => [res.data.venue || res.data, ...prev]);
            setVenueData({ name: '', price: '', city: '', tehsil: '', state: '', address: '', image: '' });
            setActiveTab('admin-records');
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Unauthorized"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Header / Nav */}
            <nav className="bg-zinc-950 px-6 py-4 flex justify-between items-center border-b border-zinc-900 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-red-500" size={24} />
                    <span className="font-black tracking-tight text-lg uppercase">Admin<span className="text-red-500">Panel</span></span>
                </div>
                <button 
                    onClick={() => {localStorage.clear(); navigate('/login');}} 
                    className="flex items-center gap-2 text-zinc-400 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all uppercase tracking-widest"
                >
                    <LogOut size={14}/> Logout
                </button>
            </nav>

            <div className="max-w-6xl mx-auto p-6 md:p-10">
                
                {/* --- NAVIGATION TABS --- */}
                <div className="flex flex-wrap gap-8 mb-10 border-b border-zinc-900">
                    <button onClick={() => setActiveTab('user-listings')} className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'user-listings' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                        <Globe size={16}/> User Listings
                    </button>
                    <button onClick={() => setActiveTab('admin-records')} className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'admin-records' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                        <Database size={16}/> Admin Records
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                        <Users size={16}/> User Management
                    </button>
                    <button onClick={() => setActiveTab('add')} className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'add' ? 'text-green-400 border-b-2 border-green-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                        <PlusCircle size={16}/> Register New
                    </button>
                </div>

                {/* --- CONTENT SECTIONS --- */}
                <div className="animate-in fade-in duration-500">
                    
                    {/* User Listings */}
                    {activeTab === 'user-listings' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userVenues.map((v) => (
                                <VenueCard key={v._id} venue={v} isAdminRecord={false} />
                            ))}
                        </div>
                    )}

                    {/* Admin Records */}
                    {activeTab === 'admin-records' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adminVenues.length > 0 ? adminVenues.map((v) => (
                                <VenueCard key={v._id} venue={v} isAdminRecord={true} />
                            ) ) : (
                                <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                                    <Database size={40} className="mx-auto text-zinc-800 mb-4" />
                                    <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">No Admin records found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Table */}
                    {activeTab === 'users' && (
                        <div className="bg-zinc-950 rounded-[2rem] border border-zinc-900 overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-900/50 text-[10px] uppercase text-purple-400 font-black">
                                        <tr>
                                            <th className="p-6 tracking-[0.2em]">Owner Info</th>
                                            <th className="p-6 tracking-[0.2em]">Account Email</th>
                                            <th className="p-6 tracking-[0.2em]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-bold divide-y divide-zinc-900">
                                        {allUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-zinc-900/30 transition-colors">
                                                <td className="p-6 flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-xs uppercase border border-purple-500/20">{user.name?.[0]}</div>
                                                    <span className="text-zinc-200">{user.name}</span>
                                                </td>
                                                <td className="p-6 text-zinc-500">
                                                    <div className="flex items-center gap-2"><Mail size={14} className="text-zinc-700"/> {user.email}</div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="bg-green-500/5 text-green-500 border border-green-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Verified</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Add Venue Form */}
                    {activeTab === 'add' && (
                        <div className="max-w-xl mx-auto bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 relative shadow-2xl">
                             <form onSubmit={handleSaveVenue} className="space-y-6">
                                <h2 className="text-white font-black uppercase text-xl mb-8 flex items-center gap-3 italic">
                                    <PlusCircle size={24} className="text-green-500"/> Add Record
                                </h2>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">Venue Essentials</label>
                                    <input type="text" placeholder="Venue Title" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                                    <input type="text" placeholder="Image URL (Direct link)" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700" value={venueData.image} onChange={(e) => setVenueData({...venueData, image: e.target.value})} />
                                    <input type="number" placeholder="Daily Price (INR)" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700 font-bold" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                                </div>
                                
                                <div className="space-y-4 pt-4">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">Location Details</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="City" className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                                        <input type="text" placeholder="State" className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                                    </div>
                                    <textarea placeholder="Complete Street Address" rows="3" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-green-500 transition-all placeholder:text-zinc-700" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                                </div>

                                <button disabled={loading} className="w-full bg-green-500 text-black py-5 rounded-2xl font-black uppercase text-[12px] hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-500/20 mt-6 tracking-tighter">
                                    {loading ? "PROCESSING..." : "REGISTER TO DATABASE"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const VenueCard = ({ venue, isAdminRecord }) => (
    <div className={`bg-zinc-950 rounded-[2rem] border ${isAdminRecord ? 'border-yellow-500/30 shadow-yellow-500/5' : 'border-zinc-900 shadow-xl'} overflow-hidden group hover:border-zinc-700 transition-all`}>
        <div className="h-44 relative overflow-hidden">
            <img src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[40%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100" alt="venue" />
            {isAdminRecord && <div className="absolute top-4 left-4 bg-yellow-500 text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Admin Record</div>}
        </div>
        <div className="p-6 bg-gradient-to-b from-zinc-950 to-black">
            <h3 className="text-sm font-black uppercase truncate tracking-tight text-zinc-100 mb-1">{venue.name}</h3>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-cyan-400 font-black">
                    <IndianRupee size={12}/>
                    <span className="text-sm">{venue.price}</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{venue.location?.city}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;