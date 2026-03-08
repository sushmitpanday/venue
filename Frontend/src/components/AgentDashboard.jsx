import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, PlusCircle, List, Trash2, Edit3, X, Image as ImageIcon, LogOut, LayoutDashboard, UploadCloud, Loader2, Crown, Users, DoorOpen, ShieldCheck } from 'lucide-react';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-8.onrender.com";
    
    const [activeTab, setActiveTab] = useState('view'); 
    const [myVenues, setMyVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agentName, setAgentName] = useState("Agent");
    const [editingVenue, setEditingVenue] = useState(null); 
    
    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', state: '', pincode: '', address: '', images: [], description: '',
        rooms: '', capacity: ''
    });

    const handleSubscription = () => {
        alert("Redirecting to Premium Plans! ✨");
    };

    const handleImageChange = (e, isEditing = false) => {
        const files = Array.from(e.target.files);
        const currentImagesCount = isEditing ? (editingVenue.images?.length || 0) : venueData.images.length;

        if (files.length + currentImagesCount > 5) {
            alert("You can only send 5 photos at a time.");
            return;
        }

        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(results => {
            if (isEditing) {
                setEditingVenue({ ...editingVenue, images: [...(editingVenue.images || []), ...results] });
            } else {
                setVenueData({ ...venueData, images: [...venueData.images, ...results] });
            }
        });
    };

    const fetchAgentVenues = async () => {
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
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = localStorage.getItem('userRole');
        
        if (token && role === 'agent') { 
            setAgentName(user.fullname || user.name || "Agent");
            fetchAgentVenues(); 
        } else { 
            navigate('/agent-login'); 
        }
    }, [navigate]);

    const handleSaveVenue = async (e) => {
        e.preventDefault();
        if (venueData.images.length === 0) return alert("At least post one image, man!");
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE}/api/venue/register`, {
                name: venueData.name,
                price: Number(venueData.price),
                rooms: Number(venueData.rooms),
                capacity: Number(venueData.capacity),
                images: venueData.images, 
                description: venueData.description,
                location: {
                    address: venueData.address, 
                    city: venueData.city,
                    state: venueData.state,
                    pincode: venueData.pincode
                }
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("✨ Venue Listed Successfully!");
            setVenueData({ name: '', price: '', city: '', state: '', pincode: '', address: '', images: [], description: '', rooms: '', capacity: '' });
            fetchAgentVenues();
            setActiveTab('view'); 
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Failed to save"));
        } finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const updatePayload = {
                ...editingVenue,
                rooms: Number(editingVenue.rooms),
                capacity: Number(editingVenue.capacity),
                location: {
                    address: editingVenue.location?.address || editingVenue.address,
                    city: editingVenue.location?.city || editingVenue.city,
                    state: editingVenue.location?.state || editingVenue.state,
                    pincode: editingVenue.location?.pincode || editingVenue.pincode
                }
            };
            await axios.put(`${API_BASE}/api/venue/${editingVenue._id}`, updatePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Property Updated!");
            setEditingVenue(null);
            fetchAgentVenues();
        } catch (err) {
            alert("❌ Update failed!");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure about deleting this?")) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${API_BASE}/api/venue/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchAgentVenues();
            } catch (err) { alert("Delete failed."); }
        }
    };

    return (
        <div className="min-h-screen bg-pink-400 text-zinc-900 font-sans">
            {/* Navbar */}
            <nav className="border-b border-pink-500/30 bg-white/20 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-pink-200 shadow-sm">
                        <LayoutDashboard className="text-pink-500" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black tracking-tighter text-lg uppercase leading-none text-white">AGENT<span className="text-zinc-900">PORTAL</span></span>
                        <span className="text-[9px] font-bold text-zinc-800 tracking-[0.2em] uppercase">Welcome, {agentName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleSubscription} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-pink-600 transition-all tracking-widest group shadow-lg">
                        <Crown size={14} className="group-hover:rotate-12 transition-transform text-yellow-400"/> SUBSCRIBE
                    </button>
                    <button onClick={() => {localStorage.clear(); navigate('/agent-login');}} className="flex items-center justify-center w-10 h-10 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md">
                        <LogOut size={18}/>
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 md:p-10">
                {/* Tab Navigation */}
                <div className="flex max-w-sm mx-auto gap-2 mb-12 bg-white/30 p-1.5 rounded-[1.5rem] border border-white/40">
                    <button onClick={() => setActiveTab('view')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'view' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-800 hover:bg-white/40'}`}>
                        <List size={16}/> My Venues
                    </button>
                    <button onClick={() => setActiveTab('add')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'add' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-800 hover:bg-white/40'}`}>
                        <PlusCircle size={16}/> Add New
                    </button>
                </div>

                {/* VIEW LISTINGS */}
                {activeTab === 'view' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myVenues.length > 0 ? myVenues.map((venue) => (
                            <div key={venue._id} className="bg-white rounded-[2.5rem] border border-pink-100 overflow-hidden group hover:shadow-2xl transition-all">
                                <div className="h-48 w-full relative bg-zinc-100">
                                    <img src={venue.images?.[0] || venue.image} alt="venue" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => setEditingVenue(venue)} className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-zinc-900 hover:bg-pink-500 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(venue._id)} className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase">
                                        {venue.images?.length || 1} Photos
                                    </div>
                                </div>
                                <div className="p-7">
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-zinc-900">{venue.name}</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4 border-b border-pink-50 pb-4">
                                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                                            <DoorOpen size={14} className="text-pink-500" /> {venue.rooms || 0} ROOMS
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                                            <Users size={14} className="text-pink-500" /> {venue.capacity || 0} GUESTS
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-pink-600 font-black text-sm mb-4">
                                        <IndianRupee size={14} /> <span>{venue.price?.toLocaleString('en-IN')} <span className="text-[10px] text-zinc-400 font-bold">/ DAY</span></span>
                                    </div>
                                    <div className="text-zinc-500 text-[11px] font-bold flex items-center gap-2 uppercase tracking-wide">
                                        <MapPin size={12} className="text-pink-400" /> {venue.location?.city || "N/A"}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-white">
                                <PlusCircle className="mx-auto text-white mb-4" size={48} />
                                <p className="text-zinc-800 text-xs font-black uppercase tracking-[0.3em]">No properties listed yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ADD VENUE FORM */}
                {activeTab === 'add' && (
                    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-2xl relative">
                        <h2 className="text-2xl font-black mb-10 text-zinc-900 uppercase italic flex items-center gap-3 border-b-4 border-pink-400 pb-2 w-fit">Register <span className="text-pink-500">Venue</span></h2>
                        <form onSubmit={handleSaveVenue} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Venue Name</label>
                                <input type="text" placeholder="e.g. Grand Imperial Resort" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl outline-none focus:border-pink-500 text-xs font-bold transition-all" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Total Rooms</label>
                                    <input type="number" placeholder="0" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.rooms} onChange={(e) => setVenueData({...venueData, rooms: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Guest Capacity</label>
                                    <input type="number" placeholder="0" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.capacity} onChange={(e) => setVenueData({...venueData, capacity: e.target.value})} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Images (Max 5)</label>
                                <div className="grid grid-cols-5 gap-3">
                                    {venueData.images.map((img, i) => (
                                        <div key={i} className="h-20 rounded-xl overflow-hidden border border-pink-100 relative group">
                                            <img src={img} className="w-full h-full object-cover" alt="preview" />
                                            <button type="button" onClick={() => setVenueData({...venueData, images: venueData.images.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white"><X size={18}/></button>
                                        </div>
                                    ))}
                                    {venueData.images.length < 5 && (
                                        <label className="h-20 flex flex-col items-center justify-center bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-500 transition-all">
                                            <UploadCloud size={20} className="text-pink-400" />
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Price / Day (₹)</label>
                                    <input type="number" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">City</label>
                                    <input type="text" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Pincode</label>
                                    <input type="text" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.pincode} onChange={(e) => setVenueData({...venueData, pincode: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-pink-500 uppercase ml-1">State</label>
                                    <input type="text" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Full Address</label>
                                <textarea rows="2" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold outline-none" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-500 uppercase ml-1">Description</label>
                                <textarea rows="3" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl focus:border-pink-500 text-xs font-bold outline-none" value={venueData.description} onChange={(e) => setVenueData({...venueData, description: e.target.value})} required></textarea>
                            </div>

                            <button disabled={loading} className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-xl">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "LIST PROPERTY NOW"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {editingVenue && (
                <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg border border-pink-100 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black uppercase text-lg italic text-pink-500">Update Listing</h2>
                            <button onClick={() => setEditingVenue(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {editingVenue.images?.map((img, idx) => (
                                    <div key={idx} className="h-16 rounded-xl overflow-hidden border border-pink-50 relative group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setEditingVenue({...editingVenue, images: editingVenue.images.filter((_, i) => i !== idx)})} className="absolute inset-0 bg-red-500/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={16}/></button>
                                    </div>
                                ))}
                                {editingVenue.images?.length < 5 && (
                                    <label className="h-16 flex items-center justify-center bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer">
                                        <PlusCircle size={20} className="text-pink-400" />
                                        <input type="file" multiple className="hidden" onChange={(e) => handleImageChange(e, true)} />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Rooms" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs font-bold outline-none focus:border-pink-500" value={editingVenue.rooms} onChange={e => setEditingVenue({...editingVenue, rooms: e.target.value})} />
                                <input type="number" placeholder="Capacity" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs font-bold outline-none focus:border-pink-500" value={editingVenue.capacity} onChange={e => setEditingVenue({...editingVenue, capacity: e.target.value})} />
                            </div>

                            <input placeholder="Name" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs font-bold outline-none focus:border-pink-500" value={editingVenue.name} onChange={e => setEditingVenue({...editingVenue, name: e.target.value})} />
                            <input placeholder="Price" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs font-bold outline-none focus:border-pink-500" value={editingVenue.price} onChange={e => setEditingVenue({...editingVenue, price: e.target.value})} />
                            <textarea placeholder="Description" rows="3" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs font-bold outline-none focus:border-pink-500" value={editingVenue.description} onChange={e => setEditingVenue({...editingVenue, description: e.target.value})} />
                            
                            <button disabled={loading} type="submit" className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-600 transition-all flex items-center justify-center shadow-lg">
                                {loading ? <Loader2 className="animate-spin" size={16}/> : "CONFIRM UPDATES"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;