import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-8.onrender.com";

const AgentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_BASE}/api/auth/agent/login`, {
                email: email,
                password: password 
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', 'agent');
                
                alert(`Agent Login Successful! Welcome ${response.data.user?.fullname || "Agent"} ✨`);
                navigate('/agent-dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Agent Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main Background changed to Pink 400
        <div className="min-h-screen bg-pink-400 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            
            {/* Ambient Background Glow - Changed to White/Rose */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Card Background: Pink-400 with Glassmorphism Border */}
            <div className="w-full max-w-md bg-pink-400 border border-white/30 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10">
                <div className="text-center mb-12">
                    {/* Icon Container with White/Pink Theme */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-[2rem] mb-6 border border-white/30">
                        <ShieldCheck className="text-white" size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Agent <span className="text-rose-800 italic">Portal</span>
                    </h2>
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Secure access for authorized agents</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Agent Email Input */}
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="AGENT EMAIL" 
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-white focus:bg-white/20 transition-all placeholder:text-white/50"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" size={18} />
                        <input 
                            type="password" 
                            placeholder="PASSWORD" 
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-white focus:bg-white/20 transition-all placeholder:text-white/50"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Action Button - Rose 800 for high contrast */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-rose-800 hover:bg-rose-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-tighter mt-4 shadow-lg active:scale-95"
                    >
                        {loading ? 'Verifying...' : 'Agent Login'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* Register Link Section */}
                <div className="mt-8 pt-6 border-t border-white/20 text-center">
                    <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">
                        New Agent? 
                        <Link to="/agent-register" className="text-white ml-2 hover:text-rose-800 transition-colors underline decoration-white/30 underline-offset-4">
                            Create Agent Account
                        </Link>
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default AgentLogin;