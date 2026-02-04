import React, {useState } from 'react';
import './auth.css';
import Illustration from './Illustration';
import axios from 'axios';




const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      
      await axios.post('http://localhost:5000/api/auth/owner/login', { email, Password }, { withCredentials: true })
      .then(response => {
      console.log('Owner login:', response.data);
      // Handle success (e.g., redirect to login page)
    })
    
     .catch (err => {
      console.error(err);
    });
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container mt-[10%]">
        <Illustration />
        <div className="auth-card h-[400px]">
          <form onSubmit={handleSubmit}>
            <div className="auth-title">Owner Login</div>

            <div className="auth-field">
              <label className="small-muted">Email</label>
              <input className="auth-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@example.com" />
            </div>

            <div className="auth-field">
              <label className="small-muted">Password</label>
              <input className="auth-input" value={Password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" />
            </div>

            <div className="auth-actions">
              <button className="btn-primary" type="submit" >Sign in</button>
              <button className="btn-ghost" type="button">Forgot?</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
