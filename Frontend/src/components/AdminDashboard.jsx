import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Trash2, Edit3, X, PlusCircle, LogOut, ShieldCheck, Database, UploadCloud, Loader2, MapPin, Users, DoorOpen, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-8.onrender.com";
    
    const [activeTab, setActiveTab] = useState('agent-listings');
    const [userVenues, setUserVenues] = useState([]);
    const [payments, setPayments] = useState([]);
    const [agentVenues, setAgentVenues] = useState([]);
    const [adminVenues, setAdminVenues] = useState([]);
    const [editingVenue, setEditingVenue] = useState(null);
    const [loading, setLoading] = useState(false);

    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', state: '', address: '', pincode: '', images: [], description: '', capacity: '', rooms: ''
    });

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_BASE}/api/payment/all-payments`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Raw Response:", res.data);
            let extractedData = [];
            if (Array.isArray(res.data)) {
                extractedData = res.data;
            } else if (res.data.payments && Array.isArray(res.data.payments)) {
                extractedData = res.data.payments;
            } else if (res.data.data && Array.isArray(res.data.data)) {
                extractedData = res.data.data;
            }
            setPayments(extractedData);
        } catch (err) {
            console.error("❌ Error fetching payments:", err);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    const handleImageChange = (e, isEditing = false) => {
        const files = Array.from(e.target.files);
        const currentCount = isEditing ? (editingVenue?.images?.length || 0) : venueData.images.length;
        if (files.length + currentCount > 5) {
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

    useEffect(() => { 
        fetchVenues('all'); 
    }, [fetchVenues]);

    const handleAddVenue = async (e) => {
        e.preventDefault();
        if (venueData.images.length === 0) return alert("Come on, at least put one photo!");
        setLoading(true);
        const token = localStorage.getItem('token'); 
        try {
            const payload = {
                name: venueData.name,
                capacity: Number(venueData.capacity) || 0,
                rooms: Number(venueData.rooms) || 0,
                price: Number(venueData.price),
                description: venueData.description,
                images: venueData.images, 
                location: { 
                    address: venueData.address, 
                    city: venueData.city, 
                    state: venueData.state,
                    pincode: venueData.pincode
                }
            };
            await axios.post(`${API_BASE}/api/venue/register`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✨ Venue Added Successfully!");
            setVenueData({ name: '', price: '', city: '', state: '', address: '', pincode: '', images: [], description: '', capacity: '', rooms: '' });
            fetchVenues('admin');
            setActiveTab('admin-records');
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.message || "Failed to add"));
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure about deleting this?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE}/api/venue/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchVenues();
        } catch (err) { alert("Delete failed!"); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const updatedData = {
                ...editingVenue,
                capacity: Number(editingVenue.capacity),
                rooms: Number(editingVenue.rooms),
                price: Number(editingVenue.price)
            };
            await axios.put(`${API_BASE}/api/venue/${editingVenue._id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
            setEditingVenue(null);
            fetchVenues();
        } catch (err) { alert("Update failed!"); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-pink-400 text-black p-6 font-sans">
            <nav className="flex justify-between items-center mb-10 border-b border-pink-500 pb-5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-white" size={24} />
                    <h1 className="text-xl font-black uppercase tracking-tighter italic text-white">Admin<span className="text-black">Panel</span></h1>
                </div>
                <button onClick={() => {localStorage.clear(); navigate('/login');}} className="text-[10px] font-bold border border-black/20 bg-white/20 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all uppercase flex items-center gap-2">
                    <LogOut size={14}/> Logout
                </button>
            </nav>

            {/* TAB NAVIGATION */}
            <div className="flex gap-8 mb-10 overflow-x-auto border-b border-pink-500 pb-2">
                {[
                    { id: 'agent-listings', label: 'Agent Data', role: 'agent', icon: <ShieldCheck size={14}/> },
                    { id: 'admin-records', label: 'Admin Data', role: 'admin', icon: <Database size={14}/> },
                    { id: 'payments', label: 'Payments', role: 'payments', icon: <IndianRupee size={14}/> },
                    { id: 'add-new', label: 'Add Venue', role: null, icon: <PlusCircle size={14}/> }
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => { 
                            setActiveTab(tab.id); 
                            if (tab.id === 'payments') {
                                fetchPayments(); 
                            } else if (tab.role) {
                                fetchVenues(tab.role); 
                            }
                        }}
                        className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-white border-b-2 border-white' : 'text-pink-800'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div>
                {(activeTab === 'agent-listings' || activeTab === 'admin-records') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'agent-listings' && agentVenues.map(v => <VenueCard key={v._id} venue={v} onDelete={handleDelete} onEdit={setEditingVenue} tag="Agent" />)}
                        {activeTab === 'admin-records' && adminVenues.map(v => <VenueCard key={v._id} venue={v} onDelete={handleDelete} onEdit={setEditingVenue} tag="Admin" />)}
                    </div>
                )}

                {/* PAYMENTS SECTION */}
                {activeTab === 'payments' && (
                    <div className="overflow-x-auto bg-white/90 rounded-[2rem] border border-pink-300 p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-pink-600 font-black uppercase italic flex items-center gap-3 text-xl">
                                <CreditCard size={24}/> Transaction Ledger
                            </h2>
                            <span className="bg-pink-100 text-pink-600 text-[9px] font-black px-4 py-1.5 rounded-full border border-pink-200">
                                TOTAL: {payments.length} RECORDS
                            </span>
                        </div>
                        
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase text-pink-400 border-b border-pink-100">
                                    <th className="p-5">Client Email / Order</th>
                                    <th className="p-5">Amount</th>
                                    <th className="p-5">Transaction ID</th>
                                    <th className="p-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-zinc-800">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-pink-500" size={32}/></td></tr>
                                ) : (
                                    payments.length > 0 ? payments.map((p, idx) => (
                                        <tr key={p._id || idx} className="border-b border-pink-50 hover:bg-pink-50 transition-all group">
                                            <td className="p-5">
                                                <div className="font-bold text-black">{p.userEmail || "Guest User"}</div>
                                                <div className="text-[9px] text-zinc-400 font-mono mt-1">{p.razorpay_order_id || 'ORDER_ID_N/A'}</div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-pink-600 font-black italic text-lg">₹{p.amount || 0}</span>
                                            </td>
                                            <td className="p-5 font-mono text-zinc-500">
                                                {p.razorpay_payment_id || 'PENDING'}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                    <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">Captured</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-24">
                                                <Database className="mx-auto text-pink-200 mb-4" size={48} />
                                                <div className="text-pink-300 font-black uppercase italic tracking-tighter text-2xl">No Data in DB</div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'add-new' && (
                    <div className="max-w-xl mx-auto bg-white rounded-[3rem] p-10 border border-pink-300 shadow-2xl">
                        <form onSubmit={handleAddVenue} className="space-y-6">
                            <h2 className="text-black font-black uppercase text-xl mb-8 flex items-center gap-3 italic"><PlusCircle size={24} className="text-pink-500"/> Register New</h2>
                            <input type="text" placeholder="Venue Name" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none focus:border-pink-500" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} required />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-pink-300 uppercase ml-1">Images (Max 5)</label>
                                <div className="grid grid-cols-5 gap-2 mb-2">
                                    {venueData.images.map((img, i) => (
                                        <div key={i} className="h-16 rounded-xl overflow-hidden border border-pink-100 relative group">
                                            <img src={img} className="w-full h-full object-cover" alt="preview" />
                                            <button type="button" onClick={() => setVenueData({...venueData, images: venueData.images.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white"><X size={14}/></button>
                                        </div>
                                    ))}
                                    {venueData.images.length < 5 && (
                                        <label className="h-16 flex flex-col items-center justify-center bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-500">
                                            <UploadCloud size={16} className="text-pink-300" />
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price (₹)" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none focus:border-pink-500 font-bold" value={venueData.price} onChange={(e) => setVenueData({...venueData, price: e.target.value})} required />
                                <input type="text" placeholder="City" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs" value={venueData.city} onChange={(e) => setVenueData({...venueData, city: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="State" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs" value={venueData.state} onChange={(e) => setVenueData({...venueData, state: e.target.value})} required />
                                <input type="text" placeholder="Pincode" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs" value={venueData.pincode} onChange={(e) => setVenueData({...venueData, pincode: e.target.value})} required maxLength="6" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-pink-300 uppercase ml-1">Capacity</label>
                                    <input type="number" placeholder="Guests" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none focus:border-pink-500" value={venueData.capacity} onChange={(e) => setVenueData({...venueData, capacity: e.target.value})} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-pink-300 uppercase ml-1">Rooms</label>
                                    <input type="number" placeholder="Rooms" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none focus:border-pink-500" value={venueData.rooms} onChange={(e) => setVenueData({...venueData, rooms: e.target.value})} required />
                                </div>
                            </div>
                            <textarea placeholder="Address" rows="2" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none" value={venueData.address} onChange={(e) => setVenueData({...venueData, address: e.target.value})} required></textarea>
                            <textarea placeholder="Description" rows="2" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-2xl text-xs outline-none" value={venueData.description} onChange={(e) => setVenueData({...venueData, description: e.target.value})} required></textarea>
                            <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[12px] hover:bg-pink-600 transition-all">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "REGISTER TO DATABASE"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {editingVenue && (
                <div className="fixed inset-0 bg-pink-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md border border-pink-100 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black uppercase text-lg italic text-pink-600">Update Venue</h2>
                            <button onClick={() => setEditingVenue(null)} className="text-zinc-400 hover:text-black"><X/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                             <div className="grid grid-cols-5 gap-2 mb-4">
                                {editingVenue.images?.map((img, idx) => (
                                    <div key={idx} className="h-14 rounded-xl overflow-hidden border border-pink-100 relative group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setEditingVenue({...editingVenue, images: editingVenue.images.filter((_, i) => i !== idx)})} className="absolute inset-0 bg-red-500/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={14}/></button>
                                    </div>
                                ))}
                                {editingVenue.images?.length < 5 && (
                                    <label className="h-14 flex items-center justify-center bg-pink-50 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer">
                                        <PlusCircle size={18} className="text-pink-300" />
                                        <input type="file" multiple className="hidden" onChange={(e) => handleImageChange(e, true)} />
                                    </label>
                                )}
                            </div>
                            <input className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-black" value={editingVenue.name} onChange={e => setEditingVenue({...editingVenue, name: e.target.value})} placeholder="Name" />
                            <input className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-black" value={editingVenue.price} onChange={e => setEditingVenue({...editingVenue, price: e.target.value})} placeholder="Price" />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-pink-300 uppercase ml-1">Capacity</label>
                                    <input type="number" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-black" value={editingVenue.capacity || ''} onChange={e => setEditingVenue({...editingVenue, capacity: e.target.value})} placeholder="Capacity" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-pink-300 uppercase ml-1">Rooms</label>
                                    <input type="number" className="w-full p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-black" value={editingVenue.rooms || ''} onChange={e => setEditingVenue({...editingVenue, rooms: e.target.value})} placeholder="Rooms" />
                                </div>
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const VenueCard = ({ venue, tag, onDelete, onEdit }) => (
    <div className="bg-white rounded-[2rem] border border-pink-200 overflow-hidden relative group hover:border-pink-400 transition-all shadow-lg">
        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(venue)} className="bg-white/80 backdrop-blur-md p-2 rounded-xl text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-xl"><Edit3 size={14}/></button>
            <button onClick={() => onDelete(venue._id)} className="bg-white/80 backdrop-blur-md p-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={14}/></button>
        </div>
        <div className="h-44 bg-pink-50 relative">
            <img src={venue.images?.[0] || venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"} className="w-full h-full object-cover opacity-80" alt="venue" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-[8px] font-black px-2 py-1 rounded-md text-white border border-white/10">
                {venue.images?.length || 1} PHOTOS
            </div>
            {tag && <span className="absolute top-4 left-4 bg-pink-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl">{tag}</span>}
        </div>
        <div className="p-6">
            <h3 className="text-sm font-black uppercase truncate text-black">{venue.name}</h3>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1 uppercase font-bold">
                <MapPin size={10} className="text-pink-500" /> {venue.location?.city || "Unknown"}, {venue.location?.pincode || "000000"}
            </div>
            <div className="flex gap-3 mt-4">
                <div className="flex items-center gap-1 text-[9px] text-pink-600 font-bold uppercase bg-pink-50 px-2.5 py-1.5 rounded-xl border border-pink-100">
                    <Users size={10} className="text-pink-500" /> {venue.capacity || 0}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-pink-600 font-bold uppercase bg-pink-50 px-2.5 py-1.5 rounded-xl border border-pink-100">
                    <DoorOpen size={10} className="text-pink-500" /> {venue.rooms || 0}
                </div>
            </div>
            <div className="flex justify-between items-center mt-5 border-t border-pink-50 pt-4">
                <div className="flex items-center text-pink-600 font-black tracking-tighter">
                    <IndianRupee size={12}/> 
                    <span className="ml-1 text-xl">{venue.price}</span>
                    <span className="text-[10px] text-zinc-300 ml-1">/DAY</span>
                </div>
            </div>
        </div>
    </div>
);

export default AdminDashboard;