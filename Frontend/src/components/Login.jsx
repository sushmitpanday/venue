import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  // Input fields ka data yahan store hoga
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // BACKEND KO DATA BHEJNA: Aapka backend '/api/auth/ownerlogin' par data leta hai
      const response = await axios.post('http://localhost:3000/api/auth/ownerlogin', {
        email: email,
        Password: password // Backend mein 'P' capital hai, isliye yahan bhi 'P' capital rakha hai
      });

      // AGAR LOGIN SAHI HUA:
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Token ko browser mein save kar liya
        alert("Login Successful! ✨");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login fail ho gaya");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};
export default Login