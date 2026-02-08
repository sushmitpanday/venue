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
        : "https://venue-xqee.vercel.app";

    useEffect(() => {
        const fetchVenueData = async () => {
            try {
                // Backend se specific venue ka data mangwana
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
        <div className="min-h-screen bg-[#020c1b] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="text-cyan-400 font-bold animate-pulse">FETCHING VENUE DETAILS...</p>
            </div>
        </div>
    );

    if (!venue) return (
        <div className="min-h-screen bg-[#020c1b] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-500/10 p-6 rounded-full mb-6">
                <Building2 size={64} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black mb-2">VENUE NOT FOUND!</h2>
            <p className="text-gray-400 mb-8 max-w-md">The venue you are looking for might have been removed or the link is incorrect.</p>
            <button 
                onClick={() => navigate('/')} 
                className="bg-cyan-500 text-[#031930] px-8 py-3 rounded-full font-bold hover:bg-cyan-400 transition-all shadow-lg"
            >
                BACK TO EXPLORE
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020c1b] text-white font-sans p-4 md:p-10">
            <div className="max-w-7xl mx-auto mt-4">
                
                {/* Navigation & Breadcrumb */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-all group"
                >
                    <div className="bg-white/5 p-2 rounded-full group-hover:bg-cyan-500/10">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold text-xs tracking-widest uppercase">Go Back</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* LEFT SECTION: Content */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Hero Image Container */}
                        <div className="w-full h-[350px] md:h-[500px] bg-[#0a192f] rounded-[2.5rem] overflow-hidden border border-white/5 relative shadow-2xl group">
                            {venue.photos?.length > 0 ? (
                                <img 
                                    src={venue.photos[0]} 
                                    alt={venue.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gradient-to-b from-[#0a192f] to-[#020c1b]">
                                    <Building2 size={80} strokeWidth={1} className="mb-4 opacity-20" />
                                    <span className="font-bold tracking-widest text-xs opacity-50">PREVIEW NOT AVAILABLE</span>
                                </div>
                            )}
                            <div className="absolute top-6 left-6 bg-cyan-500 text-[#031930] px-4 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase">
                                Verified Venue
                            </div>
                        </div>

                        {/* Heading & Location */}
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
                                {venue.name}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin size={18} className="text-cyan-400" />
                                <span className="text-sm md:text-base font-medium">
                                    {venue.location?.address}, {venue.location?.city}, {venue.location?.state}
                                </span>
                            </div>
                        </div>

                        {/* Key Specs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={<Users size={20}/>} label="Capacity" value={`${venue.capacity || '500'}+`} />
                            <StatCard icon={<Car size={20}/>} label="Parking" value={venue.parkingAvailable ? "Available" : "No"} />
                            <StatCard icon={<Calendar size={20}/>} label="Rooms" value={venue.availableRooms || "1"} />
                            <StatCard icon={<ShieldCheck size={20}/>} label="Status" value="Active" />
                        </div>

                        {/* Description Section */}
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <div className="h-1 w-8 bg-cyan-400 rounded-full"></div>
                                About this space
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-lg font-medium">
                                {venue.description || "Welcome to our premium venue. Experience world-class hospitality and stunning architecture for your special events. We provide all essential amenities to make your celebrations memorable."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SECTION: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-[3rem] p-8 text-[#031930] sticky top-28 shadow-[0_20px_50px_rgba(34,211,238,0.2)]">
                            <div className="mb-10">
                                <p className="text-[10px] font-black uppercase tracking-[3px] opacity-60 mb-1">Starting Price</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-black italic tracking-tighter">₹{venue.price}</span>
                                    <span className="text-sm font-bold opacity-80">/DAY</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-[#031930] text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group">
                                    BOOK NOW
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-ping"></div>
                                </button>
                                <p className="text-center text-[10px] font-bold uppercase opacity-60 tracking-widest">No hidden charges</p>
                            </div>

                            {/* Amenities in Card */}
                            <div className="mt-10 pt-8 border-t border-[#031930]/10">
                                <p className="font-black text-xs uppercase tracking-widest mb-4">Included Amenities:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {venue.amenities?.length > 0 ? (
                                        venue.amenities.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 font-bold text-sm">
                                                <div className="bg-[#031930]/10 p-1 rounded-md">
                                                    <CheckCircle size={14} />
                                                </div>
                                                {item}
                                            </div>
                                        ))
                                    ) : (
                                        ['Power Backup', 'Water Supply', 'Basic Lighting'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 font-bold text-sm">
                                                <CheckCircle size={14} /> {item}
                                            </div>
                                        ))
                                    )}
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
    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 hover:border-cyan-400/30 transition-all group">
        <div className="text-cyan-400 mb-3 bg-cyan-400/10 w-fit p-3 rounded-2xl group-hover:rotate-6 transition-transform">
            {icon}
        </div>
        <div className="text-[9px] text-gray-500 uppercase font-black tracking-[2px] mb-1">{label}</div>
        <div className="text-lg font-black text-white">{value}</div>
    </div>
);

export default VenueDetial;