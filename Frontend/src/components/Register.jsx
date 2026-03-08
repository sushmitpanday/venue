import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, MapPin, Phone, Briefcase, CreditCard } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://venue-8.onrender.com";

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [idType, setIdType] = useState('Aadhar');
  const [idNumber, setIdNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = {
            fullname: `${firstName} ${lastName}`,
            email: email,
            Password: password,
            phone: phone,
            address: address,
            occupation: occupation,
            govtIdType: idType,
            govtIdNumber: idNumber
        };

        const response = await axios.post(`${API_BASE}/api/auth/owner/register`, payload);
        
        if (response.status === 201 || response.status === 200) {
            alert("✨ Owner Account Created Successfully!");
            navigate('/login');
        }
    } catch (err) {
        alert(err.response?.data?.message || "Registration fail ho gaya.");
    } finally {
        setLoading(false);
    }
  };

  return (
    // Background changed to pink-400
    <div className="min-h-screen bg-pink-400 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Blur forced to White/Rose for Pink Theme */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[120px]"></div>

      {/* Card Background forced to Pink-400 with better border */}
      <div className="w-full max-w-lg bg-pink-400 border border-white/30 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10 my-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-[1.5rem] mb-4 border border-white/30">
            <UserPlus className="text-white" size={30} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            USER <span className="text-rose-800">Verification</span>
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="FIRST NAME" className="input-style-custom pl-4" onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="LAST NAME" className="input-style-custom pl-4" onChange={(e) => setLastName(e.target.value)} required />
          </div>

          <input type="email" placeholder="EMAIL ADDRESS" className="input-style-custom pl-4" onChange={(e) => setEmail(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="tel" placeholder="PHONE" className="input-style-custom pl-4" onChange={(e) => setPhone(e.target.value)} required />
            <input type="text" placeholder="OCCUPATION" className="input-style-custom pl-4" onChange={(e) => setOccupation(e.target.value)} required />
          </div>

          {/* --- GOVT ID SECTION --- */}
          <div className="grid grid-cols-3 gap-4">
            <select 
              className="input-style-custom pl-4 col-span-1 appearance-none cursor-pointer"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
            >
              <option value="Aadhar" className="bg-pink-500 text-white">AADHAR</option>
              <option value="PAN" className="bg-pink-500 text-white">PAN CARD</option>
              <option value="VoterID" className="bg-pink-500 text-white">VOTER ID</option>
              <option value="Driving" className="bg-pink-500 text-white">DL</option>
            </select>
            <div className="relative col-span-2 group">
              {/* <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white" size={16} /> */}
              <input 
                type="text" 
                placeholder="GOVT ID NUMBER" 
                className="input-style-custom pl-10" 
                onChange={(e) => setIdNumber(e.target.value)} 
                required 
              />
            </div>
          </div>

          <textarea placeholder="FULL ADDRESS" rows="2" className="input-style-custom pl-4 pt-3" onChange={(e) => setAddress(e.target.value)} required></textarea>

          <input type="password" placeholder="CREATE PASSWORD" className="input-style-custom pl-4" onChange={(e) => setPassword(e.target.value)} required />

          {/* Button changed to Rose-800 for contrast on Pink bg */}
          <button type="submit" disabled={loading} className="w-full bg-rose-800 hover:bg-rose-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group text-xs uppercase mt-4 shadow-xl">
            {loading ? 'Verifying...' : 'Create Verified Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/20 pt-6">
          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
            Already registered? <Link to="/login" className="text-white hover:text-rose-800 underline">Login</Link>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .input-style-custom {
          width: 100%;
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          padding: 0.8rem 1rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .input-style-custom::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .input-style-custom:focus {
          border-color: white;
          background-color: rgba(255, 255, 255, 0.25);
        }
      `}} />
    </div>
  );
};

export default Register;