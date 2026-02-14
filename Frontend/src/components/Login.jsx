import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

// API Configuration
const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-fzah.vercel.app";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_BASE}/api/auth/owner/login`, {
                email: email,
                password: password 
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const role = response.data.role || (email === 'admin@gmail.com' && password === 'admin123' ? 'admin' : 'owner');
                localStorage.setItem('userRole', role);

                alert(`Login Successful as ${role.toUpperCase()}! ✨`);

                if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/owner-dashboard');
                }
            }
        } catch (err) {
            console.error("Login Error:", err.response);
            alert(err.response?.data?.message || "Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
                
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 rounded-[2rem] mb-6 border border-cyan-500/20">
                        <LogIn className="text-cyan-400" size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Welcome <span className="text-cyan-400 italic">Back</span>
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Enter credentials to access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-700"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="password" 
                            placeholder="PASSWORD" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-700"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-[9px] font-black text-zinc-600 hover:text-cyan-400 uppercase tracking-widest transition-colors">Forgot Password?</button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-tighter shadow-lg shadow-white/5 mt-4"
                    >
                        {loading ? 'Processing...' : 'Secure Login'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-zinc-900 pt-8">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                        New to the platform? 
                        <Link to="/register" className="text-white ml-2 hover:text-cyan-400 transition-colors underline-offset-4 underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;