import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

// API Configuration
const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-xqee.vercel.app";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ERROR FIX: Ye function "Login" component ke brackets ke andar hi hona chahiye
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        console.log("Requesting to:", `${API_BASE}/api/auth/owner/login`);

        try {
            const response = await axios.post(`${API_BASE}/api/auth/owner/login`, {
                email: email,
                password: password 
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', 'owner'); 
                alert("Login Successful! ✨");
                navigate('/owner-dashboard'); 
            }
        } catch (err) {
            // ERROR FIX: Agar 404 aa raha hai, toh console check karein
            console.error("Login Error:", err.response);
            alert(err.response?.data?.message || "URL Not Found (404). Check Backend Routes!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#031930] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#052b52] border border-white/10 rounded-3xl p-8 shadow-2xl">
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl mb-4">
                        <LogIn className="text-cyan-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Welcome Back</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-cyan-400"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                        <input 
                            type="password" 
                            placeholder="PASSWORD" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-cyan-400"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#031930] font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                    >
                        {loading ? 'Processing...' : 'Login Account'}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest">
                        Don't have an account? 
                        <Link to="/register" className="text-cyan-400 ml-2 font-bold hover:underline italic">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;