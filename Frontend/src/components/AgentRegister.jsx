import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowRight, Phone, MapPin, Briefcase, CreditCard, Globe } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-8.onrender.com";

const AgentRegister = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
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
                email,
                password,
                phone,
                address,
                city,
                state,
                pincode,
                occupation,
                govtIdType: idType,
                govtIdNumber: idNumber
            };

            await axios.post(`${API_BASE}/api/auth/agent/register`, payload);
            alert("Agent Registration Successful! 🚀");
            navigate('/agent-login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main Background changed to Pink 400
        <div className="min-h-screen bg-pink-400 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            
            {/* Ambient Background Glow - Changed to White/Rose */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/20 rounded-full blur-[120px]"></div>

            {/* Card Background: Pink-400 with Glassmorphism Border */}
            <div className="w-full max-w-lg bg-pink-400 border border-white/30 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 my-10">
                <div className="text-center mb-8">
                    {/* Icon Container with White Theme */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-[1.5rem] mb-4 border border-white/30">
                        <UserPlus className="text-white" size={30} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                        Agent <span className="text-rose-800">Onboarding</span>
                    </h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Name Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="FIRST NAME" className="input-style-pink" onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="LAST NAME" className="input-style-pink" onChange={(e) => setLastName(e.target.value)} required />
                    </div>

                    <input type="email" placeholder="AGENT EMAIL" className="input-style-pink" onChange={(e) => setEmail(e.target.value)} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input type="tel" placeholder="PHONE" className="input-style-pink" onChange={(e) => setPhone(e.target.value)} required />
                        <input type="text" placeholder="SPECIALIZATION" className="input-style-pink" onChange={(e) => setOccupation(e.target.value)} required />
                    </div>

                    {/* City & State Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            {/* <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white" size={14} /> */}
                            <input type="text" placeholder="CITY" className="input-style-pink pl-10" onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="relative group">
                            {/* <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white" size={14} /> */}
                            <input type="text" placeholder="STATE" className="input-style-pink pl-10" onChange={(e) => setState(e.target.value)} required />
                        </div>
                    </div>

                    {/* Govt ID & Pincode Selection */}
                    <div className="grid grid-cols-3 gap-4">
                        <select 
                            className="input-style-pink col-span-1 appearance-none cursor-pointer"
                            value={idType}
                            onChange={(e) => setIdType(e.target.value)}
                        >
                            <option value="Aadhar" className="bg-pink-500 text-white">AADHAR</option>
                            <option value="PAN" className="bg-pink-500 text-white">PAN CARD</option>
                            <option value="VoterID" className="bg-pink-500 text-white">VOTER ID</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="GOVT ID NO." 
                            className="input-style-pink col-span-1" 
                            onChange={(e) => setIdNumber(e.target.value)} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="PINCODE" 
                            className="input-style-pink col-span-1" 
                            onChange={(e) => setPincode(e.target.value)} 
                            required 
                        />
                    </div>

                    <textarea placeholder="OFFICE / HOME ADDRESS" rows="2" className="input-style-pink pt-3" onChange={(e) => setAddress(e.target.value)} required></textarea>

                    <input type="password" placeholder="CREATE PASSWORD" className="input-style-pink" onChange={(e) => setPassword(e.target.value)} required />

                    {/* Action Button - Rose 800 for contrast */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-rose-800 hover:bg-rose-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-tighter mt-4 shadow-lg active:scale-95"
                    >
                        {loading ? 'Verifying...' : 'Complete Registration'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/20">
                    <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">
                        Part of the team? <Link to="/agent-login" className="text-white hover:text-rose-800 underline ml-1">Login</Link>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .input-style-pink {
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
                .input-style-pink::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                .input-style-pink:focus {
                    border-color: white;
                    background-color: rgba(255, 255, 255, 0.25);
                }
                select.input-style-pink {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.7rem center;
                    background-size: 1rem;
                }
            `}} />
        </div>
    );
};

export default AgentRegister;