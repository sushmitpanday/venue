import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, Clock, CreditCard } from 'lucide-react'; // 👈 'C' capital kar diya hai

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-8.onrender.com";

const UserBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No token found");
                    setLoading(false);
                    return;
                }

                // Corrected API endpoint
                const res = await axios.get(`${API_BASE}/api/payment/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Set data directly as it's an array from backend
                console.log("🔥 Backend Data Check:", res.data);
                setBookings(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Bookings fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic uppercase tracking-tighter text-2xl">
            Loading your bookings...
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-5xl font-black mb-12 text-cyan-400 italic uppercase tracking-tighter"
                >
                    My Bookings
                </motion.h1>

                {bookings.length === 0 ? (
                    <div className="text-zinc-700 text-2xl font-black uppercase italic border-t border-zinc-900 pt-8">
                        No bookings found. Time to host an event?
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={booking._id} 
                                className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-cyan-500/30 transition-all duration-500 shadow-xl"
                            >
                                <div className="flex gap-6 items-center">
                                    <div className="h-24 w-24 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                        <Calendar size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase italic tracking-tight leading-none mb-2">
                                            {booking.venueName || "Venue Booking"}
                                        </h2>
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold uppercase tracking-widest">
                                            <MapPin size={14} className="text-cyan-500" /> Confirmed Booking
                                        </div>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl text-xs font-black text-zinc-300 uppercase tracking-tighter border border-zinc-800">
                                            Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-zinc-900">
                                    <div className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-2">
                                        <CreditCard size={24} className="text-zinc-600" />
                                        ₹{booking.amount}
                                    </div>
                                    <div className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        booking.status === 'Success' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    }`}>
                                        <CheckCircle size={14} />
                                        {booking.status || "Paid"}
                                    </div>
                                    <div className="flex flex-col items-start md:items-end">
                                        <span className="text-[10px] text-zinc-700 font-mono font-bold uppercase tracking-tighter">Transaction Hash</span>
                                        <span className="text-[10px] text-zinc-500 font-mono break-all">{booking.razorpay_payment_id}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            
            <p className="max-w-5xl mx-auto mt-20 text-[10px] text-zinc-800 font-black uppercase tracking-[0.5em] text-center border-t border-zinc-900 pt-10">
                Rent My Venue • Digital Receipt System • Powered by Razorpay Secure
            </p>
        </div>
    );
};

export default UserBooking;