import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, UserCheck } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://venue-8.onrender.com";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate();

    // Ab ye sessionStorage check karega
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/api/auth/owner/login`, { email, password });
            if (response.data.token) {
                // localStorage ki jagah sessionStorage use kiya hai
                sessionStorage.setItem('token', response.data.token);
                
                const userData = response.data.user || { fullname: email.split('@')[0], email };
                sessionStorage.setItem('user', JSON.stringify(userData));
                
                const role = response.data.role || (email === 'admin@rentmyvenue.com' && password === 'addysvenue' ? 'admin' : 'owner');
                sessionStorage.setItem('userRole', role);
                
                alert(`Login Successful! ✨`);
                navigate(role === 'admin' ? '/admin-dashboard' : '/owner-dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickEntry = () => {
        const role = sessionStorage.getItem('userRole');
        navigate(role === 'admin' ? '/admin-dashboard' : '/owner-dashboard');
    };

    return (
        <div className="min-h-screen bg-pink-400 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md bg-pink-400 border border-white/30 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-[2rem] mb-6 border border-white/30">
                        <LogIn className="text-white" size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Welcome <span className="text-rose-800 italic">Back</span>
                    </h2>
                </div>

                {isLoggedIn ? (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-center mb-6">
                            <UserCheck className="mx-auto text-white mb-2" size={30} />
                            <p className="text-white text-xs font-bold uppercase">Session Active</p>
                        </div>
                        <button 
                            onClick={handleQuickEntry}
                            className="w-full bg-rose-800 hover:bg-rose-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-lg"
                        >
                            Continue to Dashboard <ArrowRight size={16} />
                        </button>
                        <button 
                            onClick={() => { sessionStorage.clear(); setIsLoggedIn(false); }}
                            className="w-full text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest mt-2"
                        >
                            Sign in with different account
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" size={18} />
                            <input 
                                type="email" 
                                placeholder="EMAIL ADDRESS" 
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-white focus:bg-white/20 transition-all placeholder:text-white/50" 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

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

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-rose-800 hover:bg-rose-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs mt-4 shadow-lg active:scale-95"
                        >
                            {loading ? 'Processing...' : 'Secure Login'} 
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center pt-4">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                        Don't have an account? <Link to="/register" className="text-white hover:text-rose-800 underline transition-colors">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;