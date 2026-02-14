import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        guests: 1,
        date: ''
    });

    // --- DYNAMIC API BASE ---
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000/api/payment" 
        : "https://venue-q34h.vercel.app/api/payment";

    const amount = 5000; 

    const handlePayment = async () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        setLoading(true);

        try {
            // 1. Backend se Order ID mangwayein (/order wala path)
            const { data } = await axios.post(`${API_BASE}/order`, { 
                amount: amount 
            });

            if (!data.success) throw new Error("Order creation failed");

            const options = {
                // IMPORTANT: Apni rzp_test_... wali key yahan dalo
                key: "rzp_test_SAKmorS3sIeBRc", 
                amount: data.order.amount,
                currency: "INR",
                name: "RENT MY VENUE",
                description: "Booking Payment",
                order_id: data.order.id, // Sahi ID mapping
                handler: async (response) => {
                    // 2. Payment Success logic
                    try {
                        const finalData = {
                            ...bookingDetails,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: amount
                        };
                        
                        // Aapka confirmation route
                        const res = await axios.post(`${API_BASE}/learn`, finalData);
                        
                        if(res.status === 200 || res.status === 201) {
                            alert("✨ Booking Confirmed Successfully!");
                        }
                    } catch (err) {
                        alert("Payment successful but booking failed to save.");
                    }
                },
                theme: { color: "#06b6d4" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("❌ Error: " + (error.response?.data?.message || "Could not initiate payment."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                <h2 className="text-2xl font-black italic uppercase mb-6 border-b-2 border-cyan-500 inline-block">
                    Confirm Booking
                </h2>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full p-4 bg-zinc-900 rounded-2xl outline-none focus:border-cyan-500 border border-transparent"
                        onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} 
                    />

                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex justify-between items-center">
                        <span className="text-xl font-black text-cyan-400">₹{amount}</span>
                    </div>

                    <button 
                        onClick={handlePayment} 
                        disabled={loading || !bookingDetails.name}
                        className="w-full py-5 rounded-2xl font-black bg-cyan-600 hover:bg-cyan-500 text-black uppercase"
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;