import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Eye, Calendar, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-fzah.vercel.app";

const UserRegister = () => {
    const navigate = useNavigate();
    const [latestVenues, setLatestVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null); 
    const [showCalendar, setShowCalendar] = useState(null); 
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Get logged in user info (Assuming you store it in localStorage)
    const user = JSON.parse(localStorage.getItem('user')) || { name: "Guest User", email: "guest@example.com" };

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/venue/all`);
                // Backend ensures correct route: /api/venue/all
                const sorted = res.data.reverse().slice(0, 8);
                setLatestVenues(sorted);
            } catch (err) {
                console.error("Error fetching venues", err);
            }
        };
        fetchVenues();
    }, []);

    const handlePayment = async (venue) => {
        if (!window.Razorpay) {
            alert("Razorpay SDK not found. Please check your internet connection.");
            return;
        }

        setPaymentLoading(true);
        try {
            // 1. Create Order on Backend
            const { data } = await axios.post(`${API_BASE}/api/payment/order`, {
                amount: venue.price 
            });

            if (!data.success) throw new Error("Order creation failed");

            // 2. Razorpay Configuration
            const options = {
                key: "rzp_test_SAKmorS3sIeBRc", 
                amount: data.order.amount,
                currency: "INR",
                name: "Venue Booking",
                description: `Booking for ${venue.name}`,
                image: venue.image || "https://your-logo-url.com/logo.png",
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        // 3. Verify & Save Booking in Database
                        const bookingData = {
                            venueId: venue._id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            amount: venue.price,
                            userEmail: user.email
                        };

                        const saveRes = await axios.post(`${API_BASE}/api/venue/book`, bookingData);
                        
                        if(saveRes.status === 200 || saveRes.status === 201) {
                            setBookingSuccess(true);
                            setSelectedVenue(null);
                            setShowCalendar(null);
                            
                            // 3 seconds baad success modal close karke dashboard bhej do
                            setTimeout(() => {
                                setBookingSuccess(false);
                                navigate('/user-dashboard'); // Ya jahan aap bhejna chahein
                            }, 3000);
                        }
                    } catch (dbErr) {
                        console.error("Database save error", dbErr);
                        alert("Payment successful, but booking entry failed. Please save your Payment ID: " + response.razorpay_payment_id);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#06b6d4" },
                modal: {
                    ondismiss: function() {
                        setPaymentLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment initialization failed", err);
            alert("Server Error: Could not start payment process.");
        } finally {
            setPaymentLoading(false);
        }
    };

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
                    {latestVenues.length > 0 ? latestVenues.map((venue) => (
                        <motion.div 
                            whileHover={{ y: -10 }}
                            key={venue._id} 
                            className="bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 group hover:border-cyan-500/50 transition-all flex flex-col shadow-2xl"
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <img 
                                    src={venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=60"} 
                                    alt={venue.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 bg-cyan-500 text-black px-3 py-1 rounded-full text-[10px] font-black italic">
                                    AVAILABLE
                                </div>
                            </div>

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

                                <div className="flex items-center gap-2 mt-4">
                                    <button onClick={() => setSelectedVenue(venue)} className="flex-1 bg-white text-black hover:bg-cyan-500 transition-colors py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 uppercase">
                                        <Eye size={14} /> Details
                                    </button>
                                    <button onClick={() => setShowCalendar(venue)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-white transition-all">
                                        <Calendar size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-zinc-600 font-bold uppercase tracking-widest">
                            No venues found. Check your backend connection.
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {/* 1. View Details Modal */}
                {selectedVenue && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-950 w-full max-w-4xl rounded-[2.5rem] border border-zinc-800 overflow-hidden relative shadow-2xl">
                            <button onClick={() => setSelectedVenue(null)} className="absolute top-6 right-6 text-white z-10 bg-zinc-900 p-2 rounded-full hover:bg-red-500 transition-colors"><X size={20} /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="h-64 md:h-[500px]"><img src={selectedVenue.image} className="w-full h-full object-cover" alt="venue" /></div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">{selectedVenue.name}</h2>
                                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Book this premium space for your next event. Includes all modern amenities.</p>
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-zinc-300"><MapPin size={18} className="text-cyan-500"/> {selectedVenue.location?.address}, {selectedVenue.location?.city}</div>
                                        <div className="flex items-center gap-3 text-cyan-400 font-bold text-xl"><IndianRupee size={20}/> {selectedVenue.price} <span className="text-xs text-zinc-500 italic">Total per day</span></div>
                                    </div>
                                    <button 
                                        disabled={paymentLoading}
                                        onClick={() => handlePayment(selectedVenue)}
                                        className="w-full bg-cyan-500 disabled:bg-cyan-900 text-black py-4 rounded-2xl font-black uppercase text-sm hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                                    >
                                        {paymentLoading ? <Loader2 className="animate-spin" /> : "Confirm & Pay Now"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Success Modal */}
                {bookingSuccess && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-cyan-500">
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center text-black">
                            <CheckCircle2 size={100} className="mx-auto mb-6 animate-bounce" />
                            <h2 className="text-5xl font-black uppercase tracking-tighter">Booking Confirmed!</h2>
                            <p className="font-bold mt-2 uppercase text-sm">Redirecting to your dashboard...</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserRegister;