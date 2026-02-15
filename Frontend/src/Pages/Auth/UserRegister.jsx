import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Eye, Calendar as CalendarIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-sooty.vercel.app";

const UserRegister = () => {
    const navigate = useNavigate();
    const [latestVenues, setLatestVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null); 
    const [showCalendar, setShowCalendar] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const user = JSON.parse(localStorage.getItem('user')) || { name: "Guest User", email: "guest@example.com" };

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/venue/all`);
                setLatestVenues(res.data.reverse().slice(0, 8));
            } catch (err) {
                console.error("Error fetching venues", err);
            }
        };
        fetchVenues();
    }, []);

    // EK HI ASYNC FUNCTION RAKHO
    const handlePayment = async (venue) => {
        if (!selectedDate) {
            alert("Pehle calendar se date select karein!");
            return;
        }

        const token = localStorage.getItem('token'); 
        if (!token) {
            alert("Aap logged in nahi hain. Pehle login karein.");
            navigate('/login');
            return;
        }

        if (!window.Razorpay) {
            alert("Razorpay SDK load nahi hua.");
            return;
        }

        setPaymentLoading(true);

        try {
            // 1. Order ID mangwayein
            const { data } = await axios.post(`${API_BASE}/api/payment/order`, { 
                amount: venue.price 
            });

            if (!data.success) throw new Error("Order creation failed");

            const options = {
                key: "rzp_test_SAKmorS3sIeBRc", 
                amount: data.order.amount,
                currency: "INR",
                name: "VENUE BOOKING",
                description: `Booking for ${venue.name}`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const bookingData = {
                            venueId: venue._id,
                            bookingDate: selectedDate.toISOString().split('T')[0],
                            amount: venue.price,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        };

                       const res = await axios.post(`${API_BASE}/api/booking/book`, bookingData, {
    headers: { Authorization: `Bearer ${token}` }
});
                        
                        if(res.status === 200 || res.status === 201) {
                            setBookingSuccess(true);
                            setTimeout(() => {
                                setBookingSuccess(false);
                                navigate('/user-dashboard');
                            }, 3000);
                        }
                    } catch (err) {
                        alert(err.response?.data?.message || "Booking fail ho gayi!");
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#06b6d4" },
                modal: { ondismiss: () => setPaymentLoading(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment process start nahi ho paya.");
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black p-4 md:p-10 text-white font-sans">
            <style>{`
                .react-calendar { width: 100%; border: none; background: transparent; font-family: sans-serif; }
                .react-calendar__tile { color: white; padding: 10px; border-radius: 8px; }
                .react-calendar__tile:enabled:hover { background: #06b6d4; color: black; }
                .react-calendar__tile--active { background: #06b6d4 !important; color: black !important; }
                .react-calendar__navigation button { color: white; font-size: 1.2rem; }
                .react-calendar__month-view__weekdays__weekday { color: #52525b; text-decoration: none; font-weight: bold; }
            `}</style>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestVenues.map((venue) => (
                        <motion.div key={venue._id} className="bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 p-5 shadow-2xl">
                            <img src={venue.image} className="h-48 w-full object-cover rounded-2xl mb-4" alt={venue.name} />
                            <h3 className="font-bold text-lg mb-2 uppercase">{venue.name}</h3>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-cyan-400 font-black">₹{venue.price}</span>
                                <span className="text-zinc-500 text-xs flex items-center gap-1"><MapPin size={12}/> {venue.location?.city}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedVenue(venue)} className="flex-1 bg-white text-black py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2">
                                    <Eye size={14} /> Details
                                </button>
                                <button onClick={() => setShowCalendar(venue)} className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-xl text-white">
                                    <CalendarIcon size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedVenue && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-950 w-full max-w-4xl rounded-[2.5rem] border border-zinc-800 overflow-hidden relative grid grid-cols-1 md:grid-cols-2 shadow-2xl">
                            <button onClick={() => setSelectedVenue(null)} className="absolute top-6 right-6 text-white z-10 bg-zinc-900 p-2 rounded-full"><X size={20} /></button>
                            <img src={selectedVenue.image} className="h-full w-full object-cover" alt="venue" />
                            <div className="p-8 flex flex-col justify-center">
                                <h2 className="text-3xl font-black mb-4 uppercase">{selectedVenue.name}</h2>
                                <p className="text-zinc-400 text-sm mb-4">Selected Date: <span className="text-cyan-400 font-bold">{selectedDate.toDateString()}</span></p>
                                <button onClick={() => handlePayment(selectedVenue)} className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase shadow-lg shadow-cyan-500/20">
                                    {paymentLoading ? <Loader2 className="animate-spin mx-auto" /> : "Confirm & Pay Now"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showCalendar && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-700 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-cyan-400 font-black uppercase">Select Event Date</h3>
                                <button onClick={() => setShowCalendar(null)}><X size={20} /></button>
                            </div>
                            <div className="bg-black/50 p-4 rounded-2xl border border-zinc-800 mb-6">
                                <Calendar 
                                    onChange={setSelectedDate} 
                                    value={selectedDate} 
                                    minDate={new Date()}
                                    className="rounded-xl"
                                />
                            </div>
                            <button onClick={() => { setShowCalendar(null); setSelectedVenue(showCalendar); }} className="w-full bg-cyan-500 text-black py-3 rounded-xl font-black uppercase">
                                Use This Date
                            </button>
                        </motion.div>
                    </div>
                )}

                {bookingSuccess && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-cyan-500 text-black">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                            <CheckCircle2 size={80} className="mx-auto mb-4" />
                            <h2 className="text-4xl font-black uppercase">Booking Done!</h2>
                            <p className="mt-2 font-bold uppercase">{selectedDate.toDateString()}</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserRegister;