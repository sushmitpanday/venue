import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Phone, ArrowLeft, Download, Calendar, Tag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Optional: npm install canvas-confetti (for celebration)

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL se details uthana (Checkout.jsx se jo humne bheja tha)
    const paymentId = searchParams.get('reference');

    useEffect(() => {
        // Ek chota sa celebration effect
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#ffffff', '#22d3ee']
        });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 text-center shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)]"
            >
                {/* Success Animation Icon */}
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20"
                >
                    <CheckCircle2 size={56} className="text-cyan-400" />
                </motion.div>

                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Booking Confirmed!</h1>
                <p className="text-zinc-500 text-sm mb-8 px-4">
                   Congrats! Your venue booking is confirmed. Check your SMS and Email for the details.
                </p>

                {/* Info Card */}
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-6 mb-8 text-left space-y-5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <Tag className="text-cyan-400" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Payment Reference</p>
                            <p className="text-sm font-mono text-zinc-300">{paymentId || "TXN_92837465"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <MapPin className="text-cyan-400" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Venue Details</p>
                            <p className="text-sm text-zinc-300">Address updated under My Bookings in your profile.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <Phone className="text-cyan-400" size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Support Helpline</p>
                            <p className="text-sm text-zinc-300">+91 99999-XXXXX (24/7 Support)</p>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="grid grid-cols-1 gap-3">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.print()} 
                        className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <Download size={20} /> Download Receipt
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/user-dashboard')} 
                        className="w-full bg-transparent text-zinc-400 py-5 rounded-2xl font-bold uppercase border border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-900 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} /> Go to My Bookings
                    </motion.button>
                </div>

                <p className="mt-8 text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold">
                    Rent My Venue • Secure Payment Powered by Razorpay
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;