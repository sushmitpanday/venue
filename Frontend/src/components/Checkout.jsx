import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        guests: 1,
        date: ''
    });

    // --- DYNAMIC API BASE (Vercel Fix) ---
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" // Aapka local backend port
        : "https://venue-ldog.vercel.app"; // Aapka production backend URL

    const amount = 5000; 

    const handlePayment = async () => {
        // 1. Check if Razorpay script is loaded
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setLoading(true);

        try {
            // 2. Backend se Order ID mangwayein
            const { data: order } = await axios.post(`${API_BASE}/create-order`, { 
                amount: amount * 100 // Razorpay expects paise
            });

            const options = {
                // IMPORTANT: Replace with your actual Key ID from Razorpay Dashboard
                key: "YOUR_RAZORPAY_KEY_ID", 
                amount: order.amount,
                currency: "INR",
                name: "RENT MY VENUE",
                description: "Booking Payment for Venue",
                image: "https://your-logo-url.com/logo.png", // Optional logo
                order_id: order.id,
                handler: async (response) => {
                    // 3. Payment Success: Database update
                    try {
                        const finalData = {
                            ...bookingDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amount
                        };
                        
                        const res = await axios.post(`${API_BASE}/learn`, finalData);
                        
                        if(res.status === 200 || res.status === 201) {
                            alert("✨ Booking Confirmed Successfully!");
                        }
                    } catch (err) {
                        console.error("Database Update Error:", err);
                        alert("Payment Success, but failed to save booking. Please contact support.");
                    }
                },
                prefill: {
                    name: bookingDetails.name,
                    email: "user@example.com", // Optional: User email
                    contact: "9999999999"      // Optional: User phone
                },
                theme: { color: "#06b6d4" }, // Cyan color matching your theme
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Order Creation Error:", error);
            alert("❌ Server Error: Could not initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 border-b-2 border-cyan-500 inline-block">
                    Confirm Booking
                </h2>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter your name" 
                            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm outline-none focus:border-cyan-500 transition-all"
                            onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Booking Date</label>
                        <input 
                            type="date" 
                            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm outline-none focus:border-cyan-500 transition-all text-white"
                            onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} 
                        />
                    </div>

                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex justify-between items-center mt-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Payable</span>
                        <span className="text-xl font-black text-cyan-400">₹{amount}</span>
                    </div>

                    <button 
                        onClick={handlePayment} 
                        disabled={loading || !bookingDetails.name}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-lg mt-4 
                            ${loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-cyan-500/20 active:scale-95'}`}
                    >
                        {loading ? "Processing..." : "Pay Now & Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;