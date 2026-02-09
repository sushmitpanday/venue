import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Eye, Calendar, X } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-1116.vercel.app";

const UserRegister = () => {
    const [loading, setLoading] = useState(false);
    const [latestVenues, setLatestVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null); 
    const [showCalendar, setShowCalendar] = useState(null); 

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/venue/all`);
                const sorted = res.data.reverse().slice(0, 8);
                setLatestVenues(sorted);
            } catch (err) {
                console.error("Error fetching venues", err);
            }
        };
        fetchVenues();
    }, []);

    return (
        <div className="min-h-screen bg-black p-4 md:p-10 text-white font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
                    <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-tighter">
                        Recently Added <span className="text-white">Venues</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestVenues.map((venue) => (
                        <motion.div 
                            whileHover={{ y: -10 }}
                            key={venue._id} 
                            className="bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 group hover:border-cyan-500/50 transition-all flex flex-col shadow-2xl"
                        >
                            {/* Image Section */}
                            <div className="h-48 w-full relative overflow-hidden">
                                <img 
                                    src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=60"} 
                                    alt={venue.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 bg-cyan-500 text-black px-3 py-1 rounded-full text-[10px] font-black">
                                    NEW
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex-1 bg-gradient-to-b from-zinc-950 to-black">
                                <h3 className="font-bold text-lg text-white mb-2 truncate uppercase tracking-tight">{venue.name}</h3>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1 text-cyan-400 font-black">
                                        <IndianRupee size={16} /> 
                                        <span>{venue.price} <span className="text-[10px] text-zinc-500 font-normal">/ DAY</span></span>
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold">
                                        <MapPin size={12} className="text-cyan-500" /> {venue.location?.city}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-4">
                                    <button 
                                        onClick={() => setSelectedVenue(venue)}
                                        className="flex-1 bg-white text-black hover:bg-cyan-500 transition-colors py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 uppercase"
                                    >
                                        <Eye size={14} /> View More
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowCalendar(venue)}
                                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-white transition-all shadow-inner"
                                    >
                                        <Calendar size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {/* 1. View More Modal */}
                {selectedVenue && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-zinc-950 w-full max-w-4xl rounded-[2.5rem] border border-zinc-800 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)]"
                        >
                            <button onClick={() => setSelectedVenue(null)} className="absolute top-6 right-6 text-white z-10 bg-zinc-900 p-2 rounded-full hover:bg-red-500 transition-colors">
                                <X size={20} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="h-64 md:h-[500px]">
                                    <img src={selectedVenue.image} className="w-full h-full object-cover opacity-90" alt="venue large" />
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">{selectedVenue.name}</h2>
                                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-medium">
                                        Premium space at {selectedVenue.name}. Located in {selectedVenue.location?.address}, optimized for high-end events and corporate gatherings.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">City</p>
                                            <p className="text-sm font-bold text-white">{selectedVenue.location?.city}</p>
                                        </div>
                                        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">State</p>
                                            <p className="text-sm font-bold text-white">{selectedVenue.location?.state}</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-10 bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
                                        Instant Booking
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Calendar Modal */}
                {showCalendar && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-zinc-950 p-10 rounded-[3rem] border border-zinc-800 w-full max-w-md text-center"
                        >
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar size={32} className="text-cyan-400" />
                            </div>
                            <h2 className="text-2xl font-black mb-2 uppercase italic">Check Slots</h2>
                            <p className="text-zinc-500 text-xs mb-8 uppercase tracking-[3px] font-bold">{showCalendar.name}</p>
                            
                            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-inner">
                                <input type="date" className="bg-transparent text-white w-full outline-none p-2 cursor-pointer font-bold invert" />
                            </div>

                            <div className="flex flex-col gap-3 mt-10">
                                <button className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500 transition-all">Check Availability</button>
                                <button onClick={() => setShowCalendar(null)} className="w-full text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mt-2">Go Back</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserRegister;