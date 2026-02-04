import React, { useState } from 'react';
import './auth.css';
import Illustration from './Illustration';
import axios from 'axios';

const OwnerRegister = () => {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
 

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    axios.post('http://localhost:5000/api/auth/owner/register', {
      fullname: ownerName,  
      email,
      Password: Password
    }, { withCredentials: true })
    .then(response => {
      console.log('Owner registered:', response.data);
      // Handle success (e.g., redirect to login page)
    })
    .catch(error => {
      console.error('Error registering owner:', error);
    });

    setOwnerName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container mt-[8%]">
        <Illustration />
        <div className="auth-card h-[500px]">
          <form onSubmit={handleSubmit}>
            <div className="auth-title">Owner Register</div>

            <div className="auth-field">
              <label className="small-muted">Owner name</label>
              <input className="auth-input" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Enter owner name" />
            </div>

            

            <div className="auth-field">
              <label className="small-muted">Email</label>
              <input className="auth-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
            </div>

            <div className="auth-field">
              <label className="small-muted">Password</label>
              <input className="auth-input" value={Password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password" />
            </div>

            <div className="auth-actions">
              <button className="btn-primary" type="submit" >Create account</button>
              <button className="btn-ghost" type="button">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegister;
