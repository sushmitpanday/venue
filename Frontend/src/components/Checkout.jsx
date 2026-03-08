import React, { useState } from 'react';
import axios from 'axios';

const Checkout = ({ venueId }) => {
    const [email, setEmail] = useState('');
    const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-8.onrender.com";

    const handlePayment = async () => {
        try {
            // Order banana (Backend se ₹1 ka order aayega)
            const { data } = await axios.post(`${API_BASE}/api/payment/checkout`, { amount: 1 });

            const options = {
                key: "rzp_live_SINjf374iwKdqS", // Tumhari Live Key ID
                amount: data.order.amount,
                currency: "INR",
                name: "Rent My Venue",
                order_id: data.order.id,
                handler: async (response) => {
                    // Payment ke baad backend ko verify aur save ke liye bhejo
                    const verifyPayload = {
                        ...response,
                        userEmail: email,
                        amount: 1,
                        venueId: venueId || "123"
                    };
                    
                    const res = await axios.post(`${API_BASE}/api/payment/verify`, verifyPayload, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });

                    if (res.data.success) {
                        alert("Bhai, MongoDB Atlas check kar, data pahunch gaya hoga!");
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("Payment failed!");
        }
    };

    return (
        <div style={{padding: '20px', background: '#222', color: '#fff', borderRadius: '15px'}}>
            <input type="email" placeholder="Email dalo" onChange={(e) => setEmail(e.target.value)} style={{color: '#000', marginBottom: '10px'}} />
            <button onClick={handlePayment} style={{background: 'cyan', color: '#000', padding: '10px 20px', display: 'block'}}>Pay ₹1</button>
        </div>
    );
};

export default Checkout;