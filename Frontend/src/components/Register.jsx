import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // BACKEND KO DATA BHEJNA: Aapka backend '/api/auth/ownerragister' par data leta hai
            const res = await axios.post('http://localhost:3000/api/auth/ownerragister', {
                fullname: fullname,
                email: email,
                Password: password // Backend mein 'P' capital hai
            });

            alert("Account ban gaya! ✨ Ab login karein.");
            navigate('/login'); // Account banne ke baad login page par bhej do
        } catch (err) {
            alert(err.response?.data?.message || "Registration fail ho gaya");
        }
    };

    return (
        <div style={{ backgroundColor: '#031930', color: 'white', height: '100vh', padding: '20px' }}>
            <h2>Owner Registration</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
                <input type="text" placeholder="Full Name" onChange={(e) => setFullname(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;