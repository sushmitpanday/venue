import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Eye, Calendar as CalendarIcon, X, Loader2, LogOut, User, ShieldCheck, ChevronLeft, ChevronRight, Clock, CheckCircle, ReceiptText, IndianRupee } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const API_BASE = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://venue-8.onrender.com";

    const [venues, setVenues] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showCalendar, setShowCalendar] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.fullname || user.name || "Owner";

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/payment/all-payments`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            let data = res.data.payments || res.data.data || (Array.isArray(res.data) ? res.data : []);
            setPayments([...data].reverse());
        } catch (err) {
            console.error("Payment Fetch Error", err);
        } finally {
            setLoading(false);
        }
    }, [API_BASE, token]);

    useEffect(() => {
        if (!token) return navigate('/login');
        
        const fetchVenues = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/venue/all`);
                setVenues(res.data.reverse());
            } catch (err) { console.error(err); }
        };

        fetchVenues();
        fetchPayments();
    }, [token, navigate, API_BASE, fetchPayments]);

    const getDisplayImage = (venue) => {
        if (venue?.images?.[0]) return venue.images[0];
        if (typeof venue?.image === 'string') return venue.image;
        return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000";
    };

    const handlePayment = async (venue) => {
        if (!window.Razorpay) return alert("Razorpay SDK Error!");
        setPaymentLoading(true);
        try {
            // FIX: Sending 'price' instead of 'amount' to match backend controller
            const { data } = await axios.post(`${API_BASE}/api/payment/checkout`, 
                { price: venue.price }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: "rzp_live_SINjf374iwKdqS", 
                amount: data.order.amount,
                currency: "INR",
                name: "RENT MY VENUE",
                order_id: data.order.id,
                handler: async (response) => {
                    const bookingData = {
                        venueId: venue._id,
                        venueName: venue.name, // Added for your schema
                        userId: user?._id || user?.id,
                        userEmail: user?.email,
                        userName: displayName,
                        bookingDate: selectedDate.toISOString().split('T')[0],
                        amount: venue.price,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    };
                    const res = await axios.post(`${API_BASE}/api/payment/verify`, bookingData, { headers: { Authorization: `Bearer ${token}` } });
                    if (res.data.success) {
                        fetchPayments();
                        setSelectedVenue(null);
                        navigate('/paymentsuccess?reference=' + response.razorpay_payment_id);
                    }
                },
                prefill: { name: displayName, email: user?.email || "" },
                theme: { color: "#f472b6" },
                modal: { ondismiss: () => setPaymentLoading(false) }
            };
            new window.Razorpay(options).open();
        } catch (err) { 
            console.error("Payment Error Details:", err.response?.data || err.message);
            alert("Payment Error! Check console for details."); 
        } finally { setPaymentLoading(false); }
    };

    return (
        <div className="min-h-screen bg-pink-400 text-zinc-900 font-sans">
            <style>{`
                .react-calendar { background: white !important; border: none !important; border-radius: 24px; padding: 15px; width: 100% !important; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); } 
                .react-calendar__tile--active { background: #f472b6 !important; color: white !important; border-radius: 12px; } 
                .react-calendar__navigation button { color: #db2777 !important; font-weight: 800; }
                .react-calendar__month-view__days__day--neighboringMonth { color: #f9a8d4 !important; }
            `}</style>

            <nav className="border-b border-pink-500/30 bg-white/20 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <ShieldCheck className="text-white" size={28} />
                    <span className="font-black tracking-tighter text-xl uppercase italic text-white">rentmy<span className="text-zinc-900">venue</span></span>
                </div>
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 bg-white/30 px-4 py-2 rounded-2xl border border-white/40 shadow-sm"
                >
                    <ChevronLeft size={18} />
                    <span className="text-[10px] font-black uppercase">Back to Venues</span>
                </button>
                <div className="flex items-center gap-4">
                    <div className="bg-white/30 px-4 py-2 rounded-full border border-white/40 flex items-center gap-2">
                        <User size={12} className="text-zinc-900" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{displayName}</span>
                    </div>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="bg-zinc-900 text-white p-2 rounded-full hover:bg-red-500 transition-all shadow-lg"><LogOut size={16} /></button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 md:p-10">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-sm">Premium <span className="text-zinc-900">Venues</span></h1>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {venues.map((venue) => (
                        <motion.div key={venue._id} whileHover={{ y: -8 }} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden group border border-pink-200">
                            <div className="h-48 relative overflow-hidden">
                                <img src={getDisplayImage(venue)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={venue.name} />
                                <div className="absolute top-4 right-4 bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-black text-white italic">₹{venue.price}/DAY</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-black uppercase text-zinc-900 mb-2 truncate text-sm">{venue.name}</h3>
                                <p className="text-pink-600 text-[10px] font-bold flex items-center gap-1 uppercase mb-6"><MapPin size={12} /> {venue.location?.city}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => { setSelectedVenue(venue); setCurrentImgIdx(0); }} className="flex-1 bg-zinc-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-pink-500 transition-all">Details</button>
                                    <button onClick={() => setShowCalendar(venue)} className="bg-pink-100 text-pink-600 border border-pink-200 p-3 rounded-2xl hover:bg-pink-200 transition-all"><CalendarIcon size={18} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mb-8 px-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Payment <span className="text-zinc-900">History</span></h2>
                </div>

                <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl overflow-x-auto border-4 border-white">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-zinc-50 text-[10px] font-black uppercase text-pink-500">
                                <th className="p-7">Venue & User</th>
                                <th className="p-7">Payment ID</th>
                                <th className="p-7">Amount</th>
                                <th className="p-7">Date</th>
                                <th className="p-7 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-24 text-center"><Loader2 className="animate-spin text-pink-500 mx-auto" size={40} /></td></tr>
                            ) : payments.map((pay) => (
                                <tr key={pay._id} className="border-b border-pink-50 hover:bg-pink-50/50 transition-all">
                                    <td className="p-7">
                                        <div className="flex flex-col">
                                            <span className="text-zinc-900 font-black uppercase text-sm italic">{pay.venueName || pay.venueId?.name || 'Private Venue'}</span>
                                            <span className="text-pink-400 text-[9px] font-bold">{pay.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-7 font-mono text-[10px] text-zinc-400">{pay.razorpay_payment_id}</td>
                                    <td className="p-7 font-black text-zinc-900 italic text-lg">₹{pay.amount}</td>
                                    <td className="p-7 text-[10px] font-black uppercase text-zinc-500">{pay.bookingDate || pay.date || new Date(pay.createdAt).toLocaleDateString()}</td>
                                    <td className="p-7 text-center">
                                        <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full border border-emerald-200 text-[9px] font-black uppercase">Success</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedVenue && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xl">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-5xl rounded-[3.5rem] overflow-hidden relative grid grid-cols-1 md:grid-cols-2 shadow-3xl">
                             <button onClick={() => setSelectedVenue(null)} className="absolute top-8 right-8 text-white z-50 bg-zinc-900/80 p-2 rounded-full"><X size={20} /></button>
                             <div className="h-80 md:h-[500px] relative bg-zinc-100">
                                <img src={getDisplayImage(selectedVenue)} className="h-full w-full object-cover" alt="venue" />
                             </div>
                             <div className="p-12 flex flex-col justify-center">
                                 <h2 className="text-4xl font-black mb-2 uppercase italic text-zinc-900">{selectedVenue.name}</h2>
                                 <p className="text-pink-500 font-black text-xl italic mb-8">Booking for: {selectedDate.toDateString()}</p>
                                 <button onClick={() => handlePayment(selectedVenue)} className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] font-black uppercase hover:bg-pink-500 transition-all shadow-xl">
                                     {paymentLoading ? <Loader2 className="animate-spin mx-auto" /> : `PAY ₹${selectedVenue.price} & CONFIRM`}
                                 </button>
                             </div>
                        </motion.div>
                    </div>
                )}
                {showCalendar && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md">
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase italic text-pink-500">Select Booking Date</h3>
                                <button onClick={() => setShowCalendar(null)} className="text-zinc-400 hover:text-zinc-900"><X size={24} /></button>
                            </div>
                            <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} />
                            <button onClick={() => { setShowCalendar(null); setSelectedVenue(showCalendar); }} className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase mt-6 hover:bg-pink-500 shadow-lg transition-all">Set This Date</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default OwnerDashboard;