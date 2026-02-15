import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-sooty.vercel.app";

const UserBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/api/booking/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data.bookings);
            } catch (err) {
                console.error("Bookings fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading your bookings...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black mb-8 text-cyan-400 italic uppercase">My Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="text-zinc-500 text-xl italic">Abhi tak koi booking nahi ki hai...</div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={booking._id} 
                                className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="h-20 w-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
                                        <Calendar size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold uppercase">{booking.venueId?.name || "Venue Name"}</h2>
                                        <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                            <MapPin size={14} /> {booking.venueId?.location?.city || "Location"}
                                        </div>
                                        <div className="mt-2 inline-block bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold text-cyan-400">
                                            Date: {new Date(booking.date).toDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <div className="text-2xl font-black text-white italic">₹{booking.totalAmount}</div>
                                    <div className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                                        booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                        {booking.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {booking.status}
                                    </div>
                                    <span className="text-[10px] text-zinc-600 font-mono uppercase">ID: {booking.paymentId}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBooking;