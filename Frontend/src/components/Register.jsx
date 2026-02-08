import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

// 1. API Configuration (Dono jagah chalne ke liye)
const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://venue-xqee.vercel.app";

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            fullname: fullname,
            email: email,
            Password: password  // Match with Backend Schema
        };

        // 2. Dynamic API Call
        const response = await axios.post(`${API_BASE}/api/auth/owner/register`, payload);
        
        if (response.status === 201 || response.status === 200) {
            alert("Account Created Successfully! ✨");
            navigate('/login');
        }
    } catch (err) {
        console.error("Registration Error:", err.response?.data);
        alert(err.response?.data?.message || "Registration fail ho gaya.");
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#031930] flex items-center justify-center p-6 text-white uppercase tracking-widest">
      <div className="w-full max-w-md bg-[#052b52] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl mb-4">
            <UserPlus className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">Owner Register</h2>
          <p className="text-gray-400 text-[10px] mt-2 italic">List your property with us</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Field */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="text" 
              placeholder="FULL NAME" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs focus:border-cyan-500 outline-none"
              onChange={(e) => setFullname(e.target.value)} 
              required 
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs focus:border-cyan-500 outline-none"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="password" 
              placeholder="CREATE PASSWORD" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs focus:border-cyan-500 outline-none"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#031930] font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group text-xs">
            Create Account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-gray-400 text-[10px]">
            Already have an account? 
            <Link to="/login" className="text-cyan-400 ml-2 font-bold hover:underline italic">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;