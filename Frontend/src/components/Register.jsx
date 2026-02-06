import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/ownerragister', {
        fullname: fullname,
        email: email,
        Password: password
      });
      alert("Account Created Successfully! ✨");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration fail ho gaya");
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#031930] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#052b52] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl mb-4">
            <UserPlus className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Owner Register</h2>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">List your property with us</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="text" 
              placeholder="FULL NAME" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-xs focus:border-cyan-500 outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setFullname(e.target.value)} 
              required 
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-xs focus:border-cyan-500 outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
            <input 
              type="password" 
              placeholder="CREATE PASSWORD" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-xs focus:border-cyan-500 outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#031930] font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group uppercase text-xs tracking-widest">
            Create Account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">
            Already have an account? 
            <Link to="/login" className="text-cyan-400 ml-2 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;