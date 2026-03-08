import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Eye, Calendar as CalendarIcon, X, Loader2, CheckCircle2, Images, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-8.onrender.com";

const UserRegister = () => {
    const navigate = useNavigate();
    const [latestVenues, setLatestVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null); 
    const [showCalendar, setShowCalendar] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showGallery, setShowGallery] = useState(false); 

    // --- LOGIN NAME LOGIC (SAME AS OWNER DASHBOARD) ---
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.fullname || user.name || "Guest User";

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

    const handlePayment = async (venue) => {
        if (!selectedDate) {
            alert("Please select a date from the calendar first!");
            return;
        }

        const token = localStorage.getItem('token'); 
        if (!token) {
            alert("you are not logged in. please login first");
            navigate('/login');
            return;
        }

        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        setPaymentLoading(true);

        try {
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
                        alert(err.response?.data?.message || "Booking failed!");
                    }
                },
                prefill: { name: displayName, email: user.email },
                theme: { color: "#06b6d4" },
                modal: { ondismiss: () => setPaymentLoading(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("You don't have an account yet. Please sign up first, then log in with those details to book the venue.");
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-400 p-4 md:p-10 text-white font-sans">
            <style>{`
                .react-calendar { width: 100%; border: none; background: transparent; font-family: sans-serif; }
                .react-calendar__tile { color: white; padding: 10px; border-radius: 8px; }
                .react-calendar__tile:enabled:hover { background: #06b6d4; color: black; }
                .react-calendar__tile--active { background: #06b6d4 !important; color: black !important; }
                .react-calendar__navigation button { color: white; font-size: 1.2rem; }
                .react-calendar__month-view__weekdays__weekday { color: #52525b; text-decoration: none; font-weight: bold; }
            `}</style>

            {/* --- NAYA HEADER (SAME AS OWNER DASHBOARD STYLE) --- */}
            {/* <nav className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-white/20 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/30">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="font-black tracking-tighter text-xl uppercase italic text-white">rentmy<span className="text-rose-800">venue</span></span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white/30 px-4 py-2 rounded-full border border-white/40 flex items-center gap-2">
                        <User size={12} className="text-zinc-900" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{displayName}</span>
                    </div>
                    {localStorage.getItem('token') && (
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-rose-900 text-white p-2 rounded-full hover:bg-red-500 transition-all shadow-lg">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </nav> */}

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestVenues.map((venue) => (
                        <motion.div key={venue._id} className="bg-pink-400 rounded-3xl overflow-hidden border border-zinc-200 p-5 shadow-2xl">
                            <img 
                                src={venue.images && venue.images.length > 0 ? venue.images[0] : (venue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80")} 
                                className="h-48 w-full object-cover rounded-2xl mb-4" 
                                alt={venue.name} 
                            />
                            <h3 className="font-bold text-lg mb-2 uppercase truncate text-white">{venue.name}</h3>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white font-black flex items-center"><IndianRupee size={14}/>{venue.price}</span>
                                <span className="text-white/80 text-xs flex items-center gap-1 truncate max-w-[100px]"><MapPin size={12}/> {venue.location?.city}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedVenue(venue)} className="flex-1 bg-rose-800 text-white py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2">
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
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-6 bg-black/95 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }} 
                            className="bg-pink-400 w-full max-w-5xl h-auto max-h-[90vh] md:h-[80vh] rounded-[2rem] border border-white/20 overflow-y-auto md:overflow-hidden relative flex flex-col md:flex-row shadow-2xl"
                        >
                            <button 
                                onClick={() => setSelectedVenue(null)} 
                                className="fixed md:absolute top-6 right-6 text-white z-[160] bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-red-600 transition-all border border-zinc-700"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="w-full md:w-1/2 h-64 md:h-full bg-zinc-900 relative shrink-0">
                                <img 
                                    src={selectedVenue.images && selectedVenue.images.length > 0 ? selectedVenue.images[0] : (selectedVenue.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80")} 
                                    className="h-full w-full object-cover" 
                                    alt="venue" 
                                />
                                <div className="absolute bottom-6 left-6">
                                    <button 
                                        onClick={() => setShowGallery(true)}
                                        className="bg-rose-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase hover:bg-white hover:text-rose-800 transition-all shadow-xl"
                                    >
                                        <Images size={16} />VIEW Photos ({selectedVenue.images?.length || 1})
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 md:p-10 flex flex-col w-full md:w-1/2 md:overflow-y-auto">
                                <h2 className="text-3xl md:text-4xl font-black mb-2 uppercase text-white leading-tight">
                                    {selectedVenue.name}
                                </h2>
                                <div className="flex items-center gap-2 text-white mb-6 font-bold text-sm uppercase tracking-wider">
                                    <MapPin size={16}/> {selectedVenue.location?.city}
                                </div>
                                
                                <div className="bg-white/10 p-5 rounded-2xl border border-white/20 mb-6 text-white">
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {selectedVenue.description || "Premium venue with world-class facilities."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/20 p-4 rounded-2xl border border-white/30 text-center">
                                        <p className="text-[10px] text-white/70 uppercase font-black">Capacity</p>
                                        <p className="text-white font-bold">{selectedVenue.capacity || "500+"}</p>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-2xl border border-white/30 text-center">
                                        <p className="text-[10px] text-white/70 uppercase font-black">Rooms</p>
                                        <p className="text-white font-bold">{selectedVenue.rooms || "10+"}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/20 flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-[10px] text-white/70 uppercase font-black">Date</p>
                                        <p className="text-white font-bold text-sm">{selectedDate.toDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/70 uppercase font-black">Price</p>
                                        <p className="text-white text-2xl font-black">₹{selectedVenue.price}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handlePayment(selectedVenue)} 
                                    disabled={paymentLoading} 
                                    className="w-full bg-rose-800 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center mb-4 md:mb-0"
                                >
                                    {paymentLoading ? <Loader2 className="animate-spin" /> : "Confirm & Pay Now"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
                
                {showGallery && selectedVenue && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
                            <h3 className="text-white font-black uppercase">Photos: {selectedVenue.name}</h3>
                            <button onClick={() => setShowGallery(false)} className="bg-rose-800 p-3 rounded-full text-white"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {(selectedVenue.images && selectedVenue.images.length > 0 ? selectedVenue.images : [selectedVenue.image]).map((img, index) => (
                                <img key={index} src={img} className="w-full rounded-3xl border border-white/20 shadow-2xl" alt="venue" />
                            ))}
                        </div>
                    </motion.div>
                )}

                {showCalendar && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-pink-500 p-6 rounded-3xl border border-white/30 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-black uppercase">Select Date</h3>
                                <button onClick={() => setShowCalendar(null)} className="text-white/50"><X size={20} /></button>
                            </div>
                            <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} className="rounded-xl bg-white/10"/>
                            <button onClick={() => { setShowCalendar(null); setSelectedVenue(showCalendar); }} className="w-full bg-rose-800 text-white py-3 rounded-xl font-black uppercase mt-4">Confirm Date</button>
                        </motion.div>
                    </div>
                )}

                {bookingSuccess && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-rose-800 text-white p-4 text-center">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            <CheckCircle2 size={100} className="mx-auto mb-6" />
                            <h2 className="text-5xl font-black uppercase italic">Booking Done!</h2>
                            <p className="mt-4 font-bold opacity-80 uppercase tracking-widest">Redirecting to Dashboard...</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserRegister;