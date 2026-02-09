import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, PlusCircle, List, Trash2, ShieldCheck, Image as ImageIcon, LogOut } from 'lucide-react';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-kpec.vercel.app";
    
    const [activeTab, setActiveTab] = useState('view');
    const [myVenues, setMyVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', tehsil: '', state: '', address: '', image: ''
    });

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) { 
            fetchMyVenues(); 
        } else { 
            navigate('/login'); 
        }
    }, [navigate]);

    const handleSaveVenue = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE}/api/venue/register`, {
                name: venueData.name,
                price: Number(venueData.price),
                image: venueData.image,
                location: {
                    address: venueData.address, 
                    city: venueData.city,
                    tehsil: venueData.tehsil || "N/A", 
                    state: venueData.state
                }
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("✨ Venue Registered Successfully!");
            setVenueData({ name: '', price: '', city: '', tehsil: '', state: '', address: '', image: '' });
            fetchMyVenues();
            setActiveTab('view'); 
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Failed to save"));
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this venue?")) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${API_BASE}/api/venue/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🗑️ Venue Deleted!");
                fetchMyVenues();
            } catch (err) { 
                alert("Delete failed. Please try again."); 
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-cyan-400" size={28} />
                    <span className="font-black tracking-tighter text-xl uppercase italic">Venue<span className="text-cyan-400">Hub</span></span>
                </div>
                <button 
                    onClick={() => {localStorage.clear(); navigate('/login');}} 
                    className="flex items-center gap-2 bg-red-500/5 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all tracking-widest"
                >
                    <LogOut size={14}/> LOGOUT
                </button>
            </nav>

            <div className="max-w-6xl mx-auto p-6 md:p-10">
                
                {/* Tab Navigation */}
                <div className="flex max-w-sm mx-auto gap-2 mb-12 bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800">
                    <button onClick={() => setActiveTab('view')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'view' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}>
                        <List size={16}/> My List
                    </button>
                    <button onClick={() => setActiveTab('add')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'add' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}>
                        <PlusCircle size={16}/> Add New
                    </button>
                </div>

                {/* Tab 1: View Venues */}
                {activeTab === 'view' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myVenues.length > 0 ? (
                            myVenues.map((venue) => (
                                <div key={venue._id} className="bg-zinc-950 rounded-[2.5rem] border border-zinc-900 relative group hover:border-zinc-700 transition-all overflow-hidden shadow-2xl">
                                    <div className="h-48 w-full relative">
                                        <img 
                                            src={venue.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60"} 
                                            alt="venue" 
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                                        <button onClick={() => handleDelete(venue._id)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="p-7">
                                        <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-zinc-100">{venue.name}</h3>
                                        <div className="flex items-center gap-1 text-cyan-400 font-black text-sm mb-4">
                                            <IndianRupee size={14} /> <span>{venue.price} <span className="text-[10px] text-zinc-600 font-bold">/ PER DAY</span></span>
                                        </div>
                                        <div className="text-zinc-500 text-[11px] font-bold flex items-center gap-2 uppercase tracking-wide border-t border-zinc-900 pt-4">
                                            <MapPin size={12} className="text-zinc-700" /> {venue.location?.city}, {venue.location?.state}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-24 bg-zinc-950 rounded-[3rem] border-2 border-dashed border-zinc-900">
                                <List className="mx-auto text-zinc-800 mb-4" size={48} />
                                <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">No venues in your inventory</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Register Form */}
                {activeTab === 'add' && (
                    <div className="max-w-xl mx-auto bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 shadow-2xl relative">
                        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            New Entry
                        </div>
                        <h2 className="text-2xl font-black mb-10 text-white uppercase tracking-tighter italic flex items-center gap-3">
                            Register <span className="text-cyan-400">Venue</span>
                        </h2>
                        <form onSubmit={handleSaveVenue} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Venue Name</label>
                                <input type="text" placeholder="e.g. Grand Imperial Hall" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold transition-all placeholder:text-zinc-700" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Media link</label>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-cyan-400" size={14} />
                                    <input type="text" placeholder="https://image-url.com" className="w-full p-4 pl-12 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold text-cyan-400 transition-all placeholder:text-zinc-700" value={venueData.image} onChange={(e) => setVenueData({...venueData, image: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Daily Price</label>
                                    <div className="relative group">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-cyan-400" size={14} />
                                        <input type="number" placeholder="0.00" className="w-full p-4 pl-12 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold transition-all placeholder:text-zinc-700" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">City</label>
                                    <input type="text" placeholder="CITY" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold transition-all placeholder:text-zinc-700" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">State & Address</label>
                                <input type="text" placeholder="STATE" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold mb-3 transition-all placeholder:text-zinc-700" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                                <textarea placeholder="COMPLETE ADDRESS" rows="3" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500 text-xs font-bold transition-all placeholder:text-zinc-700" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                            </div>
                            
                            <button disabled={loading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-cyan-500/10 mt-4">
                                {loading ? "PROCESSING..." : "REGISTER TO DIRECTORY"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;