import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    MapPin, 
    Users, 
    Car, 
    CheckCircle, 
    ArrowLeft, 
    Building2, 
    Calendar,
    ShieldCheck
} from 'lucide-react';

const VenueDetial = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-fzah.vercel.app";

    useEffect(() => {
        const fetchVenueData = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/venue/${id}`);
                setVenue(res.data);
            } catch (err) {
                console.error("Error fetching details:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchVenueData();
    }, [id, API_BASE]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-zinc-700 animate-spin-reverse"></div>
                </div>
                <p className="text-zinc-500 text-[10px] font-black tracking-[0.3em] animate-pulse">LOADING PROFILE</p>
            </div>
        </div>
    );

    if (!venue) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-zinc-900/50 p-8 rounded-[3rem] border border-zinc-800 mb-6">
                <Building2 size={64} className="text-zinc-700" />
            </div>
            <h2 className="text-4xl font-black mb-2 tracking-tighter italic">NOT <span className="text-cyan-400">FOUND</span></h2>
            <p className="text-zinc-500 mb-8 max-w-md text-sm font-bold uppercase tracking-wider">The venue link is broken or removed.</p>
            <button 
                onClick={() => navigate('/')} 
                className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs hover:bg-cyan-400 transition-all tracking-widest uppercase"
            >
                Back to Explore
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans p-4 md:p-10 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto mt-4 relative z-10">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-3 text-zinc-500 hover:text-white mb-10 transition-all group"
                >
                    <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 group-hover:border-cyan-500/50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-black text-[10px] tracking-[0.2em] uppercase">Return to Directory</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-12">
                    
                    {/* LEFT SECTION: Content */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Hero Image Container */}
                        <div className="w-full h-[350px] md:h-[550px] bg-zinc-950 rounded-[3.5rem] overflow-hidden border border-zinc-900 relative shadow-2xl group">
                            {venue.image ? (
                                <img 
                                    src={venue.image} 
                                    alt={venue.name} 
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
                                    <Building2 size={80} strokeWidth={1} className="mb-4 text-zinc-800" />
                                    <span className="font-black tracking-[0.4em] text-[10px] text-zinc-700">NO MEDIA PREVIEW</span>
                                </div>
                            )}
                            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
                                Verified Property
                            </div>
                        </div>

                        {/* Heading & Location */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                                {venue.name}
                            </h1>
                            <div className="flex items-center gap-3 text-zinc-400 border-l-2 border-cyan-500 pl-4 py-1">
                                <MapPin size={20} className="text-cyan-400" />
                                <span className="text-sm md:text-lg font-bold uppercase tracking-tight text-zinc-300">
                                    {venue.location?.address}, {venue.location?.city}, {venue.location?.state}
                                </span>
                            </div>
                        </div>

                        {/* Key Specs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={<Users size={20}/>} label="Max Capacity" value={`${venue.capacity || '500'}+`} />
                            <StatCard icon={<Car size={20}/>} label="Parking" value={venue.parkingAvailable ? "Yes" : "Limited"} />
                            <StatCard icon={<Calendar size={20}/>} label="Rooms" value={venue.availableRooms || "8+"} />
                            <StatCard icon={<ShieldCheck size={20}/>} label="Safety" value="Verified" />
                        </div>

                        {/* Description Section */}
                        <div className="p-10 bg-zinc-900/40 rounded-[3rem] border border-zinc-800 backdrop-blur-md">
                            <h3 className="text-xs font-black text-cyan-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-10 h-[1px] bg-cyan-400/30"></span>
                                Description
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                                {venue.description || "A premier luxury space designed for unforgettable celebrations. This property features cutting-edge amenities, sophisticated architecture, and a strategic location to ensure your event is nothing short of extraordinary."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SECTION: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-950 rounded-[3.5rem] border border-zinc-800 p-10 sticky top-28 shadow-2xl overflow-hidden group">
                            {/* Inner Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl transition-all group-hover:bg-cyan-500/20"></div>

                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 mb-2">Investment</p>
                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-6xl font-black italic tracking-tighter text-white">₹{venue.price}</span>
                                    <span className="text-sm font-bold text-zinc-600">/24H</span>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full bg-white text-black py-6 rounded-2xl font-black text-sm hover:bg-cyan-400 transition-all shadow-xl flex items-center justify-center gap-3 group/btn uppercase tracking-widest">
                                        Confirm Booking
                                        <CheckCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                    <p className="text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Guaranteed best rates</p>
                                </div>

                                {/* Amenities List */}
                                <div className="mt-12 pt-8 border-t border-zinc-900">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-zinc-500 mb-6 underline underline-offset-8 decoration-cyan-500/30">Premium Features</p>
                                    <div className="space-y-4">
                                        {(venue.amenities?.length > 0 ? venue.amenities : ['Full Power Backup', 'CCTV Security', 'Premium Lighting']).map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 group/item">
                                                <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 group-hover/item:border-cyan-500/50 transition-all">
                                                    <CheckCircle size={12} className="text-cyan-400" />
                                                </div>
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide group-hover/item:text-zinc-200 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Stats
const StatCard = ({ icon, label, value }) => (
    <div className="bg-zinc-950 p-6 rounded-[2rem] border border-zinc-900 hover:border-zinc-700 transition-all group">
        <div className="text-cyan-400 mb-4 bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="text-[9px] text-zinc-600 uppercase font-black tracking-[2px] mb-1">{label}</div>
        <div className="text-lg font-black text-white italic">{value}</div>
    </div>
);

export default VenueDetial;