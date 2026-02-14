import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Trash2, Edit3, X, PlusCircle, LogOut, Globe, ShieldCheck, Database, Image as ImageIcon } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-q34h.vercel.app";
    
    const [activeTab, setActiveTab] = useState('user-listings');
    const [userVenues, setUserVenues] = useState([]);
    const [agentVenues, setAgentVenues] = useState([]);
    const [adminVenues, setAdminVenues] = useState([]);
    const [editingVenue, setEditingVenue] = useState(null);
    const [loading, setLoading] = useState(false);

    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', state: '', address: '', image: ''
    });

    // IMAGE SELECT LOGIC
    const handleImageChange = (e, isEditing = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEditing) {
                    setEditingVenue({ ...editingVenue, image: reader.result });
                } else {
                    setVenueData({ ...venueData, image: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchVenues = useCallback(async (role = 'all') => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/admin/filter-venues?role=${role}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data;
            if (role !== 'all') {
                if (role === 'admin') setAdminVenues(data);
                else if (role === 'agent') setAgentVenues(data);
                else if (role === 'user') setUserVenues(data);
            } else {
                const adminData = data.filter(v => !v.ownerId);
                const agentData = data.filter(v => v.ownerId && typeof v.ownerId === 'object' && v.ownerId.role?.toLowerCase() === 'agent');
                const userData = data.filter(v => v.ownerId && (!v.ownerId.role || v.ownerId.role?.toLowerCase() !== 'agent'));
                setAdminVenues(adminData);
                setAgentVenues(agentData);
                setUserVenues(userData);
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    }, [API_BASE]);

    useEffect(() => { fetchVenues('all'); }, [fetchVenues]);

    const handleAddVenue = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE}/api/venue/register`, {
                name: venueData.name,
                price: Number(venueData.price),
                image: venueData.image,
                location: { address: venueData.address, city: venueData.city, state: venueData.state }
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("✨ Venue Added Successfully!");
            setVenueData({ name: '', price: '', city: '', state: '', address: '', image: '' });
            fetchVenues('admin'); 
            setActiveTab('admin-records'); 
        } catch (err) { alert("❌ Error: " + (err.response?.data?.message || "Something went wrong")); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bhai, pakka delete karna hai?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE}/api/venue/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchVenues();
        } catch (err) { alert("Delete failed!"); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_BASE}/api/venue/${editingVenue._id}`, editingVenue, { headers: { Authorization: `Bearer ${token}` } });
            setEditingVenue(null);
            fetchVenues();
        } catch (err) { alert("Update failed!"); }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <nav className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-red-500" size={24} />
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Admin<span className="text-red-600">Panel</span></h1>
                </div>
                <button onClick={() => {localStorage.clear(); navigate('/login');}} className="text-[10px] font-bold border border-zinc-800 px-4 py-2 rounded-full hover:bg-red-600 transition-all uppercase flex items-center gap-2">
                    <LogOut size={14}/> Logout
                </button>
            </nav>

            <div className="flex gap-8 mb-10 overflow-x-auto border-b border-zinc-900 pb-2">
                {[
                    { id: 'user-listings', label: 'User Data', role: 'user', icon: <Globe size={14}/> },
                    { id: 'agent-listings', label: 'Agent Data', role: 'agent', icon: <ShieldCheck size={14}/> },
                    { id: 'admin-records', label: 'Admin Data', role: 'admin', icon: <Database size={14}/> },
                    { id: 'add-new', label: 'Add Venue', role: null, icon: <PlusCircle size={14}/> }
                ].map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.role) fetchVenues(tab.role); }} className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-600'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab !== 'add-new' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'user-listings' && userVenues.map(v => <VenueCard key={v._id} venue={v} onDelete={handleDelete} onEdit={setEditingVenue} />)}
                        {activeTab === 'agent-listings' && agentVenues.map(v => <VenueCard key={v._id} venue={v} onDelete={handleDelete} onEdit={setEditingVenue} tag="Agent" />)}
                        {activeTab === 'admin-records' && adminVenues.map(v => <VenueCard key={v._id} venue={v} onDelete={handleDelete} onEdit={setEditingVenue} tag="Admin" />)}
                    </div>
                )}

                {activeTab === 'add-new' && (
                    <div className="max-w-xl mx-auto bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 shadow-2xl">
                        <form onSubmit={handleAddVenue} className="space-y-6">
                            <h2 className="text-white font-black uppercase text-xl mb-8 flex items-center gap-3 italic"><PlusCircle size={24} className="text-green-500"/> Register New</h2>
                            <input type="text" placeholder="Venue Title" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-cyan-500 transition-all" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                            
                            {/* PHOTO SELECT FROM GALLERY */}
                            <label className="flex flex-col items-center justify-center w-full h-32 bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl cursor-pointer hover:border-cyan-500 overflow-hidden relative">
                                {venueData.image ? (
                                    <img src={venueData.image} alt="preview" className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="text-zinc-600 mb-2" size={24} />
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Image</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                            </label>

                            <input type="number" placeholder="Price" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none focus:border-cyan-500 font-bold" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="City" className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                                <input type="text" placeholder="State" className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                            </div>
                            <textarea placeholder="Full Address" rows="3" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs outline-none" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                            <button disabled={loading} className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-[12px] hover:bg-cyan-400 transition-all">{loading ? "SAVING..." : "REGISTER TO DATABASE"}</button>
                        </form>
                    </div>
                )}
            </div>

            {editingVenue && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
                    <div className="bg-zinc-950 p-8 rounded-[2.5rem] w-full max-w-md border border-zinc-800 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black uppercase text-lg italic tracking-tighter">Edit <span className="text-cyan-400">Venue</span></h2>
                            <button onClick={() => setEditingVenue(null)} className="text-zinc-500 hover:text-white"><X/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-5">
                            <input className="w-full p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-sm" value={editingVenue.name} onChange={e => setEditingVenue({...editingVenue, name: e.target.value})} />
                            
                            {/* EDIT MODAL PHOTO SELECT */}
                            <label className="flex flex-col items-center justify-center w-full h-24 bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl cursor-pointer hover:border-cyan-500 overflow-hidden relative">
                                <img src={editingVenue.image} alt="preview" className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center"><ImageIcon size={20}/></div>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, true)} />
                            </label>

                            <input className="w-full p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-sm" value={editingVenue.price} onChange={e => setEditingVenue({...editingVenue, price: e.target.value})} />
                            <button type="submit" className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const VenueCard = ({ venue, tag, onDelete, onEdit }) => (
    <div className="bg-zinc-950 rounded-[2rem] border border-zinc-900 overflow-hidden relative group hover:border-zinc-700 transition-all">
        <div className="absolute top-4 right-4 flex gap-2 z-10 ">
            <button onClick={() => onEdit(venue)} className="bg-zinc-800 p-2 rounded-xl text-cyan-400 hover:bg-cyan-400 hover:text-black"><Edit3 size={14}/></button>
            <button onClick={() => onDelete(venue._id)} className="bg-zinc-800 p-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-black"><Trash2 size={14}/></button>
        </div>
        <div className="h-44 bg-zinc-900">
            <img src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-60" alt="venue" />
            {tag && <span className="absolute top-4 left-4 bg-white text-black text-[8px] font-black px-3 py-1 rounded-full uppercase">{tag}</span>}
        </div>
        <div className="p-6">
            <h3 className="text-sm font-black uppercase truncate">{venue.name}</h3>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center text-cyan-400 font-black"><IndianRupee size={12}/> <span className="ml-1">{venue.price}</span></div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase">{venue.location?.city || "Unknown"}</div>
            </div>
        </div>
    </div>
);

export default AdminDashboard;