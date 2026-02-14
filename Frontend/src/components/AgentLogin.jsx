import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-q34h.vercel.app";

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
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-[2rem] mb-6 border border-purple-500/20">
                        <ShieldCheck className="text-purple-400" size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Agent <span className="text-purple-400 italic">Portal</span>
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Secure access for authorized agents</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="AGENT EMAIL" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-purple-500/50 focus:bg-black transition-all"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input 
                            type="password" 
                            placeholder="PASSWORD" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-purple-500/50 focus:bg-black transition-all"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white hover:bg-purple-400 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-tighter mt-4"
                    >
                        {loading ? 'Verifying...' : 'Agent Login'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* --- REGISTER LINK SECTION START --- */}
                <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                        New Agent? 
                        <Link to="/agent-register" className="text-white ml-2 hover:text-purple-400 transition-colors underline decoration-purple-500/30 underline-offset-4">
                            Create Agent Account
                        </Link>
                    </p>
                </div>
                {/* --- REGISTER LINK SECTION END --- */}
                
            </div>
        </div>
    );
};

export default AgentLogin;