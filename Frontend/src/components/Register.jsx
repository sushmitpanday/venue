import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

// API Configuration
const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://venue-giv8.vercel.app";

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = {
            fullname: fullname,
            email: email,
            Password: password  // Match with Backend Schema
        };

        const response = await axios.post(`${API_BASE}/api/auth/owner/register`, payload);
        
        if (response.status === 201 || response.status === 200) {
            alert("✨ Account Created Successfully!");
            navigate('/login');
        }
    } catch (err) {
        console.error("Registration Error:", err.response?.data);
        alert(err.response?.data?.message || "Registration fail ho gaya.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 rounded-[2rem] mb-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <UserPlus className="text-cyan-400" size={36} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Owner <span className="text-cyan-400">Register</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Start listing your properties</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Field */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="FULL NAME" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-700 uppercase"
              onChange={(e) => setFullname(e.target.value)} 
              required 
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-700"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="CREATE PASSWORD" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-700"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-cyan-400 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-tighter shadow-xl shadow-white/5 mt-6"
          >
            {loading ? 'Processing...' : 'Create Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-zinc-900 pt-8">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Already have an account? 
            <Link to="/login" className="text-white ml-2 hover:text-cyan-400 transition-colors underline-offset-4 underline">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;