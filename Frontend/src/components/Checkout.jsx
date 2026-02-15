import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        guests: 1,
        date: ''
    });

    // DYNAMIC API BASE (Isse sahi karo)
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-sooty.vercel.app";

    const amount = 5000; 

    const handlePayment = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Pehle login karein!");

        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        setLoading(true);

        try {
            // 1. Backend se Order ID mangwayein
            const { data } = await axios.post(`${API_BASE}/api/payment/order`, { 
                amount: amount 
            });

            if (!data.success) throw new Error("Order creation failed");

            const options = {
                key: "rzp_test_SAKmorS3sIeBRc", 
                amount: data.order.amount,
                currency: "INR",
                name: "RENT MY VENUE",
                description: "Booking Payment",
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const finalData = {
                            venueId: "67af23...", // Yahan actual venue ID pass karni hogi
                            bookingDate: bookingDetails.date || new Date().toISOString().split('T')[0],
                            amount: amount,
                            razorpay_payment_id: response.razorpay_payment_id
                        };
                        
                        // SAHI ROUTE: /api/booking/book
                        const res = await axios.post(`${API_BASE}/api/booking/book`, finalData, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        
                        if(res.status === 200 || res.status === 201) {
                            alert("✨ Booking Confirmed Successfully!");
                            window.location.href = "/user-dashboard";
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
            alert("❌ Error: " + (error.response?.data?.message || "Could not initiate payment."));
        } finally {
            setLoading(false);
        }
    };

    return (
        // ... (Baaki UI same rahega)
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                <h2 className="text-2xl font-black italic uppercase mb-6 border-b-2 border-cyan-500 inline-block">Confirm Booking</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-zinc-900 rounded-2xl outline-none" onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} />
                    <input type="date" className="w-full p-4 bg-zinc-900 rounded-2xl outline-none text-white" onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} />
                    <button onClick={handlePayment} disabled={loading || !bookingDetails.name} className="w-full py-5 rounded-2xl font-black bg-cyan-600 text-black uppercase">
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;